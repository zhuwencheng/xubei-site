require(['jquery', 'template', 'tools'], function ($, template) {
    var sellCenter = {
        init: function () {
            var _this = this;
            _this._renderDefaultConfig().initEvents();
            return _this;
        },
        initEvents: function () {
            var _this = this;
            $('.tj-center').on('mouseover', '.sc-hd02 span', function () {
                var index = $(this).index();
                $(this).addClass('active').siblings().removeClass('active');
                $('.tj-center .bd').children('div').hide().eq(index).show();
            });
            return _this;
        },
        _renderDefaultConfig: function () {
            var _this = this;
            _this.queryGameDefault();
            _this.queryTjGameDefault();
            return _this;
        },
        _sort:function(){//脑残需求
            for(i=1;i<3;i++){
                if(i===1){
                    $('.sc-position').after($('[data-sort='+i+']').closest('.w1200'));
                }else{
                    $('[data-sort='+(i-1)+']').closest('.w1200').after($('[data-sort='+i+']').closest('.w1200'));
                }
            }
        },
        queryGameDefault: function () {
            var _this = this;
            $.ajax({
                url: BASE_URL.goods + 'goods/gameArea/findGameBlock',
                dataType: "jsonp",
                jsonp: 'callback',
                success: function (data) {
                    if (data.code === "1") {
                        //console.log(data);
                        _this._renderSteamGame(data.result[0]);
                        _this._renderPcGame(data.result[1]);
                        _this._renderPhoneGame(data.result[2]);
                        _this._sort();
                    };
                }
            });
            return _this;
        },
        queryTjGameDefault: function () {
            var _this = this;
            $.ajax({
                url: BASE_URL.goods + 'goods/sale/hotGameList',
                dataType: "jsonp",
                jsonp: 'callback',
                success: function (data) {
                    if (data.code === "1") {
                        //console.log(data);
                        _this._renderTjGame(data.result);

                    };
                }
            });
            return _this;
        },
        _renderSteamGame: function (data) {
            var _this = this;
            var html = template('sell-tpl01', data);//.compile
            $('.steam-center').html(html);
            return _this
        },
        _renderPcGame: function (data) {
            var _this = this;
            var html = template('sell-tpl02', data);//.compile
            $('.pc-center').html(html);
            return _this
        },
        _renderPhoneGame: function (data) {
            var _this = this;
            var html = template('sell-tpl03', data);//.compile
            $('.phone-center').html(html);
            return _this
        },
        _renderTjGame: function (data) {
            var _this = this;
            var html = template('sell-tpl04', data);//.compile
            $('.tj-center').html(html);
            $('.tj-center .sc-hd02 span').eq(0).trigger('mouseover');
            return _this;
        }
    }
    $(function () {
        sellCenter.init();
    });
});