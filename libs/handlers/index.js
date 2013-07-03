var debug = require('debug')('handler'),
	https = require('https');

// Usually expects "db" as an injected dependency to manipulate the models
module.exports = function (db) {
	debug('setting up handlers...');

	return {
		renderLogin: function (req, res) {
			res.render('login', {title: "Log in"});
		},
		renderIndex: function (req, res) {
			// session 정보가 없는 경우 login 페이지로 이동
			res.redirect('/login');

			// res.redirect('/home');
			// res.render('index', {title: "Contens Management System"});
			// res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
		},
		renderHome: function(req, res) {
			res.render('home', {title: "CMS"});
		},
// Post
		checkLogin: function(req, res) {
			// login 정보 체크 후 home으로 
			res.redirect('/home');
		}

	};
};
