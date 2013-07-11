define(['handlebars'], function(Handlebars) {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['login/login'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"signin-masthead\">\r\n	<div class=\"container\">\r\n		<form action=\"\" class=\"form-signin\" method=\"post\">\r\n			<h2>Please sign in</h2>\r\n			<div class=\"control-group\">\r\n				<div class=\"controls\">\r\n					<input name=\"email\" type=\"text\" placeholder=\"example@lgcns.com\">\r\n				</div>\r\n			</div>\r\n			<div class=\"control-group\">\r\n				<div class=\"controls\">\r\n					<input name=\"password\" type=\"password\" placeholder=\"Password\">\r\n				</div>\r\n			</div>\r\n			<label class=\"checkbox\" for=\"remember\">\r\n				Remember me \r\n				<a href=\"session/forget_password\"> (forget password)</a>\r\n				<input id=\"remember\" type=\"checkbox\" value=\"remember-me\">\r\n			</label>\r\n			<button class=\"btn btn-large btn-primary\">Sign in</button>\r\n		</form>\r\n	</div>\r\n</div>";
  });
templates['home/home'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"myCarousel\" class=\"carousel slide\">\r\n	<div class=\"carousel-inner\">\r\n		<div class=\"item active\">\r\n			<img src=\"/img/slide-01.jpg\" alt=\"\">\r\n			<div class=\"container\">\r\n				<div class=\"carousel-caption\">\r\n					<h1>Catch phrase</h1>\r\n					<p>\r\n						ead Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.\r\n					</p>\r\n					<a href=\"#\" class=\"btn btn-large btn-primary\">Get started today</a>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>	";
  });
return templates;
});