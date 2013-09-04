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
Handlebars.registerHelper('wbsSplit', function(context, options) {
	var fn = options.fn, inverse = options.inverse;
	var inx = 0, len = 0,
		ret = "", wbs = "", separator = ".",
		data, splitedWbsArray;

	var type = toString.call(context);
	if(type === functionType) { context = context.call(this); }

	if (options.data) {
		data = Handlebars.createFrame(options.data);
	}

	if(context && typeof context === 'object' && context.wbs && typeof context.wbs === 'string') {
		splitedWbsArray = context.wbs.split(separator);
		for(len = splitedWbsArray.length; inx < len ; inx++) {
			if (data) { data.index = inx; }
			if (len === inx + 1) {data.last = true;}
			wbs += (inx === 0 ? '' : separator) + splitedWbsArray[inx];
			ret = ret + fn({
				wbs  : wbs,
				hash : context.hash
			}, { data: data });
		}
	}

	if(inx === 0){
		ret = inverse(this);
	}

	return ret;
});