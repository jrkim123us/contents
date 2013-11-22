var mongoose = require('mongoose'),
	debug = require('debug')('db'),
	tree = require('mongoose-tree2'),
	Q = require("q"),
	async = require('async'),
	Schema = mongoose.Schema;

var schema = new Schema({
	parent     : {type: Schema.ObjectId, ref: 'Task'},
	taskId     : {type: Number},
	localIndex : {type: Number},
	wbs        : {type: String},
	parentWbs  : {type: String},
	name       : {type: String},
	weight     : {type: Number, min: 0, max: 100},
	plan       : {type: Number, min: 0, max: 100},
	act        : {type: Number, min: 0, max: 100},
	start      : {type:String},
	end        : {type:String},
	startDate  : {type: Date},
	endDate    : {type: Date},
	worker     : [{type: Schema.ObjectId, ref: 'User'}],
	approver   : [{type: Schema.ObjectId, ref: 'User'}],
	desc       : {type:String},
	leaf       : {type: Boolean}
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
// schema.plugin(tree);

var execDeferer = function(queryFn) {
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
		var task = tasks.shift();
		var splited = task.wbs.split('.');
		task.localIndex = splited[splited.length - 1];

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
schema.statics.setTaskParent = function (params) {
	// var query = this.find({_id: params.moved.id});
	var query = this.update({_id: params.moved.id },{parent : params.parent.id});
	return execDeferer(query);
};
schema.statics.shiftTasks = function (shift) {
	var deferer = Q.defer();
	return Task.getStartToEndTasks(shift.parent.id, shift.start, shift.end, shift.inc)
		.then(function(docs) {
			return Task.shiftTasksIndex(docs, shift.parent.wbs, shift.inc);
		});


};
schema.statics.getStartToEndTasks = function (parentId, gte, lte, inc) {
	var conditon = {$gte: gte};
	if(lte)
		conditon.$lte = lte;
	var query = this.find({
			parent : parentId,
			localIndex : conditon
		})
		.select('_id wbs localIndex')
		.sort({localIndex : -1 * inc});
	return execDeferer(query);
};
// schema.statics.shiftTasksIndex = function(params, tasks) {
schema.statics.shiftTasksIndex = function(tasks, parentWbs, inc) {
	var deferer = Q.defer();
	// 주의 : async.every or async.each를 쓰면 데이터가 꼬임.
	async.eachSeries(tasks, function(task, callback) {
		var newWbs = parentWbs + '.' + (task.localIndex + inc);
		var newIndex = task.localIndex + inc;
		Task.setTaskIndex(task, newIndex, newWbs, null, callback);
	}, function(err) {
		if(err)
			deferer.reject();
		else
			deferer.resolve();
	});
	return deferer.promise;
};


schema.statics.setTaskIndex = function(task, newIndex, newWbs, parentId, callback) {
	if(parentId) task.parent = parentId;
	task.localIndex = newIndex;
	task.save(function(err, saved) {
		if(err) throw err;
		Task.getSubTasksByWbs(saved)
			.then(function(subTasks) {
				return Task.setSubTasksWbs(subTasks, saved.wbs, newWbs);
			})
			.done(function(subTasks) {
				if(callback)
					callback(null);
			});
	});
};
schema.statics.setSubTasksWbs = function(tasks, oldWbs, newWbs) {
	var deferer = Q.defer();
	async.every(tasks, function(task, callback) {
		task.wbs = task.wbs.replace(oldWbs, newWbs);
		task.save(function (err, saved) {
			if(err) throw err;
			callback();
		});
	}, function(err) {
		if(err)
			deferer.reject();
		else
			deferer.resolve();
	});
	return deferer.promise;
};

schema.statics.getSubTasksByWbs = function(task) {
	var regWbs,	wbs = task.wbs.replace('.', '\.');
	regWbs = new RegExp('(^' + wbs + '$|^' + wbs + '[^0-9])');
	var query = Task.find({wbs : regWbs})
					.select('_id wbs')
					.sort({localIndex : 1});

	return execDeferer(query);
};
// schema.statics.setMovedTaskIndex = function(params) {
schema.statics.setMovedTaskIndex = function(moved) {
	var deferer = Q.defer();
	// var moved = params.moved;
	var newWbs = moved.parent.wbs + '.' + moved.index;

	this.findOne({_id : moved.id})
		.select('_id wbs localIndex')
		.exec(function(err, task) {
			var parentId;
			if(err)
				deferer.reject();
			if(moved.parent.id !== task.parent)
				parentId = moved.parent.id;
			Task.setTaskIndex(task, moved.index, newWbs, parentId, function() {
				deferer.resolve();
			});
		});
	return deferer.promise;
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