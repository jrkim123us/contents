define([
	'app/views/common/baseView',
	'bootstrap'
], function(BaseView){
	var TodoView = BaseView.extend({
		tmpl: 'todo/todo',
		events : {
			'click button' : 'onClickedButton'
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
		}
	});

	return TodoView;
});