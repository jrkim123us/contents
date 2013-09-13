define([
	'app/views/common/bootstrapView',
	'app/utils/form.validate'
], function(BootstrapView, FormValidate){
	var LoginView = BootstrapView.extend({
		el: 'body',
		tmpl: 'login/login',
		events : {
			'click button' : 'onClickedButton'
		},
		initialize: function() {
			_.bindAll(this,
                'render', 'initAfterRendering',
                'submitHandler'
            );

			BootstrapView.prototype.initialize.call(this);

			this.render();

			this.initAfterRendering();

		},
		render: function() {
			BootstrapView.prototype.render.call(this);

			return this;
		},
		initAfterRendering: function() {
			var validator = new FormValidate();
			var messages = validator.get('messages');

			$('.form-signin').validate({
				// jquery.validate의 rule은 해당 태그에 name을 기준으로 찾는다.
				// id 값이 아님
				errorClass : validator.get('errorClass'),
				validClass : validator.get('validClass'),
				rules : {
					email : {
						required : true,
						email: true
					},
					password : {
						required: true
					}
				},
				messages : {
					email : {
						required : messages.required,
						email    : messages.email
					},
					password : {
						required : messages.required
					}
				},
				errorElement   : 'span',
				errorPlacement : validator.errorPlacement,
				highlight      : validator.highlight,
				unhighlight    : validator.unhighlight,
				submitHandler  : this.submitHandler
			});
		},
		onClickedButton: function(event) {
			// event.bubbles = false;
			return $('.form-signin').valid();
		},
		submitHandler: function(form) {
			$(form).ajaxSubmit();
		}
	});

	return LoginView;
});