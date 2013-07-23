var mongoose = require('mongoose'),
	tree = require('mongoose-tree2'),
	Schema = mongoose.Schema;

var schema = new Schema({
	name   : {type: String},
	link   : {type:String},
	parent : {type:Schema.ObjectId}
});
schema.plugin(tree);

var handleError = function(err) {
	for(var error in err.errors) {
		console.log(error.message);
	}
};
schema.statics.initialize = function (callback) {
	// http://www.codeproject.com/Articles/521713/Storing-Tree-like-Hierarchy-Structures-With-MongoD
	var root = new Menu({name : 'Root'});

	var home = new Menu({name : 'Home', link : '#home'}),
		todo = new Menu({name : 'ToDo', link : '#todo'}),
		planner = new Menu({name : 'Planner', link : '#planner'}),
		project = new Menu({name : 'Project', link : '#'}),
		bbs = new Menu({name : 'BBS', link : '#bbs'}),
		settings = new Menu({name : 'Settings', link : '#settings'});

	home.parent     = root;
	todo.parent     = root;
	planner.parent   = root;
	project.parent  = root;
	bbs.parent      = root;
	settings.parent = root;

	var setupPlan = new Menu({name : 'Setup & Plan', link : '#'}),
		execControl = new Menu({name : 'Exceution & Control', link : '#'}),
		risksIssues = new Menu({name : 'Risks & Issues', link : '#'});

	setupPlan.parent   = project;
	execControl.parent = project;
	risksIssues.parent = project;

	var projectProfile = new Menu({name : 'Project profile', link : '#project/profile'}),
		schedule = new Menu({name : 'Schedule', link : '#'}),
		risks = new Menu({name : 'Risks', link : '#project/risk'}),
		issues = new Menu({name : 'Issues', link : '#project/issue'});

	projectProfile.parent = setupPlan;
	schedule.parent       = execControl;
	risks.parent          = risksIssues;
	issues.parent         = risksIssues;

	var menu01 = new Menu({name : 'MSP Sync/Resource Alloc', link : '#project/sync'});
	var menu02 = new Menu({name : 'Weekly Task Direction', link : '#project/direct'});
	var menu03 = new Menu({name : 'Weekly Task Result', link : '#project/result'});
	var menu04 = new Menu({name : 'Weekly Task Approval', link : '#project/approval'});
	var menu05 = new Menu({name : 'Completion Rate Management', link : '#project/progress'});
	var menu06 = new Menu({name : 'Milestone Status', link : '#project/milestone'});

	menu01.parent = schedule;
	menu02.parent = schedule;
	menu03.parent = schedule;
	menu04.parent = schedule;
	menu05.parent = schedule;
	menu06.parent = schedule;

	root.save(function() {
		home.save();
		todo.save();
		planner.save();
		bbs.save();
		settings.save();
		project.save(function() {
			setupPlan.save(function() {
				projectProfile.save();
			});
			execControl.save(function() {
				schedule.save(function() {
					menu01.save();
					menu02.save();
					menu03.save();
					menu04.save();
					menu05.save();
					menu06.save();
				});
			});
			risksIssues.save(function() {
				risks.save();
				issues.save(callback);
			});
		});
	});




	// Type 2
	/*new Menu({name : 'Root', children: ['Home', 'ToDo', 'Planner', 'Project', 'BBS', 'Settings']}).save();
	new Menu({name : 'Home', link : '#home'}).save();
	new Menu({name : 'ToDo', link : '#todo'}).save();
	new Menu({name : 'Planner', link : '#planner'}).save();
	new Menu({name : 'Project', link : '#', children: ['Setup & Plan', 'Exceution & Control', 'Risks & Issues']}).save();
	new Menu({name : 'BBS', link : '#bbs'}).save();
	new Menu({name : 'Settings', link : '#settings'}).save();

	new Menu({name : 'Setup & Plan', link : '#', children: ['Project profile']}).save();
	new Menu({name : 'Project profile', link : '#'}).save();

	new Menu({name : 'Exceution & Control', link : '#', children: ['Schedule']}).save();
	new Menu({
		name : 'Schedule',
		link : '#',
		children: [
			'MSP Sync/Resource Alloc',
			'Weekly Task Direction',
			'Weekly Task Result',
			'Weekly Task Approval',
			'Completion Rate Management',
			'Milestone Status'
		]
	}).save();
	new Menu({name : 'MSP Sync/Resource Alloc', link : '#'}).save();
	new Menu({name : 'Weekly Task Direction', link : '#'}).save();
	new Menu({name : 'Weekly Task Result', link : '#'}).save();
	new Menu({name : 'Weekly Task Approval', link : '#'}).save();
	new Menu({name : 'Completion Rate Management', link : '#'}).save();
	new Menu({name : 'Milestone Status', link : '#'}).save();

	new Menu({name : 'Risks & Issues', link : '#', children: ['Risks', 'Issues']}).save();
	new Menu({name : 'Risks', link : '#'}).save();
	new Menu({name : 'Issues', link : '#'}).save();*/

	// Type 3
	/*new Menu({name : 'Home', link : '#home', parent: "", ancestors:[""]}).save();
	new Menu({name : 'ToDo', link : '#todo', parent: "", ancestors:[""]}).save();
	new Menu({name : 'Planner', link : '#planner', parent: "", ancestors:[""]}).save();
	new Menu({name : 'Project', link : '#', parent: "", ancestors:[""]}).save();
	new Menu({name : 'BBS', link : '#bbs', parent: "", ancestors:[""]}).save();
	new Menu({name : 'Settings', link : '#settings', parent: "", ancestors:[""]}).save();

	new Menu({name : 'Setup & Plan', link : '#', parent: "Project", ancestors:["", "Project"]}).save();
	new Menu({name : 'Project profile', link : '#', parent: "Setup & Plan", ancestors:["", "Project", "Setup & Plan"]}).save();

	new Menu({name : 'Exceution & Control', link : '#', parent: "Project", ancestors:["", "Project"]}).save();
	new Menu({name : 'Schedule', link : '#', parent: "Exceution & Control", ancestors:["", "Project", "Exceution & Control"]}).save();
	new Menu({name : 'MSP Sync/Resource Alloc', link : '#', parent: "Schedule", ancestors:["", "Project", "Exceution & Control", "Schedule"]}).save();
	new Menu({name : 'Weekly Task Direction', link : '#', parent: "Schedule", ancestors:["", "Project", "Exceution & Control", "Schedule"]}).save();
	new Menu({name : 'Weekly Task Result', link : '#', parent: "Schedule", ancestors:["", "Project", "Exceution & Control", "Schedule"]}).save();
	new Menu({name : 'Weekly Task Approval', link : '#', parent: "Schedule", ancestors:["", "Project", "Exceution & Control", "Schedule"]}).save();
	new Menu({name : 'Completion Rate Management', link : '#', parent: "Schedule", ancestors:["", "Project", "Exceution & Control", "Schedule"]}).save();
	new Menu({name : 'Milestone Status', link : '#', parent: "Schedule", ancestors:["", "Project", "Exceution & Control", "Schedule"]}).save();

	new Menu({name : 'Risks & Issues', link : '#', parent: "Project", ancestors:["", "Project"]}).save();
	new Menu({name : 'Risks', link : '#', parent: "Risks & Issues", ancestors:["", "Project", "Risks & Issues"]}).save();
	new Menu({name : 'Issues', link : '#', parent: "Risks & Issues", ancestors:["", "Project", "Risks & Issues"]}).save();*/
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
				.select('name link')
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
