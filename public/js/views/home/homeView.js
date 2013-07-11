define([
	'app/views/baseView',
	'bootstrap'
], function(BaseView){
	var HomeView = BaseView.extend({
		el: 'body',
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

			this.render();

			this.initAfterRendering();
		},
		render: function() {
			BaseView.prototype.render.call(this);

			return this;
		},
		initAfterRendering: function() {
			$('#myCarousel').carousel();
		}
	});

	return HomeView;
});