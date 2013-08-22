/**
 * View Base 객체 선언
 */
define([
    'app/views/common/globalEventAggregatorView',
    'handlebars.tmpl',
    'jquery.validate'
], function(GlobalEventAggregatorView){
    var BaseView = GlobalEventAggregatorView.extend({
        initialize: function() {
            _.bindAll(this,
                'onModelFetchError'
            );

            GlobalEventAggregatorView.prototype.initialize.apply(this, arguments);
        },
        render: function() {
            if(this.tmpl) {
                var data = this.collection ? {row : this.collection.toJSON()} : this.model ? this.model.toJSON() : {};
                var html = Handlebars.templates[this.tmpl] ? Handlebars.templates[this.tmpl](data) : '';

                this.$el.html(html);
            }

            // if($targetEl.i18n)
            //     $targetEl.i18n();

            return this;
        },
        setSubView: function($target, viewId, SubViewClass, model) {
            if(!this.subViews) this.subViews = {};
            if(this.subViews[viewId]) {
                this.subViews[viewId].close();
            }
            this.subViews[viewId] = new SubViewClass({
                model : model,
                vent  : this.vent
            });

            $target.html(this.subViews[viewId].el);

        },
// TODO: 추후 상세 구현
        onModelFetchError: function(model, error) {
            console.log('onModelFetchError occur!!!');
        },
        close: function() {
            this.remove();
            this.off();
            if(this.onClose) {
                this.onClose();
            }
        },
// subview 가 정의 되어 있으나, 종료 시까지 해제가 되어 있지 않는 경우
// 한꺼번에 해지해 준다.
        onClose: function() {
            if(this.subViews) {
                _.each(this.subViews, function(subView, subViewName, list) {
                    subView.close();
                });
            }
        }
    });

    return BaseView;
});