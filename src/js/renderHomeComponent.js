define(['jquery', 'template', 'checkLogin', 'layer', 'text!/component-site/new-header.html', 'text!/component-site/new-footer.html', 'text!/component-site/new-sidebar.html', 'css!../../css/component/z-header', 'css!../../css/component/z-footer', 'css!../../css/component/z-sidebar', 'tools', 'cookie'], function($, template, checkLogin, layer, hTem, fTem, sTem) {
    layer.config({
        path: '//new.xubei.com/js/lib/layer/'
    });
    return function(callback) {
        //var _BASE_URL = 'http://order-api.xubei.org:8081/goods-api/';
        var index = $('.xb-component-header').attr('activeNav');
        var header = $('.xb-component-header').replaceWith(hTem);
        //$('.hx-nav-wrapper .link').eq(index).addClass('active');
        $('.xb-component-footer').replaceWith(fTem);
        $('.hx-component-siderbar').replaceWith(sTem);
        $('body').append(sTem);
        if ($.cookie('hideFTool')) {
            $('.xb-f-tool').hide();
        };
        //其他逻辑区域
        var allGameList = {};
        $('.xb-topfilterbar .s-icon').click(function() {
            var searchText = $('#s-text').val();
            if (!$('.filter-box .s-value').eq(1).data('allname')) {
                layer.msg('请选择游戏类别！', { time: 5000, icon: 2, offset: ['150px'] });
            } else {
                var gameText = [];
                $.each($('.filter-box .s-value'), function(i, item) {
                    if ($(this).data('id') || i == 0) {
                        gameText.push($(this).text());
                    } else {
                        gameText.push('0');
                    }
                });
                gameText.push(searchText);
                location.href = encodeURI(encodeURI(BASE_URL.goods + "indexGoods/indexGoodsConnect?gameConnect=" + gameText.join('-')));
            }
        })
        $('.xb-sidebar>.close').on('click', function() {
            $(this).parent().fadeOut("slow");
        });
        $('.xb-f-tool .close').on('click', function() {
            $.cookie('hideFTool', true, { path: '/', domain: 'xubei.com' });
            $(this).closest('.xb-f-tool').slideUp();
        });
        $('.s-type').on('click', '.t-select p', function(e) {
            var value = $(this).text();
            $(this).closest('.filter-box').find('.s-value').text(value);
            $(this).closest('.t-select').hide();
            e.stopPropagation();
        });
        $('.filter-box').on('click', function(e) {
            if (!$(this).hasClass('disabled')) {
                $('.t-select').hide();
                var index = $(this).index() - 2;
                if (index >= 0 && allGameList[index]) {
                    renderFilterSpan($('.xb-topfilterbar .g-bd').eq(index), { list: allGameList[index] })
                }
                $(this).find('.t-select').show();
                e.stopPropagation();
            }
        });
        $('.filter-box').on('click', '.g-bd span', function(e) {
            var filterParent = $(this).closest('.filter-box');
            var filterIndex = filterParent.index() - 2;
            var spanData = $(this).data();
            filterParent.find('.s-value').data(spanData);
            filterParent.find('.s-value').html($(this).text());
            $(this).closest('.t-select').hide();
            var nextVSpan = $('.filter-box').slice(filterIndex + 2).find('.s-value');
            $.each(nextVSpan, function(i, item) {
                $(this).closest('.filter-box').addClass('disabled');
                $(this).text($(this).attr('aria-placeholder'));
                $(this).removeData();
            });

            allGameList[filterIndex + 1] = allGameList[filterIndex][$(this).data('index')].childlist || null;
            if (allGameList[filterIndex + 1] && allGameList[filterIndex + 1].length > 0) {
                $('.xb-topfilterbar .filter-box').eq(filterIndex + 2).removeClass('disabled');
                $('.xb-topfilterbar .filter-box').eq(filterIndex + 2).trigger('click');
            }
            e.stopPropagation();
        });
        $('.g-filter').on('click', 'em', function(e) {
            $(this).addClass('active').siblings().removeClass('active');
            var filterType = $(this).text().toLocaleLowerCase();
            $(this).closest('.filter-box').find('.g-bd span').hide().filter('[data-e-filter=' + filterType + ']').show();
            e.stopPropagation();
        });
        $(document).on('click', function() {
            $('.t-select').hide();
        });

        //验证客服
        $('#v-kefu').on('click', function() {
            var val = $.trim($('#kefu-input').val());
            if (val) {
                $.ajax({
                    url: BASE_URL.goods + 'auth/authQQ',
                    data: {
                        "qq": val
                    },
                    dataType: "jsonp",
                    success: function(data) {
                        if (data.code === "1") {
                            $('#kefu-result').removeClass('error');
                            $('#kefu-result').html('<em></em>经验证QQ客服' + val + '为真客服');
                        } else {
                            $('#kefu-result').addClass('error');
                            $('#kefu-result').html('<em></em>经验证QQ客服' + val + '为假客服');
                        }
                        $('#kefu-result').show();
                    }

                });
            }
        });
        //验证客服end
        //处理头部删选
        $.ajax({
            url: BASE_URL.goods + 'goods/gameArea/findAllList',
            dataType: "jsonp",
            success: function(data) {
                if (data.code === "1") {
                    allGameList[0] = data.result;
                }
            }

        });

        function renderFilterSpan(dom, data) {
            var html = template('tpl01', data); //.compile
            dom.html(html);
        }
        //老版交互代码
        function setLogin() {
            $.when(checkLogin()).done(function() {
                $('#z-username').text($.cookie('userName'));
                $('#logged').show();
                $('#notLogged').hide();
            }).fail(function() {
                $('#logged').hide();
                $('#notLogged').show();
            });
        };
        window.setLogin = setLogin;
        setLogin();
    };
});