var mongoose = require('mongoose'),
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

var handleError = function(err) {
	// for(var error in err.errors) {
	// 	console.log(error.message);
	// }
	if(err) throw err;
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
	User.getAllId(function(err, userDoc){
		Org.update({name : '사업관리'}, {
			leader: userDoc[1]._id,
			member: [userDoc[1]._id]
		}, handleError);

		Org.update({name : '분석/설계'}, {
			leader: userDoc[0]._id,
			member: [userDoc[0]._id]
		}, handleError);

		Org.update({name : '개발'}, {
			leader: userDoc[0]._id,
			member: [userDoc[0]._id, userDoc[2]._id, userDoc[3]._id]
		}, handleError);

		Org.findOne({name : '사업관리'}, function(err, doc) {
			if(err) throw err;
			userDoc[1].org = [{_id : doc._id, leader : true}];
			userDoc[1].save(handleError);
		});

		Org.findOne({name : '분석/설계'}, function(err, doc) {
			if(err) throw err;

			userDoc[0].org = [{_id : doc._id, leader: true}];
			userDoc[0].save(handleError);
		});

		Org.findOne({name : '개발'}, function(err, doc) {
			if(err) throw err;
			userDoc[0].org.push({_id : doc._id, leader: true});
			userDoc[0].save(handleError);

			userDoc[2].org = [{_id : doc._id}];
			userDoc[2].save(handleError);

			userDoc[3].org = [{_id : doc._id}];
			userDoc[3].save(handleError);
		});
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