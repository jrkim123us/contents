define([
	'app/views/common/baseView',
	'bootstrap'
], function(BaseView){
	var ProjectSyncView = BaseView.extend({
		tmpl: 'project/projectSync',
		events : {
			// 'click button' : 'onClickedButton'
		},
		initialize: function() {
			_.bindAll(this,
                'render', 'initAfterRendering'
            );

			BaseView.prototype.initialize.call(this);

			this.tabs = new Backbone.Collection([], {
                url : '/common/tab/Project'
            });

            this.tasks = new Backbone.Collection([], {
                url : '/project/task/1.4.1'
            });

            this.tabs.on('reset', this.onResettedTabs);
            this.tasks.on('reset', this.onResettedTasks);

            this.tabs.fetch({reset: true});
            this.tasks.fetch({reset: true});
		},
		render: function() {
			BaseView.prototype.render.call(this);

			this.initAfterRendering();

			return this;
		},
		initAfterRendering: function() {
		},
		onResettedTabs: function() {
			console.log('onResettedTabs');
		},
		onResettedTasks: function() {
			console.log('onResettedTasks');
		},
		onClose: function() {
            this.tabs.off('reset');
            this.tasks.off('reset');
            BaseView.prototype.onClose.call(this);
        }
	});

	return ProjectSyncView;
});