/**
 * View Base 객체 선언
 */
define([
    'app/views/common/globalEventAggregatorView',
    'handlebars.tmpl',
    'jquery.validate',
    'bootstrap'
], function(GlobalEventAggregatorView){
    var BaseView = GlobalEventAggregatorView.extend({
        initialize: function() {
            _.bindAll(this,
                'onModelFetchError'
            );

            GlobalEventAggregatorView.prototype.initialize.call(this);
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
            if(this.subviews) {
                _.each(this.subviews, function(subview, subviewName, list) {
                    subview.close();
                });
            }
        }
    });

    return BaseView;
});