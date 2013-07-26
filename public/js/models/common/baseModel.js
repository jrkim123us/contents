define([
	'backbone'
], function(){
	var BaseModel = Backbone.Model.extend({
		initialize: function() {
			Backbone.Model.prototype.initialize.call(this);
		},
		close: function() {
            this.off();
            if(this.onClose) {
                this.onClose();
            }
        }
	});

	return BaseModel;
});