define([
	'app/views/common/bootstrapView',
	'jquery.chosen'
], function(BootstrapView){
	var TaskFormView = BootstrapView.extend({
		tmpl: 'project/taskForm',
		events : {
			'change'                  : 'onChangedForm',
			'click button.btn-save'   : 'onClickedSaveButton',
			'click button.btn-cancel' : 'onClickedCancelButton'
		},
		initialize: function(options) {
			_.bindAll(this,
                'render',
                'onChangedTaskName',
                'syncDoneHandler', 'syncFailHandler'
            );
			BootstrapView.prototype.initialize.apply(this, arguments);

			this.selectOptions = options.params;

			this.model.on('change:name', this.onChangedTaskName);

			this.render();
		},
		render: function() {
			BootstrapView.prototype.render.apply(this, arguments);

			this.renderSelectOptions();

			this.renderButtons();

			return this;
		},
		renderSelectOptions: function() {
			// backbone view에서 jquery selector를 사용하면
			// this.$el.find()로 동작해야 하나 적용 안됨
			// bootstrap.js 에서 overwrite 하지 않나 추측..
			var chosenSelectNames = ['approver', 'worker'];
			_.each(chosenSelectNames, _.bind(function(name) {
				var $target = this.$el.find('select[name*="' + name + '"]');
				this.checkOptionSelected(name);
				this.renderTarget('common/select-optgroup', $target, this.selectOptions.toJSON());
				$target.chosen({width: "100%"});
			}, this));
		},
		renderButtons: function() {
			this.$el.find('button').button({
				loadingText: 'saving...'
			});
		},
		renderHasChanged: function(hasChanged) {
			var $target = this.$el.find('.taskForm-alert');
			if(hasChanged)
				$target.html('');
			else
				this.bsAlertDismissable($target, {
					alertType : 'alert-warning',
					strong : 'Note!',
					message : '변경된 데이터가 존재하지 않습니다.'
				});
		},
		syncDoneHandler: function(data, textStatus, jqXHR) {
			var $target = this.$el.find('.taskForm-alert');
			this.bsAlertDismissable($target, {
				alertType : 'alert-success',
				strong : '',
				message : '저장되었습니다.'
			});
		},
		syncFailHandler: function(jqXHR, textStatus, errorThrown) {
			var $target = this.$el.find('.taskForm-alert');
			this.bsAlertDismissable($target, {
				alertType : 'alert-danger',
				strong : 'Note!',
				message : '알수 없는 장애가 발생하였습니다.'
			});
		},
		checkOptionSelected: function(attrName) {
			var attr = this.model.get(attrName);
			this.selectOptions.forEach(function(selectOption,jnx,jlist) {
				_.each(selectOption.get('member'), function(member, knx, klist){
					delete member.selected;
					_.each(attr, function(user, inx, ilist) {
						if(user._id === member._id) {
							member.selected = true;
						}
					});
				});
			});
		},
		hideCollapse: function() {
			this.$el.parent().collapse('hide');
		},
		extractFormToModel: function() {
			var formSet = {};
			_.each(this.$el.find('.form-control'), _.bind(function( obj, inx, list) {
				var $obj = $(obj), attrName = $obj.attr('name');
				// if(attrName === '')
				formSet[$obj.attr('name')] = $obj.val();
			},this));

			this.model.set(formSet);
		},
		onChangedTaskName: function(model, changedName, options) {
			$('legend').text(changedName);
		},
		onClickedSaveButton: function(event) {
			var hasChanged = false;
			var $target = $(event.target);
			// event.preventDefault();

			this.extractFormToModel();

			hasChanged = this.model.hasChanged();
			this.renderHasChanged(hasChanged);

			if(hasChanged) {
				$target.button('loading');

				this.model.save()
					.done(this.syncDoneHandler)
					.fail(this.syncFailHandler)
					.always(function(obj) {
						$target.button('reset');
					});
			}
			return false;
		},
		onClickedCancelButton: function(event) {
			this.hideCollapse();
			return false;
		},
		onClose: function() {
            this.$el.find('.chosen-select').chosen('destroy');

            BootstrapView.prototype.onClose.call(this);
        }
	});
	return TaskFormView;
});