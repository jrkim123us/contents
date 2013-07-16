Handlebars.registerHelper('hasChild', function(context, options) {
    if(context.childs.length > 0) {
        return options.fn(this);
    }
    return options.inverse(this);
});