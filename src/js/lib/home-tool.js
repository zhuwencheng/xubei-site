/**
 * Created by Administrator on 2016/4/26.
 */

(function ($, Handlebars) {
    $.fn.extend({
        Scroll: function (opt, callback) {
            if (!opt) var opt = {};
            var timerID,
                _children = opt.children ? $(this).find(opt.children) : $(this).children(),
                type = opt.type ? opt.type : "top",
                upHeight = opt.height ? opt.height : _children.height(),
                upWidth = opt.width ? opt.width : _children.width();
            var _this = this,
                speed = opt.speed ? parseInt(opt.speed, 10) : 500,
                timer = opt.timer;
            var scrollUp = function () {
                var _children = opt.children ? $(_this).find(opt.children) : $(_this).children();
                if (type == 'top') {
                    _children.eq(0).animate({
                        marginTop: -upHeight
                    }, speed, function () {
                        _this.append(_children.eq(0).css({ marginTop: 0 }));
                    });
                } else {
                    _children.eq(0).animate({
                        marginLeft: -upWidth
                    }, speed, function () {
                        _this.append(_children.eq(0).css({ marginLeft: 0 }));
                    });
                }

            }
            var autoPlay = function () {
                if (timer) {
                    timerID = window.setInterval(scrollUp, timer);
                }
            };
            var autoStop = function () {
                if (timer) {
                    window.clearInterval(timerID);
                }
            };
            _this.hover(autoStop, autoPlay).mouseout();
        },
        navTab: function (opt) {
            var tabNav = $(this).find(opt.nav);
            var tabContent = $(this).find(opt.content).children();
            var activeClass = opt.active || 'active';
            var type = opt.type || 'click';
            tabNav.on(type, function () {
                var index = $(this).index();
                $(this).addClass(activeClass).siblings().removeClass(activeClass);
                tabContent.hide();
                tabContent.eq(index).show();
            });
        },
        fixedScroll: function (className) {
            var that = $(this);
            var top = that.parent().offset().top;
            $(window).scroll(function () {
                if ($(window).scrollTop() > top) {
                    that.addClass(className);
                } else {
                    that.removeClass(className);
                }
            })
        }
    });
    $.extend({
        linkGo: function () {
            $('body').on('click', '[data-href]', function () {
                var url = $(this).attr('data-href');
                window.location.href = url;
            });
        },
        navTab: function (opt) {
            var opt = $.extend({}, opt);
            var tabNav = $('.tabnav');
            var activeClass = opt.active || 'active';
            var type = opt.type || 'click';
            var childNav = opt.navChild || 'span';
            tabNav.on(type, childNav, function () {
                var index = $(this).parent().find(childNav).index(this);
                $(this).addClass(activeClass).siblings(childNav).removeClass(activeClass);
                var tabContent = $(this).closest('.tabnav').siblings('.tabcontent').children();
                tabContent.hide().eq(index).show();
            });
        }
    });
})(jQuery);