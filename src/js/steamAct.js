require(['jquery', 'checkLogin', 'loginLayer', 'tools'], function($, checkLogin, loginLayer) {
    var main = {
        hasLogin: false,
        step1: false,
        step2: false,
        init: function() {
            var _this = this;
            _this.setLogin();
            _this.initEvents();
            return _this;
        },
        initEvents: function() {
            var _this = this;
            $('.to-login').on('click', function() {
                loginLayer(function() {});
            });
            $(window).on('login', function() {
                window.location.href = location.href;
            });
            $('.bdsharebuttonbox').on('click', 'a', function() {
                _this.queryYy();
            });
            return _this;
        },
        setLogin: function() {
            var _this = this;
            $.when(checkLogin()).done(function() {
                $('.login-box .name').text($.cookie('userName'));
                $('.login-box .h-login').show();
                $('.login-box .n-login').hide();
                $('.c-mask').hide();
                _this.queryDefault();
            }).fail(function() {
                $('.login-box .logged').hide();
                $('.login-box .notLogged').show();
                $('.c-mask').show();
                _this.queryDefault();
            });
            var _this = this;
        },
        queryDefault: function() {
            var _this = this;
            $.ajax({
                //url: BASE_URL.goods + 'goods/findChdByGameParent',
                url: BASE_URL.user + 'help/chickenActivity/appointmentData',
                dataType: "jsonp",
                jsonp: 'callback',
                data: {
                    //parentId: id || _this.queryParams.gameId
                    loginToken: $.cookie('loginToken') || ''
                },
                success: function(data) {
                    if (data.code === "1") {
                        $('.num').text(data.result.total);
                        _this.step1 = data.result.appointment == 1 ? true : false;
                        _this.step2 = data.result.qualification == 1 ? true : false;
                        _this.renderDefaultConfig();
                    };
                }
            });
            return _this;
        },
        queryYy: function() {
            var _this = this;
            $.ajax({
                //url: BASE_URL.goods + 'goods/findChdByGameParent',
                url: BASE_URL.user + 'help/chickenActivity/appointment',
                dataType: "jsonp",
                jsonp: 'callback',
                data: {
                    //parentId: id || _this.queryParams.gameId
                    loginToken: $.cookie('loginToken') || ''
                },
                success: function(data) {
                    if (data.code === "1") {
                        _this.step1 = true;
                        _this.renderDefaultConfig();
                    };
                }
            });
            return _this;
        },
        renderDefaultConfig: function() {
            var _this = this;
            $('.w-des').hide();
            $('.zgbox li').hide();
            if (_this.step1 && _this.step2) {
                $('.w-des').eq(1).show();
                $('.zgbox li.active').show();
            } else if (_this.step1 && !_this.step2) {
                $('.w-des').eq(0).show();
                $('.zgbox li').eq(1).show();
                $('.zgbox li').eq(2).show();
            } else {
                $('.w-des').eq(0).show();
                $('.zgbox li').eq(0).show();
                $('.zgbox li').eq(2).show();
            }
            return _this;
        }

    }
    $(function() {
        main.init();
        var bdtit = $(".main>.description>.desRight>.tit").text();
        var bdImg = "http://new.xubei.com/images/actImages/tit.png";
        window._bd_share_config = {
            "common": {
                bdText: bdtit,
                bdDesc: "虚贝网：国服吃鸡，免费试玩！！！" + bdtit,
                bdUrl: 'http://new.xubei.com/steamAct.html',
                bdPic: bdImg,
                "bdMini": "2",
                "bdStyle": "0",
                "bdSize": "32"
            },
            "share": {},
            "selectShare": {
                "bdContainerClass": null,
                "bdSelectMiniList": ["qzone", "tsina", "tqq", "renren", "weixin"]
            }
        };
        with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];
    });
});