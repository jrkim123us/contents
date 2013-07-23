define([
	'app/views/common/baseView',
	'bootstrap'
], function(BaseView){
	var ProjectDirectView = BaseView.extend({
		tmpl: 'project/projectDirect',
		events : {
			// 'click button' : 'onClickedButton'
		},
		initialize: function() {
			_.bindAll(this,
                'render', 'initAfterRendering'
            );

			BaseView.prototype.initialize.call(this);
		},
		render: function() {
			BaseView.prototype.render.call(this);

			this.initAfterRendering();

			return this;
		},
		initAfterRendering: function() {
			this.$el.find('li[data-toggle="tooltip"]').tooltip();
		}
	});

	return ProjectDirectView;
});