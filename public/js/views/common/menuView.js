/**
 * 화면 상단에 공통으로 표시되는 메뉴 영역 View
 */
define([
    'app/views/common/baseView'
], function(BaseView){
    var MenuView = BaseView.extend({
        tmpl: 'common/menu',
        initialize: function() {
            _.bindAll(this,
                'onResettedCollection'
            );;
            BaseView.prototype.initialize.call(this);

            this.collection = new Backbone.Collection([], {
                url : '/common/menu'
            });

            this.collection.on('reset', this.onResettedCollection);

            this.collection.fetch({reset: true});
        },
        render: function() {
            BaseView.prototype.render.call(this);
            return this;
        },
        onResettedCollection: function(a, b) {
            this.render();
        },
        onClose: function() {
            this.collection.off('change');
            BaseView.prototype.onClose.call(this);
        }
    });

    return MenuView;
});