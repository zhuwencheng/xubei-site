require(['jquery', 'template', 'pager', 'tools'], function ($, template) {
    var shopListMain = {
        asc: {
            timeOrderBy: '',
            priceOrderBy: ''
        },
        queryParams: {
            priceRange: '',//价格范围
            //type: '',//上号方式
            signSeller: '',//签约卖家
            //deposit: '',//押金
            searchText: '',
            system: '',
            server: '',//服
            area: '',//区
            timeOrderBy: '',
            priceOrderBy: '',
            theme: '',
            businessNo: '',
            gameId: 1808
        },
        init: function () {
            var _this = this;
            _this._renderDefaultConfig().initEvents();
            return _this;
        },
        initEvents: function () {
            var _this = this;
            $('body').on('mouseenter', '.tab-filter li', function () { _this._tabFilter(this) });
            $('body').on('click', '.tab-content .text,.tab-content .s-btn', function () { _this._setTabFilter(this) });
            $('body').on('click', '.act-f-box em', function () { _this._deleteTabFilter(this) });
            $('body').on('click', '.filter-table .show-more', function () { _this._changeFilterHeight(this) });
            $('body').on('click', '.search-box span', function () { _this._search($.trim($(this).siblings('input').val())) });
            $('body').on('click', '.search-key span', function () { $('#seachinput').val($(this).text()); _this._search($(this).text()) });
            $('body').on('click', '[data-s-filter] span', function () { _this._setSFilter(this) });
            $('body').on('click', '.filter-nav span', function () { _this._setNavAscFilter(this) });
            $('body').on('click', '.page .pre', function () { $('.xb-pagination .pre').trigger('click') });
            $('body').on('click', '.page .next', function () { $('.xb-pagination .next').trigger('click') });
            return _this;
        },


        _renderDefaultConfig: function () {
            var _this = this;
            _this._setGameDefaultQueryParams();
            _this._queryDefault();
            _this._queryArea();
            _this._querySearchKey();
            //_this._queryTheme();
            return _this;
        },
        _changeFilterHeight: function (dom) {
            var _this = this;
            if ($(dom).hasClass('active')) {
                $(dom).removeClass('active');
                $(dom).siblings('.filter-c').addClass('hide-filter');
            } else {
                $(dom).addClass('active');
                $(dom).siblings('.filter-c').removeClass('hide-filter');
            }
            return _this;
        },
        _setGameDefaultQueryParams: function () {
            var _this = this;
            _this.queryParams.gameId = $.getQueryString('gameid') || '1808';
            _this.queryParams.priceRange = $.getQueryString('priceRange') || '';
            _this.queryParams.theme = $.getQueryString('theme') || '';
            if ($.getQueryString('searchText')) {
                _this.queryParams.searchText = $.getQueryString('searchText');
                $('#seachinput').val(_this.queryParams.searchText);
            };
            return _this;
        },
        _tabFilter: function (dom) {
            var _this = this;
            var index = $(dom).index();
            $(dom).addClass('active').siblings().removeClass('active');
            $('.tab-content>div').hide().eq(index).show();
            return _this;
        },
        _setTabFilter: function (dom) {
            var _this = this;
            var text, value;
            var type = $(dom).parent().attr('data-name');
            if ($(dom).hasClass('text')) {
                text = $(dom).attr('data-text') || $(dom).text();
                value = $(dom).attr('data-val');
                $(dom).addClass('active').siblings('.text').removeClass('active');
            } else {
                var min = parseFloat($(dom).siblings('input[type="text"]').eq(0).val());
                var max = parseFloat($(dom).siblings('input[type="text"]').eq(1).val());
                if (!isNaN(min) && !isNaN(max)) {
                    value = Math.min(min, max) + '-' + Math.max(min, max);
                } else if (isNaN(min) && isNaN(max)) {
                    return false;
                } else if (isNaN(max)) {
                    value = min + '-' + 999999999;
                } else {
                    value = 0 + '-' + max;
                }
                text = $(dom).attr('data-name') + value;
                $(dom).siblings('.text').removeClass('active');
            }
            _this.queryParams[type] = value;
            $('.act-f-box[data-name=' + type + ']').remove();
            $('.shoplist-filter .hd').append('<span data-name="' + type + '" class="act-f-box">' + text + '<em></em></span>');
            _this._queryList();
            return _this;
        },
        _deleteTabFilter: function (dom) {
            var _this = this;
            var type = $(dom).parent().attr('data-name');
            _this.queryParams[type] = '';
            $('.tab-content>div[data-name="' + type + '"]').find('span').removeClass('active');
            $(dom).parent().remove();
            _this._queryList();
            return _this;
        },
        _search: function (key) {
            var _this = this;
            $('[data-key="theme"]').removeClass('active');
            _this.queryParams.searchText = key;
            _this._queryList();
            return _this;
        },
        _setSFilter: function (dom) {
            var _this = this;
            var key = $(dom).parent().attr('data-s-filter');
            if ($(dom).attr('data-val') !== undefined) {
                _this.queryParams[key] = $(dom).attr('data-val');
            } else {
                _this.queryParams[key] = $(dom).text();
            }
            $(dom).addClass('active').siblings().removeClass('active');
            _this._queryList();
            if (key === "area") {
                _this.queryParams.server = '';
                _this._queryChdArea($(dom).attr('data-id'));
            }
            return _this;
        },
        _setNavAscFilter: function (dom) {
            var _this = this;
            if ($(dom).attr('data-key') === 'all') {
                _this.queryParams.searchText = '';
                $('#seachinput').val('');
                $(dom).siblings().removeClass('active');
                for (var i in _this.asc) {
                    _this.asc[i] = '';
                    $('[data-key=' + i + ']').find('em').removeClass('active');
                };
                $.extend(_this.queryParams, _this.asc);
            } else if ($(dom).attr('data-key') === 'theme') {
                $(dom).addClass('active').siblings().removeClass('active');
                $('#seachinput').val($(dom).text());
                _this.queryParams.searchText = $(dom).text();
            } else {
                for (var i in _this.asc) {
                    _this.asc[i] = '';
                }
                if ($(dom).find('em[data-default]').hasClass('active')) {
                    $('[data-key]').find('em').removeClass('active');
                    $(dom).find('em').removeClass('active').not('[data-default]').addClass('active');
                    this.asc[$(dom).attr('data-key')] = $(dom).find('em[data-default]').attr('data-default') === '0' ? "1" : "0";
                } else {
                    $('[data-key]').find('em').removeClass('active');
                    $(dom).find('em').removeClass('active').filter('[data-default]').addClass('active');
                    this.asc[$(dom).attr('data-key')] = $(dom).find('em[data-default]').attr('data-default');
                };
                $.extend(_this.queryParams, _this.asc);
            }
            _this._queryList();
            return _this;
        },
        _renderHotGame: function (data) {
            var _this = this;
            var html = template('list-tpl01', { list: data });
            $('.shoplist-filter .hot-game').html(html).closest('.filter-table').show();
            return _this;
        },
        _renderPcGame: function (data) {
            var _this = this;
            var html = template('list-tpl02', { list: data });
            $('#pcgame').html(html).closest('.filter-table').show();
            return _this;
        },
        _renderPhoneGame: function (data) {
            var _this = this;
            var html = template('list-tpl02', { list: data });
            $('#phonegame').html(html).closest('.filter-table').show();
            return _this;
        },
        _renderSteamGame: function (data) {
            var _this = this;
            var html = template('list-tpl02', { list: data });
            $('#steamgame').html(html).closest('.filter-table').show();
            return _this;
        },
        _renderOtherGame:function(data){
            var _this = this;
            var html = template('list-tpl02', { list: data });
            $('.filter-table').eq(0).after(html);
            return _this;
        },
        _renderArea: function (data) {
            var _this = this;
            var html = template('list-tpl03', { list: data });//.compile
            if (data.length > 0) {
                $('[data-s-filter="area"]').html(html).closest('.filter-table').show();
                // $('[data-s-filter="area"] span').eq(0).trigger('click');
            }
            _this._queryList();
            return _this
        },
        _renderServer: function (data) {
            var _this = this;
            if (data.length > 0) {
                var html = template('list-tpl03', { list: data });//.compile
                _this.queryParams.gameId === '1109' ? '' : $('[data-s-filter="server"]').html(html).closest('.filter-table').show();
            }
            return _this
        },
        _renderSearchKey: function (data) {
            var _this = this;
            var html = template('list-tpl04', { list: data });//.compile
            $('.search-key').append(html);
            return _this
        },
        _renderTheme: function (data) {
            var _this = this;
            var html = template('list-tpl05', { list: data });//.compile
            $('.filter-nav').append(html);
            return _this
        },
        _renderList: function (data) {
            var _this = this;
            var html = template('list-tpl06', data);//.compile
            $('#shop-table').html(html);
            return _this
        },
        _renderTopPage: function (data) {
            var _this = this;
            $('.page .total').text(data.total);
            $('.page .current').text(data.pageindex);
            $('.page .totalPage').text(data.totalpagenum);
            if (data.pageindex == 1) {
                $('.page .pre').addClass('disabled');
            } else {
                $('.page .pre').removeClass('disabled');
            };
            if (data.pageindex == data.totalpagenum) {
                $('.page .next').addClass('disabled');
            } else {
                $('.page .next').removeClass('disabled');
            };
            return _this
        },
        //查询游戏111
        _queryDefault: function () {
            var _this = this;
            $.ajax({
                //url: BASE_URL.goods + 'goods/findGoodsAttr',
                url: BASE_URL.goods + 'goods/sale/findGoodsSaleAttr',
                dataType: "jsonp",
                jsonp: 'callback',
                success: function (data) {
                    if (data.code === "1") {
                        //console.log(data.result);
                        _this._renderHotGame(data.result.hotgame);
                        _this._renderOtherGame(data.result.othergame);
                        // _this._renderPcGame(data.result.computergame);
                        // _this._renderPhoneGame(data.result.phonegame);
                        // _this._renderSteamGame(data.result.steamgame);
                        $('[data-gid="' + _this.queryParams.gameId + '"]').addClass('active');
                        $('title').text($('[data-gid="' + _this.queryParams.gameId + '"]').eq(0).text() + '-' + $('title').text());
                        //临时需求
                        if($('[data-gid="' + _this.queryParams.gameId + '"]').eq(0).text()==="英雄联盟"){
                            $('#yh-ad').show();
                        }
                    };
                }
            });
            return _this;
        },
        //查询游戏区
        _queryArea: function (id) {
            var _this = this;
            $.ajax({
                //url: BASE_URL.goods + 'goods/findGameAreaById',
                url: BASE_URL.goods+'goods/findGameAreaById',
                dataType: "jsonp",
                jsonp: 'callback',
                data: {
                    //parentId: id || _this.queryParams.gameId
                    id: id || _this.queryParams.gameId
                },
                success: function (data) {
                    if (data.code === "1") {
                        _this.gameTreeClass = data.result.children;
                        _this._renderArea(data.result.children);
                        if (data.result.game_type == 1) {
                            $('.g-phone-type').hide();
                        }
                    };
                }
            });
            return _this;
        },
        _queryChdArea: function (id) {
            var _this = this;
            for (var i = 0; i < _this.gameTreeClass.length; i++) {
                if (_this.gameTreeClass[i].id == id) {
                    if (_this.gameTreeClass[i].children && _this.gameTreeClass[i].children.length > 0) {
                        _this._renderServer(_this.gameTreeClass[i].children);
                    }
                    break;
                }
            }
            return _this;
        },
        _querySearchKey: function () {
            var _this = this;
            $.ajax({
                //url: BASE_URL.goods + 'goods/findGoodsAttrById',
                url: BASE_URL.goods+'goods/sale/findGoodsSaleAttrById',
                dataType: "jsonp",
                jsonp: 'callback',
                data: {
                    gameId: _this.queryParams.gameId
                },
                success: function (data) {
                    if (data.code === "1") {
                        _this._renderSearchKey(data.result.split(','));
                    }
                    ;
                }
            });
            return _this;
        },
        _queryTheme: function () {
            var _this = this;
            $.ajax({
                //url: BASE_URL.goods + 'goods/findGoodsTheme',
                url: BASE_URL.goods+'goods/findGoodsTheme',
                dataType: "jsonp",
                jsonp: 'callback',
                data: {
                    gameId: _this.queryParams.gameId
                },
                success: function (data) {
                    if (data.code === "1") {
                        _this._renderTheme(data.result);
                    };
                }
            });
            return _this;
        },
        _queryList: function () {
            var _this = this;
            //console.log(_this.queryParams);
            $('.xb-pagination').setPager({
                pageindex: 1,
                pagesize: 20,
                ajax_function: function (pageindex) {
                    return $.ajax({
                        //url: BASE_URL.goods + 'goods/findGoodsLists',
                        url: BASE_URL.goods+'goods/sale/findGoodsList',
                        data: $.extend({}, _this.queryParams, { pageIndex: pageindex, pageSize: 20 }),
                        dataType: 'jsonp',
                        jsonp: 'callback'
                    });
                },
                successFun: function (data) {
                    if (data.code == '1') {
                        //console.log(data.result);
                        _this._renderList(data.result);
                        _this._renderTopPage(data.result);
                    } else {
                        layer.msg('加载数据失败');
                    }
                },
                failFun: function (data) {
                    // layer.msg('加载数据失败');
                }
            });
            return _this;
        }

    }
    $(function () {
        shopListMain.init();
    });
});