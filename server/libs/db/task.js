var mongoose = require('mongoose'),
	debug = require('debug')('db'),
	tree = require('mongoose-tree2'),
	Q = require("q"),
	Schema = mongoose.Schema;

var schema = new Schema({
	parent    : {type: Schema.ObjectId, ref: 'Task'},
	taskId    : {type: Number},
	wbs       : {type: String},
	parentWbs : {type: String},
	name      : {type: String},
	weight    : {type: Number, min: 0, max: 100},
	plan      : {type: Number, min: 0, max: 100},
	act       : {type: Number, min: 0, max: 100},
	start     : {type:String},
	end       : {type:String},
	startDate : {type: Date},
	endDate   : {type: Date},
	worker    : [{type: Schema.ObjectId, ref: 'User'}],
	approver  : [{type: Schema.ObjectId, ref: 'User'}],
	desc       : {type:String},
	leaf : {type: Boolean}
});
schema.virtual('text').get(function () {
	return this.name;
});
schema.virtual('start_date').get(function () {
	if(!this.startDate || !this.leaf) return undefined;
	// 중요 node.js의 getMonth는 1월이 0임
	return this.startDate.getFullYear() + '-' + (this.startDate.getMonth() + 1) + '-' + this.startDate.getDate() ;
});
schema.virtual('progress').get(function () {
	return this.act ? this.act / 100.0 : 0.0;
});
schema.virtual('duration').get(function () {
	var msecPerDay = 1000 * 60 * 60 * 24;
	return (!this.leaf || this.endDate  === undefined || this.startDate === undefined) ? undefined : ((this.endDate.getTime() - this.startDate.getTime()) / msecPerDay) + "";
});
schema.set('toJSON', {
	virtuals: true
});
schema.plugin(tree);

var taskDeferer = function(queryFn) {
	var deferred = Q.defer();
	queryFn.exec(function(err, result) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
};

schema.statics.initialize = function (callback) {
	var tasks = require('./taskInit')(Task);

	var result = [];

	// taskInit에 정의된 데이터를 DB에 등록한다.
	function saveAll() {
		var task= tasks.shift();

		task.save(function(err, saved) {
			if(err) throw err;
			result.push(saved[0]);

			if(tasks.length > 0)
				saveAll();
			else {
				// 등록된 데이터의 parent 정보를 조회한다.
				findParent();
			}
		});
	}
	function findLeaf() {
		Task.find()
			.select('_id parent wbs')
			// .limit(10)
			.exec(function(err, data) {
				if(err) throw err;
				checkLeaf(data);
			});
	}
	function checkLeaf(data) {
		var current = data.shift();

		Task.find({parent: current._id})
			.select('_id parent wbs')
			.exec( function(err, child) {
				if(err) throw err;
				if(child.length === 0 ) {
					current.leaf = true;
					current.save();
				}

				if(data.length > 0)
					checkLeaf(data);
				else
					callback();
			});
	}
	function findParent() {
		Task.find({parentWbs: {$exists: true}}, function(err, data) {
			if(err) throw err;
			// 데이터 별로 parent정보를 저장한다.
			updateParent(data);
		});
	}
	function updateParent(data) {
		var child = data.shift();

		Task.find({wbs: child.parentWbs}, function(err, parent) {
			child.parent = parent[0]._id;
			child.save(function() {
				if(data.length > 0)
					updateParent(data);
				else
					findLeaf(); // 최하위 항목을 체크한다.
					// callback();
			});
		});
	}

	// 데이터 등록 시작!!
	saveAll();
};

schema.statics.initializeUser = function (User, callback) {
	User.getAllId(function(err, userDoc){
		Task.update({},{
			worker   : [userDoc[0]._id, userDoc[1]._id],
			approver : [userDoc[2]._id, userDoc[3]._id]
		}, {multi:true}, callback);
		/*Task.find({}, function(err, doc) {
			doc.test = userDoc;
			doc.save();
		})*/
	});
};

schema.statics.getGantt = function (wbs, callback) {
	var regWbs;
	wbs = wbs.replace('.', '\.');
	regWbs = new RegExp('(^' + wbs + '$|^' + wbs + '[^0-9])');

	this.find({wbs : regWbs})
		.select('_id parent wbs name act startDate endDate text start_date progress duration leaf worker approver desc')
		// .populate('worker approver', 'name email')
		.sort({wbs : 1})
		.exec(callback);
};
schema.statics.getTask = function (wbs, callback) {
// schema.statics.getTask = function (wbs) {
	this.findOne({wbs : wbs})
		.select('-_id wbs name')
		.exec(callback);
	/*return this.findOne({wbs : wbs})
		.select('-_id wbs name')
		.exec();*/
};
schema.statics.getTasksByParent = function (parentWbs, callback) {
	this.find({parentWbs : parentWbs})
		.select('_id wbs name weight plan act start end worker approver')
		.populate('worker approver', 'name email')
		.sort({wbs : 1})
		.exec(callback);
};
schema.statics.setTask = function (task, callback) {
	delete task._id;
	Task.update({wbs: task.wbs}, task, callback);
};
schema.statics.getStartToEndTasks = function (params) {
	var query = this.find({ '_id' : {$in: [params.start, params.end]}})
					.select('_id wbs taskId name')
					.sort({taskId : 1});
	return taskDeferer(query);
};
schema.statics.shiftTasks = function(tasks, inc) {
	var condition, query;
	if(tasks.length > 1)
		condition = {taskId: {$gte: tasks[0].taskId, $lte : tasks[1].taskId}};
	else
		condition = {tasksId: tasks[0].tasksId};

	query = this.find(condition);
	return taskDeferer(query);
};
schema.statics.resetWbs = function (parentWbs, childrenIds) {
	var query = this.find({wbs : parentWbs});
	return taskDeferer(query);
};
schema.statics.addTask = function (task, callback) {
	new Task(task).save(callback);
};
schema.statics.removeTask = function (wbs, callback) {
	this.findOne({wbs: wbs})
		.remove()
		.exec(callback);
};

var Task = mongoose.model('Task', schema);
// Export the model
module.exports = Task;