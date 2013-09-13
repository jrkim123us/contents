/**
 * View Base 객체 선언
 */
define([
    'backbone'
], function(){
    var GlobalEventAggregatorView = Backbone.View.extend({
        attachEventsSplitter: /^(\S+)\s*(.*)$/,
        initialize: function() {
            Backbone.View.prototype.initialize.apply(this, arguments);

            var options = arguments[0] || this.options;

            if(options && options.vent) {
                this.vent = options.vent;
            }
            this.delegateVentEvents();
        },
        /**
         * ventEvent로 정의된 event 집합을 한번에 vent에 등록해 줌
         * @param  {[type]} evnets [description]
         * @return {[type]}        [description]
         */
        delegateVentEvents: function(events) {
            if (!(events || (events = this.ventEvents))) return;
            this.undelegateVentEvents(events);
            for (var key in events) {
                //key.match(/^(\S+)\s*(.*)$/)
                var method = events[key];
                if (!_.isFunction(method)) method = this[events[key]];
                if (!method) throw new Error('Method "' + events[key] + '" does not exist');
                var match = key.match(this.attachEventsSplitter);
                var eventName = match[1], selector = match[2];
                method = _.bind(method, this);
                this.vent.on(eventName, method);
            }

            this.trigger('onVentEventsDelegated');
        },
        /**
         * 등록된 vent event 대상들 off 처리
         * @param  {[type]} events [description]
         * @return {[type]}        [description]
         */
        undelegateVentEvents: function(events) {
            if (!(events || (events = this.ventEvents))) return;

            for (var key in events) {
                var method = events[key];
                var match = key.match(this.attachEventsSplitter);
                var eventName = match[1], selector = match[2];

                this.vent.off(eventName, method);
            }
        },
        onClose: function() {
            this.undelegateVentEvents();
        }
    });

    return GlobalEventAggregatorView;
});