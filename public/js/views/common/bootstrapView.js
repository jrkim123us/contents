/**
 * View Base 객체 선언
 */
define([
    'app/views/common/baseView',
    'bootstrap'
], function(BaseView){
    var BootstrapView = BaseView.extend({
        initialize: function() {
            BaseView.prototype.initialize.apply(this, arguments);
            if(this.options.bsEvents)
                this.bsEvents = this.options.bsEvents;

        },
        render: function() {
            BaseView.prototype.render.call(this);

            this.delegateBsEvents();
            return this;
        },
        remove: function() {
            if(this.bsEvents) {
                this.undelegateBsEvents();
            }
            BaseView.prototype.remove.call(this);
        },
        bsAlertDismissable: function($target, params) {
            $target.html(Handlebars.templates['common/alert-dismissable'](params));
        },
        /**
         * bsEvent로 정의된 event 집합을 한번에 bootstrap event에 등록해 줌
         * @param  {[type]} evnets [description]
         * @return {[type]}        [description]
         */
        delegateBsEvents: function(events) {
            if (!(events || (events = this.bsEvents))) return;
            this.undelegateBsEvents(events);
            for (var key in events) {
                //key.match(/^(\S+)\s*(.*)$/)
                var method = events[key];
                if (!_.isFunction(method)) method = this[events[key]];
                if (!method) throw new Error('Method "' + events[key] + '" does not exist');
                var match = key.match(this.attachEventsSplitter);
                var eventName = match[1], selector = match[2];
                method = _.bind(method, this);

                if (selector === '') {
                    this.$el.on(eventName, method);
                } else {
                    // this.$el.on(eventName, selector, method);
                    // backbone의 delegate 방식이 처리 안됨.
                    this.$el.find(selector).on(eventName, method);
                }
            }

            this.trigger('onBsEventsDelegated');
            return this;
        },
        /**
         * 등록된 bootstrap event 대상들 off 처리
         * @param  {[type]} events [description]
         * @return {[type]}        [description]
         */
        undelegateBsEvents: function(events) {
            if (!(events || (events = this.bsEvents))) return;

            for (var key in events) {
                var method = events[key];
                var match = key.match(this.attachEventsSplitter);
                var eventName = match[1], selector = match[2];

                if (selector === '') {
                    this.$el.off(eventName, method);
                } else {
                    this.$el.find(selector).off(eventName, method);
                }
            }

            return this;
        },
        onClose: function() {
            this.undelegateBsEvents();

            BaseView.prototype.onClose.call(this);
        }
    });

    return BootstrapView;
});