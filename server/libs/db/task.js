require('date-utils');

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
	/*start      : {type:String},
	end        : {type:String},*/
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
	// 중요 node.js의 getMonth는 1월이 0임
	// return this.startDate.getFullYear() + '-' + (this.startDate.getMonth() + 1) + '-' + this.startDate.getDate() ;
	return (!this.startDate || !this.leaf) ? undefined : this.startDate.toYMD();
});
schema.virtual('progress').get(function () {
	return this.act ? this.act / 100.0 : 0.0;
});
schema.virtual('duration').get(function () {
	var result;
	if(this.leaf && this.startDate && this.endDate)
		if(this.startDate.equals(this.endDate))
			result = "0";
		else
			result = (this.startDate.getDaysBetween(this.endDate) + 1) + "";
	return result;
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

var convertDateForSave = function(task) {
	var msecPerDay = 1000 * 60 * 60 * 24, msceWorkHour = 1000 * 60 * 60 * (8 + 1), // 점심 시간 포함 9시간.;;
		addedMsce, workStartHour = 8;
	task.startDate = new Date(task.startDate);
	task.startDate.setHours(workStartHour);

	if(task.duration === 0) // milestone
		addedMsce = 0;
	else if(task.duration === 1) // 기간이 하루일 경우 8 + 1 시간만 더함
		addedMsce = msceWorkHour;
	else
		addedMsce = (task.duration - 1) * msecPerDay + msceWorkHour;

	task.endDate = new Date();
	task.endDate.setTime(task.startDate.getTime() + addedMsce);
};

var saveTaskForPromise = function(task) {
	var deferred = Q.defer();
	task.save(function(err, saved) {
		if(err) deferred.reject(err);
		else deferred.resolve(saved);
	});
	return deferred.promise;
};

var getStartToEndTasks = function (parentId, gte, lte, inc) {
	var conditon = {$gte: gte};
	if(lte)
		conditon.$lte = lte;
	var query = Task.find({
			parent : parentId,
			localIndex : conditon
		})
		.select('_id wbs localIndex')
		.sort({localIndex : -1 * inc});
	return execDeferer(query);
};

var shiftTasksIndex = function(tasks, parentWbs, inc) {
	var deferer = Q.defer();
	// 주의 : async.every or async.each를 쓰면 데이터가 꼬임.
	async.eachSeries(tasks, function(task, callback) {
		var newWbs = parentWbs + '.' + (task.localIndex + inc);
		var newIndex = task.localIndex + inc;
		setTaskIndex(task, newIndex, newWbs, null, callback);
	}, function(err) {
		if(err)
			deferer.reject(err);
		else
			deferer.resolve();
	});
	return deferer.promise;
};
var setTaskIndex = function(task, newIndex, newWbs, parentId, callback) {
	if(parentId) task.parent = parentId;
	task.localIndex = newIndex;
	task.save(function(err, saved) {
		if(err) throw err;
		getSubTasksByWbs(saved)
			.then(function(subTasks) {
				return setSubTasksWbs(subTasks, saved.wbs, newWbs);
			})
			.fail(function(err) {
				if(callback)
					callback(err);
			})
			.done(function(subTasks) {
				if(callback)
					callback(null);
			});
	});
};

var setSubTasksWbs = function(tasks, oldWbs, newWbs) {
	var deferer = Q.defer();
	async.every(tasks, function(task, callback) {
		task.wbs = task.wbs.replace(oldWbs, newWbs);
		task.save(function (err, saved) {
			if(err) throw err;
			callback();
		});
	}, function(err) {
		if(err)
			deferer.reject(err);
		else
			deferer.resolve();
	});
	return deferer.promise;
};

var getSubTasksByWbs = function(task) {
	var regWbs,	wbs = task.wbs.replace('.', '\.');
	regWbs = new RegExp('(^' + wbs + '$|^' + wbs + '[^0-9])');
	var query = Task.find({wbs : regWbs})
					.select('_id wbs')
					.sort({localIndex : 1});

	return execDeferer(query);
};

schema.statics.initialize = function (callback) {
	var tasks = require('./taskInit')(Task);

	var result = [];

	// taskInit에 정의된 데이터를 DB에 등록한다.
	function saveAll() {
		var task = tasks.shift();
		var splited = task.wbs.split('.');
		task.localIndex = splited[splited.length - 1];
		// task.startDate.setHours(8);

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
	});
};

schema.statics.getGantt = function (wbs, callback) {
	var regWbs;
	wbs = wbs.replace('.', '\.');
	regWbs = new RegExp('(^' + wbs + '$|^' + wbs + '[^0-9])');

	this.find({wbs : regWbs})
		.select('_id parent wbs name act text startDate endDate progress start_date duration leaf worker approver desc')
		// .populate('worker approver', 'name email')
		.sort({wbs : 1})
		.exec(callback);
};
schema.statics.getTask = function (wbs, callback) {
	this.findOne({wbs : wbs})
		.select('-_id wbs name')
		.exec(callback);
};
schema.statics.setTask = function (task) {
	if(task.parent || task.parent === 0) delete task.parent; // 부모 변경은 별도의 기능으로
	convertDateForSave(task);

	var query = Task.update({_id: task.id}, task);
	return execDeferer(query);
};
schema.statics.shiftTasks = function (shift) {
	var deferer = Q.defer();
	return getStartToEndTasks(shift.parent.id, shift.start, shift.end, shift.inc)
		.then(function(docs) {
			debug('shiftTasksIndex');
			return shiftTasksIndex(docs, shift.parent.wbs, shift.inc);
		});
};
schema.statics.setMovedTaskIndex = function(moved) {
	var deferer = Q.defer();
	// var moved = params.moved;
	var newWbs = moved.parent.wbs + '.' + moved.index;

	this.findOne({_id : moved.id})
		.select('_id wbs parent')
		.exec(function(err, task) {
			var parentId;
			if(err)
				deferer.reject(err);
			if(moved.parent.id !== task.parent)
				parentId = moved.parent.id;
			setTaskIndex(task, moved.index, newWbs, parentId, function() {
				deferer.resolve();
			});
		});
	return deferer.promise;
};
schema.statics.setParentDate = function(parentId, isStart, isEnd) {
	// 부모의 start / end
	// children의 min start / max end
	var deferer = Q.defer();
	async.parallel({
		parent : function(callback) {
			Task.findOne({_id : parentId})
				.select('_id startDate endDate parent')
				.exec(callback);
		},
		minStartDate : function(callback) {
			if(isStart)
				Task.findOne({parent : parentId})
					.select('-_id startDate')
					.sort({startDate : 1})
					.exec(callback);
			else
				callback(null, {});
		},
		maxEndDate : function(callback) {
			if(isEnd)
				Task.findOne({parent : parentId})
					.select('-_id endDate')
					.sort({endDate : -1})
					.exec(callback);
			else
				callback(null, {});
		}
	}, function(err, docs) {
		if(err)
			deferer.reject(err);
		var isParentStart = false, isParentEnd = false,
			parent = docs.parent,
			minStartDate = docs.minStartDate.startDate,
			maxEndDate = docs.maxEndDate.endDate;

		if(isStart && minStartDate && parent.startDate.getTime() !== minStartDate.getTime()) {
			parent.startDate = minStartDate;
			isParentStart = true;
		}

		if(isEnd && maxEndDate && parent.endDate.getTime() !== maxEndDate.getTime()) {
			parent.endDate = maxEndDate;
			isParentEnd = true;
		}
		saveTaskForPromise(parent)
			.then(function() {
				if(parent.parent && (isParentStart || isParentEnd))
					return Task.setParentDate(parent.parent, isParentStart, isParentEnd);
			})
			.fail(function(err) {
				deferer.reject(err);
			})
			.done(function(docs) {
				deferer.resolve(docs);
			});
	});

	return deferer.promise;
};
schema.statics.addTask = function (task) {
	// new Task(task).save(callback);
	convertDateForSave(task);
	var newTask = new Task(task);

	return saveTaskForPromise(newTask);
};
schema.statics.checkTaskLeaf = function (id) {
	/*var query = Task.update({_id : id}, {
		leaf : false
	});*/
	var deferer = Q.defer();
	// 자식 Task의 존재 유무를 확인하여 leaf 값 변경
	Task.findOne({parent : id}, function(err, child) {
		var leaf = true;
		if(err) deferer.reject(err);
		if(child)
			leaf = false;
		Task.update({_id : id}, {leaf : leaf})
			.exec(function(err) {
				if(err) deferer.reject(err);
				else deferer.resolve(leaf);
			});
	});

	return deferer.promise;
};

schema.statics.removeTask = function (params) {
	// 먼저 삭제 대상(정보 일치)이 있는지 확인한다.
	var deferer = Q.defer();
	Task.findOne({
		_id : params.id,
		wbs : params.wbs
	}, function(err, task){
		if(err) deferer.reject(err);
		if(!task) deferer.reject('삭제할 대상이 존재한지 않습니다.');

		params.wbs = params.wbs.replace('.', '\.');
		regWbs = new RegExp('(^' + params.wbs + '$|^' + params.wbs + '[^0-9])');

		Task.find({wbs : regWbs})
			.remove()
			.exec(function(err) {
				if(err) deferer.reject(err);
				else deferer.resolve();
			});
	});
	return deferer.promise;
};

var Task = mongoose.model('Task', schema);
// Export the model
module.exports = Task;