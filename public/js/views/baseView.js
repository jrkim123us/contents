/**
 * View Base 객체 선언
 */
define([
    'app/views/globalEventAggregatorView',
    'handlebars.tmpl',
    'jquery.validate'
], function(GlobalEventAggregatorView){
    var BaseView = GlobalEventAggregatorView.extend({
        initialize: function() {
            GlobalEventAggregatorView.prototype.initialize.call(this);
        },
        render: function() {
            if(this.tmpl) {
                var data = this.model ? this.model.toJSON() : {};
                var html = Handlebars.templates[this.tmpl] ? Handlebars.templates[this.tmpl](data) : '';

                this.$el.html(html);
            }

            // if($targetEl.i18n)
            //     $targetEl.i18n();

            return this;
        },
        close: function() {
            this.remove();
            this.unbind();
            if(this.onClose) {
                this.onClose();
            }
        }
    });

    return BaseView;
});