var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var schema = new Schema({
	name : {
		first: {type: String},
		last: {type: String}
	},
	email : {type: String, required: true},
	passwordHash : {type: String}
});

var handleError = function(err) {
	for(var error in err.errors) {
		console.log(error.message);
	}
};
schema.statics.initialize = function (callback) {
	var user01 = new User({name : {first:'jong rok', last: 'kim'}, email: 'jrkim79@lgcns.com', passwordHash: 'a'});

	user01.save(callback);
};
// Define some "static" or "instance" methods
schema.statics.getAll = function (callback) {
	this
		.find({})
		.limit(10)
		.exec(callback);
};
schema.statics.getUserByEmail = function (email, callback) {
	this.findOne({email : email}, function(err, user) {
		if(err || !user)
			return callback(null, null);

		return callback(null, user);
	});
};
schema.statics.getUserById = function (id, callback) {
	this.findOne({_id : id}, function(err, user) {
		if(err || !user)
			return callback(null, null);

		return callback(null, user);
	});
};

schema.statics.insert = function (user) {
	var newUser = new User(user);
	newUser.save(function(err) {
		if(err)
			return handleError(err);
	});
};

var User = mongoose.model('User', schema);
// Export the model
module.exports = User;
