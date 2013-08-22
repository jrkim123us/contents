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
            if(attrs.weight && !isNaN(attrs.weight))
                attrs.weight = parseFloat(attrs.weight).toFixed(1);
            if(attrs.plan && !isNaN(attrs.plan))
                attrs.plan   = parseFloat(attrs.plan).toFixed(1);
            if(attrs.act && !isNaN(attrs.act))
                attrs.act    = parseFloat(attrs.act).toFixed(1);
            if(attrs.wbs)
                this.url = '/project/task/' + attrs.wbs;

            Backbone.Model.prototype.set.apply(this, arguments);
        },
        // validate 기능은 jquery.validate가 더 좋을 듯 함.
        // validate: function(attrs, options) {
        //     if(isNaN(attrs.weight))
        //         return 'Weight should be number.';
        //     if(isNaN(attrs.plan))
        //         return 'Weight should be number.';
        //     if(isNaN(attrs.act))
        //         return 'Weight should be number.';
        // }
    });

    return Task;
});