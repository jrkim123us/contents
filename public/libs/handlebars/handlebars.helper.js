var toString = Object.prototype.toString,
    functionType = '[object Function]',
    objectType = '[object Object]';

Handlebars.registerHelper('hasChild', function(context, options) {
    if(context.childs.length > 0) {
        return options.fn(this);
    }
    return options.inverse(this);
});
Handlebars.registerHelper('listToStr', function(context, options) {
	var fn = options.fn, inverse = options.inverse;
	var i = 0, ret = "", data;

	var type = toString.call(context);
	if(type === functionType) { context = context.call(this); }

	if (options.data) {
		data = Handlebars.createFrame(options.data);
	}

	if(context && typeof context === 'object') {
		if(context instanceof Array){
			for(var j = context.length; i<j; i++) {
				if (data) { data.index = i; }
					if (context.length == i + 1) {data.last = true;}
					ret = ret + fn(context[i], { data: data });
			}
		} else {
			for(var key in context) {
				if(context.hasOwnProperty(key)) {
					if(data) { data.key = key; }
					ret = ret + fn(context[key], {data: data});
					i++;
				}
			}
		}
	}

	if(i === 0){
	ret = inverse(this);
	}

	return ret;
});