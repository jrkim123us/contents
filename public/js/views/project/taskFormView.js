define([
	'app/views/common/bootstrapView',
	'jquery.chosen'
], function(BootstrapView){
	var TaskFormView = BootstrapView.extend({
		tmpl: 'project/taskForm',
		events : {
			'change'           : 'onChangedForm',
			'click button' : 'onClickedSaveButton'
		},
		initialize: function() {
			BootstrapView.prototype.initialize.apply(this, arguments);

			this.render();
			// backbone view에서 jquery selector를 사용하면
			// this.$el.find()로 동작해야 하나 적용 안됨
			// bootstrap.js 에서 overwrite 하지 않나 추측..
			this.$el.find('.chosen-select').chosen({width: "100%"})
				// .change(console.log('changed'));
				.change(function() {
					console.log('changed');
				});
		},
		onChangedForm: function(event) {
			var $target = $(event.target);
			// console.log($(event.target).val());
			// this.model.set($target.attr('name'), $target.val());
		},
		onClickedSaveButton: function(event) {
			// event.preventDefault();
			var formSet = {};
			_.each(this.$el.find('input.form-control, textarea.form-control, select.form-control'), function( obj, inx, list) {
				var $obj = $(obj);
				formSet[$obj.attr('name')] = $obj.val();
			});

			this.model.set(formSet);
			return false;
		},
		onClose: function() {
            this.$el.find('.chosen-select').chosen('destroy');

            BootstrapView.prototype.onClose.call(this);
        }
	});
	return TaskFormView;
});