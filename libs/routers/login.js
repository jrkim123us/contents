
/*
 * GET users listing.
 */

exports.index = function(req, res){
	// res.send("respond with a resource");
	res.render('login', { title: 'Express' });
};

exports.post = function(req, res){
	// res.send("respond with a resource");
	// res.render('index', { title: 'Express' });
	res.redirect('/home');
};