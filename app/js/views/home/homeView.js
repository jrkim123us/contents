define([
	'app/views/common/bootstrapView'
], function(BootstrapView){
	var HomeView = BootstrapView.extend({
		tmpl: 'home/home',
		events : {
			'click button' : 'onClickedButton'
		},
		initialize: function() {
			_.bindAll(this,
                'render', 'initAfterRendering'
            );

			BootstrapView.prototype.initialize.call(this);

			this.model = new Backbone.Model({
				slideImages : [
					{img: 'slide-01.jpg', active: true},
					{img: 'slide-02.jpg'},
					{img: 'slide-03.jpg'}
				]
			});
			// 임시로 등록
			// 실 데이터가 bind 되면 데이터 로딩 후 render 하도록 수정
			this.render();
		},
		render: function() {
			BootstrapView.prototype.render.call(this);

			this.initAfterRendering();

			return this;
		},
		initAfterRendering: function() {
			$('#homeCarousel').carousel();
		}
	});

	return HomeView;
});