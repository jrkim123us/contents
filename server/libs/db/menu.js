var mongoose = require('mongoose'),
	tree = require('mongoose-tree2'),
	Schema = mongoose.Schema;

var schema = new Schema({
	name       : {type: String},
	parentName : {type: String},
	link       : {type: String},
	icon       : {type: String},
	parent     : {type: Schema.ObjectId}
});
schema.plugin(tree);

var handleError = function(err) {
	for(var error in err.errors) {
		console.log(error.message);
	}
};
schema.statics.initialize = function (callback) {
	// http://www.codeproject.com/Articles/521713/Storing-Tree-like-Hierarchy-Structures-With-MongoD
	var menus = [
		new Menu({name : 'Root'}),
		// new Menu({parentName: 'Root', name : 'Home', link : '#home'}),
		new Menu({parentName: 'Root', name : 'ToDo', link : '#todo'}),
		new Menu({parentName: 'Root', name : 'Planner', link : '#planner'}),
		new Menu({parentName: 'Root', name : 'Project', link : '#'}),
		new Menu({parentName: 'Root', name : 'BBS', link : '#bbs'}),
		new Menu({parentName: 'Root', name : 'Settings', link : '#settings'}),

		new Menu({parentName: 'Project', name : 'Setup & Plan', link : '#'}),
		new Menu({parentName: 'Project', name : 'Exceution & Control', link : '#'}),
		new Menu({parentName: 'Project', name : 'Risks & Issues', link : '#'}),

		new Menu({parentName: 'Setup & Plan', name : 'Project profile', link : '#project/profile', icon: 'icon-home'}),
		new Menu({parentName: 'Exceution & Control', name : 'Task Gantt', link : '/tasks/gantt/1.4.1.1.1.1', icon: 'icon-play'}),
		new Menu({parentName: 'Exceution & Control', name : 'Task Sync', link : '/tasks/sync/1', icon: 'icon-th-list'}),
		new Menu({parentName: 'Exceution & Control', name : 'Weekly Task Result', link : '#project/result', icon: 'icon-flag'}),
		new Menu({parentName: 'Exceution & Control', name : 'Weekly Task Approval', link : '#project/approval', icon: 'icon-lock'}),
		new Menu({parentName: 'Exceution & Control', name : 'Task Progress', link : '#project/progress', icon: 'icon-signal'}),
		new Menu({parentName: 'Exceution & Control', name : 'Milestone', link : '#project/milestone', icon: 'icon-th-large'}),
		new Menu({parentName: 'Risks & Issues', name : 'Risks', link : '#project/risk', icon: 'icon-search'}),
		new Menu({parentName: 'Risks & Issues', name : 'Issues', link : '#project/issue', icon: 'icon-tag'})
	];

	var result = [];

	// taskInit에 정의된 데이터를 DB에 등록한다.
	function saveAll() {
		var menu= menus.shift();

		menu.save(function(err, saved) {
			if(err) throw err;
			result.push(saved[0]);

			if(menus.length > 0)
				saveAll();
			else
				// 등록된 데이터의 parent 정보를 조회한다.
				findParent();
		});
	}
	function findParent() {
		Menu.find({parentName: {$exists: true}}, function(err, data) {
			if(err) throw err;
			// 데이터 별로 parent정보를 저장한다.
			updateParent(data);
		});
	}
	function updateParent(data) {
		var child = data.shift();

		Menu.find({name: child.parentName}, function(err, parent) {
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
// Define some "static" or "instance" methods
schema.statics.getAll = function (callback) {
	this
		.find({})
		.execFind(callback);
};

schema.statics.getChildrenTree = function (callback) {
	this.findOne({name: 'Root'}, function(err, root) {
		root.getChildrenTree({
			columns: 'name link'
		}, callback);
	});
};

schema.statics.getTabs = function (parent, callback) {
	this.findOne({name: parent}, function(err, parent) {
		if(parent) {
			Menu.find({
				path : {$regex : '^' + parent.path + '#'},
				link : {$regex : '^.{2,}$'}
			})
				.select('name link icon')
				.exec(callback);
		} else {
			callback();
		}
	});
};


schema.statics.insert = function (menu) {
	var newMenu = new Menu(menu);
	newMenu.save(function(err) {
		if(err)
			return handleError(err);
	});
};

var Menu = mongoose.model('Menu', schema);
// Export the model
module.exports = Menu;
