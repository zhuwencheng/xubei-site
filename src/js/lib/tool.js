/**
 * Created by Administrator on 2016/7/6.
 */
(function ($) {
    var load = (function () {
        var temHtml = '<div class="hx-dialog"><div class="hd-mask"></div><div class="loadcontent"></div></div>';
        var isFisrt = false;
        var Load = function () {
            this.loadDom = $(temHtml);
            this.init();
        };
        Load.prototype = {
            constructor: Load,
            init: function () {
                $('body').append(this.loadDom);
                return this;
            },
            close: function () {
                $(this.loadDom).hide();
                return this;
            },
            _show: function () {
                $(this.loadDom).show();
                return this;
            }
        }
        return function () {
            if (!isFisrt) {
                isFisrt = new Load()
                return isFisrt;
            } else {
                return isFisrt._show();
            }
        };
    })();
    $.extend({
        selectCom: function (domSelector) {
            var domSelector = domSelector || '.hx-select-com';
            $('body').on('click', domSelector, function (e) {
                $(this).find('ul').show();
                e.stopPropagation();
            });
            $('body').on('click', domSelector + ' li', function (e) {
                $(this).closest('ul').hide();
                $(this).closest(domSelector).find('.current').text($(this).text());
                $(this).closest(domSelector).find('.current').attr('data-value', $(this).attr('data-value'));
                e.stopPropagation();
            });
            $(document).click(function () {
                $('body').find(domSelector + ' ul').hide();
            });
        }
        ,
        selectAll: function (domSelector, chlidSelector) {
            var domSelector = domSelector || '.s-num-all';
            var chlidSelector = chlidSelector || '.s-num';
            $('body').on('change', domSelector, function () {
                var that = $(this);
                var checkboxArray = $(this).closest('table').find(chlidSelector);
                $.each(checkboxArray, function (i, item) {
                    item.checked = that[0].checked;
                });
            });
        }
        ,
        hxToolTip: (function () {
            var toopTipContentHtml = '<div class="hx-tooltip"><div class="bd"></div><span class="after"></span></div>';
            var isRender = false;
            var ToolTip = function () {
                this.toolTipDom = $(toopTipContentHtml);
                this.init();
            };
            ToolTip.prototype = {
                constructor: ToolTip,
                init: function () {
                    var that = this;
                    $('body').append(this.toolTipDom);
                    that.initEvents();
                    return this;
                },
                initEvents: function () {
                    var that = this;
                    $('body').on('mouseover', '[data-tooltip]', {main: that}, that._show);
                    $('body').on('mouseout', '[data-tooltip]', {main: that}, that._hide);
                    return that;
                },
                _hide: function (e) {
                    var that;
                    e ? that = e.data.main : that = this;
                    $(that.toolTipDom).fadeOut();
                    return this;
                },
                _show: function (e) {
                    var that;
                    e ? that = e.data.main : that = this;
                    var left = $(this).offset().left;
                    var top = $(this).offset().top;
                    var width = $(this).width() / 2;
                    $(that.toolTipDom).find('.bd').text($(this).attr('data-title'));
                    $(that.toolTipDom).fadeIn().css({
                        left: left + width,
                        top: top - $(that.toolTipDom).outerHeight() - 10,
                        marginLeft: -$(that.toolTipDom).outerWidth() / 2
                    });
                    return this;
                }
            }
            return function () {
                if (!isRender) {
                    isRender = new ToolTip()
                    return isRender;
                } else {
                    return isRender._show();
                }
            };
        })(),
        loading: function () {
            return load();
            //浣跨敤鏂瑰紡 var a=$.loading();鍏抽棴 a.close();
        },
        _navTab: function (parent, child, content) {
            var menuParent = $(parent);
            var menu = menuParent.find(child);
            menu.on('click', function (e) {
                if (!$(this).hasClass('active')) {
                    var index = $(this).index(child);
                    $(this).addClass('active').siblings(child).removeClass('active');
                    menuParent.siblings(menuParent).children().hide().eq(index).show();
                }
            });
            return this;
        },
        getQueryString: function (key) {
            key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + key + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        /*批量赋值*/
        setOptionsData: function (options) {
            for (i in options) {
                if ($('[data-key="' + i + '"]')) {
                    $('[data-key="' + i + '"]').html(options[i]).attr('data-spare', options[i]);
                }
                ;
            }
            //实例:hxucLMain._setOptionsData({yhq:1,tyj:3})
        },
        inintHeader: function () {
            setTimeout(function () {
                if ($.cookie('logintoken') == null && $.cookie('username') == null) {
                    //未登录
                    $('#onlineuser').hide();
                    $('#loginpart').show();
                    $('#login-btn').attr('href', "https://passport.hanxinbank.com/login.html?returnurl=" + window.location.href);
                    $('#sign-btn').attr('href', "https://passport.hanxinbank.com/register.html?returnurl=" + window.location.href);
                } else {
                    $('#timeduring').text($.getHelloStr());
                    $('#spusername').text($.cookie('username'));
                    $('#onlineuser').show();
                    $('#loginpart').hide();

                }
            }, 50);

        },
        fmoney : function (s, n) {
            //转化成千分位并保留两位小数
            n = n > 0 && n <= 20 ? n : 2;
            s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
            var l = s.split('.') [0].split('').reverse(),
                r = s.split('.') [1];
            var  t = '';
            for (var i = 0; i < l.length; i++)
            {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
            }
            return t.split('').reverse().join('') + '.' + r;
        }

    });
})
(jQuery);