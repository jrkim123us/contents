define([
	'app/views/common/bootstrapView',
	'app/views/project/taskFormView',
	'app/collections/common/baseCollection',
	'app/models/common/baseModel',
	'app/models/project/task'

], function(BootstrapView, TaskFormView, BaseCollection, BaseModel, Task){
	var ProjectSyncView = BootstrapView.extend({
		hash: '#project/sync',
		tmpl: 'project/projectSync',
		formTmpl: 'project/taskForm',
		events : {
			'click #wbs'   : 'onClickedWbs',
			'hover .hover' : 'onHoveredItem'
		},
		bsEvents : {
			'show.bs.collapse div.collapse' : 'onShowCollapse',
			'hidden.bs.collapse div.collapse' : 'onHiddenCollapse'
		},
		initialize: function() {
			_.bindAll(this,
				'delegateEvents',
                'render', 'initAfterRendering',
                'onResettedTabs',
                'onResettedTasks', 'onChangedTasks',
                'onChangedParentTask'
            );

			BootstrapView.prototype.initialize.call(this);

			this.initializeModel();
		},
		render: function() {
			BootstrapView.prototype.render.call(this);

			this.initAfterRendering();

			return this;
		},
		initAfterRendering: function() {
		},
// Model 초기화
		initializeModel : function() {
			this.model = new BaseModel();

			this.tabs = new BaseCollection([], {url : '/common/tab/Project'});
            this.users = new BaseCollection([], {url : '/common/org'});
            this.parentTask = new BaseModel({hash : this.hash});
			this.parentTask.url = '/project/ptask/' + this.options.param;

            this.tasks = new BaseCollection([], {
				model : Task,
				url   : '/project/task/' + this.options.param
            });
			this.tasks.users = this.users;

			this.attachEventsToModels();
            this.fetchModel();
		},
		attachEventsToModels: function() {
            this.tabs.on('reset', this.onResettedTabs);
            this.tasks.on('reset', this.onResettedTasks);
            this.tasks.on('change', this.onChangedTasks);
            // model은 reset 이벤트가 없음
            this.parentTask.on('change', this.onChangedParentTask);
		},
// Model fetch
		fetchModel : function() {
// Javascript Promise(Jquery) Pattern
			$.when(this.tabs.fetch({reset: true}), this.tasks.fetch({reset: true}), this.users.fetch({reset: true}), this.parentTask.fetch())
				.then(this.render)
				.fail(this.onModelFetchError);
		},
// Model Event Processing Start
		onResettedTabs: function() {
			var currentTab = this.tabs.where({link : this.hash})[0];
			currentTab.set('active', true);

			this.model.set('title', currentTab.get('name'));
			this.model.set('tabs', this.tabs.toJSON());
		},
		onResettedTasks: function() {
			this.model.set('tasks', this.tasks.toJSON());
		},
		onChangedTasks: function(model, options) {
			// console.log(model.changed);
			var $target = $('#' + model.get('_id'));

			_.each(model.changed, function(val, key, obj) {
				console.log(key + ' : ' + val);
				$target.find('[name*="' + key + '"]').text(val);
			});
		},
		onChangedParentTask: function() {
			this.model.set('parentTask', this.parentTask.toJSON());
		},
		onShowCollapse: function(event) {
			var $target = $(event.target);
			var wbs = $target.attr('wbs');
			var viewId = 'wbs_' + wbs;
			var task = this.tasks.where({wbs : wbs})[0];
			// baseView 에 정의되어 있는 setSubView 사용
			this.setSubView($target, viewId, TaskFormView, task, this.users);

			$target.parent().removeClass('collapse');
		},
		onHiddenCollapse: function(event) {
			$(event.target).parent().addClass('collapse');
		},
		onHoveredItem: function(event) {
			console.log('onHoveredItem');
		},
// Model Event Processing END
// View Destroy Process
		onClose: function() {
            this.tabs.close();
            this.tasks.close();
            this.parentTask.close();

            BootstrapView.prototype.onClose.call(this);
        }
	});

	return ProjectSyncView;
});