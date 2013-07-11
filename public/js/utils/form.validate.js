define([
	'backbone'
], function(){
	var FormValidate = Backbone.Model.extend({
		defaults : {
			errorClass : 'error',
			validClass : 'success',
			messages : {
				required : '필수입력 항목입니다.',
				email    : '이메일 형식이 아닙니다.'
			}
		},
		initialize: function() {
			_.bindAll(this,
                'errorPlacement',
                'highlight', 'unhighlight'
            );

			Backbone.Model.prototype.initialize.call(this);
		},
		errorPlacement: function(error, element) {
			console.log('errorPlacement');
			var type = element.attr("type");
			if(type === 'text' || type === 'password') {
				// element.parent().parent().addClass(this.errorClassName);
				error.addClass('help-block');
				element.after(error);
			}
        },
        highlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName(element.name).addClass(errorClass).removeClass(validClass);
			} else {
				$(element).parent().parent().addClass(errorClass).removeClass(validClass);
			}
		},
		unhighlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName(element.name).removeClass(errorClass).addClass(validClass);
			} else {
				$(element).parent().parent().removeClass(errorClass).addClass(validClass);
			}
		}
	});

	return FormValidate;
});