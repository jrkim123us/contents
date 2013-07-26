define([
    'backbone'
], function(){
    var Task = Backbone.Model.extend({
        defaults:{
            wbs      : undefined,
            name     : undefined,
            weight   : (0.0).toFixed(1),
            plan     : (0.0).toFixed(1),
            act      : (0.0).toFixed(1),
            start    : undefined,
            end      : undefined,
            worker   : undefined,
            approver : undefined
        },
        set: function(attrs, options) {
            attrs.weight = parseFloat(attrs.weight).toFixed(1);
            attrs.plan   = parseFloat(attrs.plan).toFixed(1);
            attrs.act    = parseFloat(attrs.act).toFixed(1);

            Backbone.Model.prototype.set.apply(this, arguments);
        }
    });

    return Task;
});