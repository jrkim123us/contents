var mongoose = require('mongoose'),
	Q = require("q"),
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

schema.virtual('name.full').get(function () {
	return [this.name.first, this.name.last].join(' ');
});
schema.set('toJSON', {
	virtuals: true
});

var handleError = function(err) {
	for(var error in err.errors) {
		console.log(error.message);
	}
};

var execDeferer = function(queryFn) {
	var deferred = Q.defer();
	queryFn.exec(function(err, result) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
};
schema.statics.initialize = function (callback) {
	var users = [
		new User({name : {first:'종록', last: '김'}, email: 'jrkim79@lgcns.com', passwordHash: 'a'}),
		new User({name : {first:'후정', last: '김'}, email: 'hoojungkim@lgcns.com', passwordHash: 'a'}),
		new User({name : {first:'태호', last: '조'}, email: 'taiho@cnspartner.com', passwordHash: 'a'}),
		new User({name : {first:'철수', last: '박'}, email: 'chulsu@lgcns.com', passwordHash: 'a'}),
		new User({name : {first:'Mike', last: 'Lee'}, email: 'mike@test.com', passwordHash: 'a'})
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
		.select('_id name email')
		.exec(callback);
};
schema.statics.getAllId = function() {
	var query = this.find({})
					.select('_id');

	return execDeferer(query);
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