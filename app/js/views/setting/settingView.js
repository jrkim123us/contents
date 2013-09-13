define([
	'app/views/common/baseView',
	'bootstrap'
], function(BootstrapView, BaseCollection){
	var SettingView = BootstrapView.extend({
		tmpl: 'setting/setting',
		events : {
			'click button' : 'onClickedButton'
		},
		initialize: function() {
			_.bindAll(this,
                'render', 'initAfterRendering'
            );

			BootstrapView.prototype.initialize.call(this);

			this.model = new Backbone.Model();
			this.users = new Backbone.Collection([], {url : '/common/user'});
			this.users.on('reset', this.render);

			this.users.fetch({reset: true});
		},
		render: function() {
			this.model.set('users', this.users.toJSON());

			BootstrapView.prototype.render.call(this);

			this.initAfterRendering();

			return this;
		},
		initAfterRendering: function() {
		}
	});

	return SettingView;
});