var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var schema = new Schema({
	name : {
		first: {type: String},
		last: {type: String}
	},
	email : {type: String, required: true},
	org : [{
		_id : {type: Schema.ObjectId, ref: 'Org'},
		leader : {type: Boolean, default: false}
	}],
	passwordHash : {type: String}
});

var handleError = function(err) {
	for(var error in err.errors) {
		console.log(error.message);
	}
};
schema.statics.initialize = function (callback) {
	var users = [
		new User({name : {first:'종록', last: '김'}, email: 'jrkim79@lgcns.com', passwordHash: 'a'}),
		new User({name : {first:'후정', last: '김'}, email: 'hoojungkim@lgcns.com', passwordHash: 'a'}),
		new User({name : {first:'태호', last: '조'}, email: 'taiho@cnspartner.com', passwordHash: 'a'}),
		new User({name : {first:'철수', last: '박'}, email: 'chulsu@lgcns.com', passwordHash: 'a'})
	];
	var result = [];
	// user01.save(callback);
	function saveAll() {
		var user= users.shift();

		user.save(function(err, saved) {
			if(err) throw err;
			result.push(saved[0]);

			if(users.length > 0)
				saveAll();
			else
				callback();
		});
	}
	saveAll();
};
// Define some "static" or "instance" methods
schema.statics.getAll = function (callback) {
	this
		.find({})
		.limit(100)
		.select('-_id name email')
		.exec(callback);
};
schema.statics.getAllId = function(callback) {
	this
		.find({})
		.select('_id')
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