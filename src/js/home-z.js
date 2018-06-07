require(['jquery', 'checkLogin', 'tools', 'homeToll', 'imgScroll'], function ($, checkLogin) {
    var homeMain = {
        init: function () {
            var _this = this;
            $.navTab({ type: 'mouseenter' });
            $('.f-img').scrollImg();
            $('.text-y-scroll').Scroll({ speed: 500, timer: 1500 });
            _this.setLogin();
            $('.f-nav .game-list,.h-game .area-list').each(function(){
                if ($.trim($(this).html())==''){
                    if (!$(this).hasClass('area-list')){
                        $(this).append('敬请期待！');
                    }else{
                        $(this).hide();
                    }
                }
            });
            _this.initEvents();
            return _this;
        },
        initEvents: function () {
            var _this = this;
            return _this;
        },
        setLogin:function () {
            $.when(checkLogin()).done(function () {
                $('.user-box .name').text($.cookie('userName'));
                $('.user-box .logged').show();
                $('.user-box .notLogged').hide();
            }).fail(function () {
                $('.user-box .logged').hide();
                $('.user-box .notLogged').show();
            });
        }

    }
    $(function () {
        homeMain.init();
    });
});