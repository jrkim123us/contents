var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = new Schema({
	userId: {type: Schema.Types.ObjectId, index: true},
	name : {
		first: {type: String},
		last: {type: String}
	},
	email : {type: String, required: true},
	passwordHash : {type: String}
});

var handleError = function(err) {
	for(error in err.errors) {
		console.log(error.message);
	}
}
// Define some "static" or "instance" methods
userSchema.statics.getAll = function (callback) {
	this
		.find({})
		.limit(10)
		.exec(callback);
};

userSchema.statics.insert = function (user) {
	var newUser = new User(user);
	newUser.save(function(err) {
		if(err)
			return handleError(err);
	});
};

var User = mongoose.model('User', userSchema);
// Export the model
module.exports = User;
