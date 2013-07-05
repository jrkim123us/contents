define([
	'app/views/baseView'
], function(BaseView){
	var LoginView = BaseView.extend({
		el: 'body',
		tmpl: 'login/login',
		initialize: function() {
			BaseView.prototype.initialize.call(this);

			this.render();
		},
		render: function() {
			BaseView.prototype.render.call(this);

			return this;
		}
	});

	return LoginView;
});