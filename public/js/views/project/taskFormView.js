define([
	'app/views/common/bootstrapView',
	'jquery.chosen'
], function(BootstrapView){
	var TaskFormView = BootstrapView.extend({
		tmpl: 'project/taskForm',
		events : {
			'change'       : 'onChangedForm',
			'click button.btn' : 'onClickedSaveButton'
		},
		initialize: function() {
			BootstrapView.prototype.initialize.apply(this, arguments);

			this.render();
			// backbone view에서 jquery selector를 사용하면
			// this.$el.find()로 동작해야 하나 적용 안됨
			// bootstrap.js 에서 overwrite 하지 않나 추측..
			this.$el.find('.chosen-select').chosen({width: "100%"});
		},
		alertHasNotChanged: function() {
            this.bsAlertDismissable(this.$el.find('.taskForm-alert'), {
				alertType : 'alert-info',
				strong : 'Note!',
				message : '변경된 데이터가 존재하지 않습니다.'
            });
		},
		hideCollapse: function() {
			this.$el.parent().collapse('hide');
		},
		onClickedSaveButton: function(event) {
			// event.preventDefault();
			if($(event.target).hasClass('btn-save')) {
				var formSet = {};
				_.each(this.$el.find('.form-control'), function( obj, inx, list) {
					var $obj = $(obj);
					formSet[$obj.attr('name')] = $obj.val();
				});

				this.model.set(formSet);

				if(this.model.hasChanged())
					this.model.save();
				else
					this.alertHasNotChanged();
			} else {
				this.hideCollapse();
			}
			return false;
		},
		onClose: function() {
            this.$el.find('.chosen-select').chosen('destroy');

            BootstrapView.prototype.onClose.call(this);
        }
	});
	return TaskFormView;
});