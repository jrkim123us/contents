var debug = require('debug')('handler'),
	https = require('https');

// Usually expects "db" as an injected dependency to manipulate the models
module.exports = function (db) {
	debug('setting up handlers...');

	return {
		renderIndex: function (req, res) {
			res.render('index', {title: 'CMS'});
		},
		renderLogin: function(req, res) {
			res.render('login', {title: 'CMS Sign in'});
		},
		postLogin : function(req, res) {
			req.session.userId = '73007';

			res.redirect('/');
			// db.User.insert({name : {first : 'kim', last: 'jong'}, email: 'jrkim79@lgcns.com'});

			// db.User.getAll(function(err, user) {
			// 	if (err) return handleError(err);
			// 	debug('test %s', user);
			// });
		},
		checkAuthentication: function(req, res, next) {
			if(!req.session.userId) {
				res.redirect('/login');
			} else {
				next();
			}
		}
	};
};
