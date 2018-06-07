

    require(['jquery', 'template' , 'layer', 'placeholders','pager'], function ($,template,layer) {
        layer.config({
            path: '/js/lib/layer/'
        });

        //placeholder
        $('input, textarea').placeholder();


        var helpCenterContent = {
            url:{
                header:"http://help.xubei.org/help-api/"
            },
            args: {

            },
            init: function () {
                var _this = this;
                _this._renderDefaultConfig().initEvents();
                return _this;
            },
            initEvents: function () {
                var _this = this;
                _this._getKeyWordBottom();
                _this._getCommonMenu();

                return _this;
            },
            _renderDefaultConfig: function () {
                var _this = this;
                $('body .main > .search .btn').click(function () { _this._search();})
                return _this;
            },
            /* 模板渲染 */
            _template:function (scriptId , myDom , data) {
                var _this = this;
                var elementList = template(scriptId, data);
                myDom.html(elementList);
                return _this;
            },
            /* 获取关键字下面的列表 */
            _getKeyWordBottom:function () {
                var _this = this;

                $.ajax({
                    url: _this.url.header + 'article/queryCommonArticle',
                    dataType: "jsonp",
                    jsonp: 'callback',
                    success:function (data) {
                        // console.log(data);
                        if(data.code == 1){
                            _this._template("getKeyWordBottom" , $("body .main .searchInfo") , data.result);
                        }else{
                            layer.alert(data.message);
                        }
                    }
                });

                return _this;
            },
            /* 获取分类对应的列表数据 */
            _getCommonMenu:function () {
                var _this = this;
                $.ajax({
                    url: _this.url.header + 'menu/queryCommonMenuAndArticle',
                    dataType: "jsonp",
                    jsonp: 'callback',
                    success:function (data) {
                        // console.log(data);
                        if(data.code == 1){
                            _this._template("getCommonMenu" , $("body .main .commonService > .content") , data);
                        }else{
                            layer.alert(data.message);
                        }
                    }
                });
                return _this;
            },
            /* 搜索框功能实现 */
            _search:function () {
                var _this = this;
                var keyWord = $.trim($('body .main > .search input').val());
                if(keyWord == ""){
                    layer.msg("请输入关键字",{ time: 3000, icon: 2, offset: ['150px']});
                    $('body .main > .search input').val("");
                }else {
                    window.location.href = "./helpCenterContent.html?keyWord=" + encodeURI(encodeURI(keyWord));
                }
                return _this;
            },


        }
        $(function () {
            helpCenterContent.init();
        });


    })


