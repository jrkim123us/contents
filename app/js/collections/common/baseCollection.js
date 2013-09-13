define([
	'backbone'
], function(){
	var BaseCollection = Backbone.Collection.extend({
		initialize: function() {
			Backbone.Collection.prototype.initialize.call(this);
		},
		close: function() {
            this.off();
            if(this.onClose) {
                this.onClose();
            }
        }
	});

	return BaseCollection;
});