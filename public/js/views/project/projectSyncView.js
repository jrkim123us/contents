define([
	'app/views/common/baseView',
	'app/collections/common/baseCollection',
	'app/models/common/baseModel',
	'app/models/project/task'
], function(BaseView, BaseCollection, BaseModel, Task){
	var ProjectSyncView = BaseView.extend({
		hash: '#project/sync',
		tmpl: 'project/projectSync',
		events : {
			// 'click button' : 'onClickedButton'
		},
		initialize: function() {
			_.bindAll(this,
                'render', 'initAfterRendering',
                'onResettedTabs', 'onResettedTasks', 'onChangedParentTask'
            );

			BaseView.prototype.initialize.call(this);

			this.initializeModel();
		},
	// Model 초기화
		initializeModel : function() {
			this.model = new BaseModel();

			this.tabs = new BaseCollection([], {
                url : '/common/tab/Project'
            });

            this.tasks = new BaseCollection([], {
				model : Task,
				url   : '/project/task/' + this.options.param,
				hash  : this.hash
            });

            this.parentTask = new BaseModel({
				hash : this.hash
            });
			this.parentTask.url = '/project/ptask/' + this.options.param;

            this.tabs.on('reset', this.onResettedTabs);
            this.tasks.on('reset', this.onResettedTasks);
            // model은 reset 이벤트가 없음
            this.parentTask.on('change', this.onChangedParentTask);

            this.fetchModel();
		},
	// Model fetch
		fetchModel : function() {
    //         this.tabs.fetch({
				// reset: true,
				// error: this.onModelFetchError
    //         });
    //         this.tasks.fetch({
				// reset: true,
				// error: this.onModelFetchError
    //         });
    //         this.parentTask.fetch({
				// error: this.onModelFetchError
    //         });
// Javascript Promise(Jquery) Pattern
			$.when(this.tabs.fetch({reset: true}), this.tasks.fetch({reset: true}), this.parentTask.fetch())
				.done(this.render)
				.fail(this.onModelFetchError);
		},
		render: function() {
			BaseView.prototype.render.call(this);

			this.initAfterRendering();

			return this;
		},
		initAfterRendering: function() {
		},
		// checkModelForRendering: function() {
		// 	if(this.hasTabs && this.hasTasks && this.hasParentTask)
		// 		this.render();
		// },
// Model Event Processing Start
		onResettedTabs: function() {
			this.hasTabs = true;
			var currentTab = this.tabs.where({link : this.hash})[0];
			currentTab.set('active', true);

			this.model.set('title', currentTab.get('name'));
			this.model.set('tabs', this.tabs.toJSON());

			// this.checkModelForRendering();
		},
		onResettedTasks: function() {
			this.hasTasks = true;
			this.model.set('tasks', this.tasks.toJSON());

			// this.checkModelForRendering();
		},
		onChangedParentTask: function() {
			this.hasParentTask = true;
			this.model.set('parentTask', this.parentTask.toJSON());

			// this.checkModelForRendering();
		},
// Model Event Processing END
// View Destroy Process
		onClose: function() {
            this.tabs.close();
            this.tasks.close();
            BaseView.prototype.onClose.call(this);
        }
	});

	return ProjectSyncView;
});