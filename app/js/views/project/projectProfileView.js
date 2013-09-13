define([
	'app/views/common/baseView',
	'bootstrap'
], function(BaseView){
	var ProjectProfileView = BaseView.extend({
		tmpl: 'project/projectProfile',
		events : {
			// 'click button' : 'onClickedButton'
		},
		initialize: function() {
			_.bindAll(this,
                'render', 'initAfterRendering',
                'onResettedTabs'
            );

			BaseView.prototype.initialize.call(this);

			this.initializeModel();

		},
		initializeModel : function() {
			this.model = new Backbone.Model();

			this.tabs = new Backbone.Collection([], {
                url : '/common/tab/Project'
            });

            this.tabs.on('reset', this.onResettedTabs);

            this.tabs.fetch({reset: true});

		},
		render: function() {
			BaseView.prototype.render.call(this);

			this.initAfterRendering();

			return this;
		},
		initAfterRendering: function() {
		},
		onResettedTabs: function() {
			this.hasTabs = true;
			var currentTab = this.tabs.where({link : window.location.hash})[0];
			currentTab.set('active', true);

			this.model.set('title', currentTab.get('name'));
			this.model.set('tabs', this.tabs.toJSON());

			this.render();
		},
		onClose: function() {
            this.tabs.off('reset');
            BaseView.prototype.onClose.call(this);
        }
	});

	return ProjectProfileView;
});