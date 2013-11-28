var mongoose = require('mongoose'),
	Q = require("q"),
	async = require('async'),
	debug = require('debug')('db-org'),
	Schema = mongoose.Schema;

var schema = new Schema({
	name : {type: String, required: true},
	leader : {type: Schema.ObjectId, ref: 'User'},
	member : [{type: Schema.ObjectId, ref: 'User'}]
});
schema.set('toJSON', {
	virtuals: true
});

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
var updateOrg = function(cond, param) {
	var query = Org.update(cond, param);
	return execDeferer(query);
};
var getAllOrgs = function() {
	return execDeferer(Org.find({}));
};
var setUsers = function(orgs, users) {
	org = orgs[0];
	user = users[1];
	org.leader = user._id;
	org.member = [user._id];
	user.org = [{ _id : org._id, leader : true}];

	org = orgs[1];
	user = users[0];
	org.leader = user._id;
	org.member = [user._id];
	user.org = [{ _id : org._id, leader : true}];

	org = orgs[2];
	org.leader = user._id;
	org.member = [users[0]._id, users[2]._id, users[3]._id, users[4]._id];
	user.org = [{ _id : org._id, leader : true}];
	users[0].org.push({_id : org._id});
	users[2].org = [{_id : org._id}];
	users[3].org = [{_id : org._id}];
	users[4].org = [{_id : org._id}];
};
schema.statics.initialize = function (callback) {
	var orgs = [
		new Org({name:'사업관리'}),
		new Org({name:'분석/설계'}),
		new Org({name:'개발'})
	];
	var result = [];
	// user01.save(callback);
	function saveAll() {
		var org = orgs.shift();

		org.save(function(err, saved) {
			if(err) throw err;
			result.push(saved[0]);

			if(orgs.length > 0)
				saveAll();
			else
				callback();
		});
	}
	saveAll();
};
schema.statics.initializeUser = function (User, callback) {
	var users, orgs, user, org;
	User.getAllId()
		.then(function(docs) {
			users = docs;
			return getAllOrgs();
		})
		.then(function(orgs) {
			var deferer = Q.defer();
			setUsers(orgs, users);

			async.every(orgs.concat(users), function(doc, callback) {
				doc.save(callback);
			}, function(err, docs) {
				if(err) deferer.reject();
				else deferer.resolve();
			});

			return deferer.promise;
		})
		.fail(function(err) {
			debug('fail');
			throw(err);
		})
		.done(function(docs) {
			debug('done');
		});
};
schema.statics.getOrgs = function (callback) {
	this.find({})
		.select('-_id name member')
		.populate('member', 'name email')
		.exec(callback);
};

var Org = mongoose.model('Org', schema);
// Export the model
module.exports = Org;