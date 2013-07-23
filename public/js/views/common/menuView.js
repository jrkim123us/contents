/**
 * 화면 상단에 공통으로 표시되는 메뉴 영역 View
 */
define([
    'app/views/common/baseView'
], function(BaseView){
    var MenuView = BaseView.extend({
        tmpl: 'common/menu',
        menuActiveClass : 'active',
        events : {
            'click a' : 'onClickedMenu'
        },
        initialize: function() {
            _.bindAll(this,
                'onResettedCollection',
                'isSubMenuByHash'
            );
            BaseView.prototype.initialize.call(this);

            this.collection = new Backbone.Collection([], {
                url : '/common/menu'
            });

            this.collection.on('reset', this.onResettedCollection);

            this.collection.fetch({reset: true});
        },
        render: function() {
            BaseView.prototype.render.call(this);

            this.initAfterRendering();
            return this;
        },
        initAfterRendering: function() {
            // 최초 로딩 시
            // hash 기준으로 메뉴를 활성화 한다.
            this.setMenuActive(window.location.hash);
        },
// 메뉴 active는 최상단만 제공
// 따라서 '/'기준으로 최상단만 표시함
// 최상위 메뉴가 아닌 하위 메뉴를 클릭한 경우
// 최상위 메뉴를 active 시킨다.
        setMenuActive: function(target) {
            var $target;
            $('li.active').removeClass(this.menuActiveClass);

            if(typeof(target) === 'string') {
                var hash = target;
                if(this.isSubMenuByHash(hash))
                    $target = $('a[href="' + hash + '"]').parents('li.dropdown');
                else
                    $target = $('a[href="' + hash + '"]').parent();
            }
            else
                if(this.isSubMenuByHash(target.hash))
                    $target = $(target).parents('li.dropdown');
                else
                    $target = $(target).parent();

            $target.addClass(this.menuActiveClass);

        },
// 최상위 메뉴인지 hash 정보를 기준으로 체크함
        isSubMenuByHash: function(hash) {
            return hash.split('/').length > 1 ? true : false;
        },
        onResettedCollection: function() {
            this.render();
        },
// DOM EVENTS START
        onClickedMenu: function(event) {
            this.setMenuActive(event.target);
        },
// DOM EVENTS END
        onClose: function() {
            this.collection.off('reset');
            BaseView.prototype.onClose.call(this);
        }
    });

    return MenuView;
});