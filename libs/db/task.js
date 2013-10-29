var mongoose = require('mongoose'),
	debug = require('debug')('db'),
	tree = require('mongoose-tree2'),
	Schema = mongoose.Schema;

var schema = new Schema({
	parent    : {type: Schema.ObjectId, ref: 'Task'},
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
	// worker    : {type : Schema.Types.Mixed},
	// approver  : {type : Schema.Types.Mixed},
	worker    : [{type: Schema.ObjectId, ref: 'User'}],
	approver  : [{type: Schema.ObjectId, ref: 'User'}]
	// test : [ {type: Schema.ObjectId, ref: 'User'}]
});
schema.plugin(tree);

var handleError = function(err) {
	for(var error in err.errors) {
		console.log(error.message);
	}
};

schema.statics.initialize = function (callback) {
	/*var w1 = new Task({
		wbs: '1', name: '과학화전투훈련단 중앙통제장비체계 체계개발사업', weight : 100, plan: 82.7, act: 0,
		start : '2010.10.01', end: '20151212', startDate: new Date('10.01.2010'), endDate: new Date('12.12.2015')
	}),
	w1_1 = new Task({
		parent: w1, parentWbs: '1', wbs: '1.1', name: 'Milestone', weight : 0, plan: 82.7, act: 0,
		start: '2010.10.01', end: '2015.12.12', startDate: new Date('10.01.2010'), endDate: new Date('12.12.2015'),
		worker: [{name: '김후정', id: '00001'}]
	}),
	w1_2 = new Task({
		parent: w1, parentWbs: '1', wbs: '1.2', name: '사업관리(6종)', weight : 3.4, plan: 30.3, act: 0,
		start: '2010.10.01', end: '2012.12.26', startDate: new Date('10.01.2010'), endDate: new Date('12.26.2012'),
		worker: [{name: '김후정', id: '00001'}], approver: [{name: '김종록', id: '00002'}, {name:'김철수', id: '00004'}]
	});*/

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
			else
				// 등록된 데이터의 parent 정보를 조회한다.
				findParent();
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
					callback();
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

schema.statics.getTasksByParent = function (parentWbs, callback) {
// schema.statics.getTasksByParent = function (parentWbs) {
	this.find({parentWbs : parentWbs})
		.select('_id wbs name weight plan act start end worker approver test')
		.populate('worker approver', 'name.full email')
		.sort({wbs : 1})
		.exec(callback);
	/*return this.find({parentWbs : parentWbs})
		.select('_id wbs name weight plan act start end worker approver test')
		.populate('worker approver', 'name email')
		.sort({wbs : 1})
		.exec();*/
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
schema.statics.setTask = function (task, callback) {
	delete task._id;
	Task.update({wbs: task.wbs}, task, callback);
};

var Task = mongoose.model('Task', schema);
// Export the model
module.exports = Task;