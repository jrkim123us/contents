define([
	'app/views/common/baseView',
	'bootstrap'
], function(BaseView){
	var HomeView = BaseView.extend({
		tmpl: 'home/home',
		events : {
			'click button' : 'onClickedButton'
		},
		initialize: function() {
			_.bindAll(this,
                'render', 'initAfterRendering'
            );

			BaseView.prototype.initialize.call(this);

			this.model = new Backbone.Model({
				slideImages : [
					{img: 'slide-01.jpg', active: true},
					{img: 'slide-02.jpg'},
					{img: 'slide-03.jpg'}
				]
			});
		},
		render: function() {
			BaseView.prototype.render.call(this);

			this.initAfterRendering();

			return this;
		},
		initAfterRendering: function() {
			$('#myCarousel').carousel();
		}
	});

	return HomeView;
});