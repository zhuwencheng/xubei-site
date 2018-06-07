require(['jquery', 'template' , 'layer' , 'placeholders','pager'], function ($,template,layer) {

    layer.config({
        path: '/js/lib/layer/'
    });
    //placeholder
    $('input, textarea').placeholder();
    /* 获取url中的参数 不返回_this */
    window.getQueryString = function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    };
    var helpCenterContent = {
        url:{
            header:"http://help.xubei.org/help-api/"
        },
        args: {
            pageindex: 1,
            pagesize: 11,
            menuId: window.getQueryString("menuId"),
            articleId: window.getQueryString("articleId"),
            timeOrderBy: '',
            priceOrderBy: ''
        },
        init: function () {
            var _this = this;
            _this._renderDefaultConfig().initEvents();
            return _this;
        },
        initEvents: function () {
            var _this = this;
            _this._getCommonMenu();
            _this._getList();

            return _this;
        },
        _renderDefaultConfig: function () {
            var _this = this;
            $('body').on('click', '.main .nav .search .btn', function () { _this._search() });
            return _this;
        },
        /* 模板渲染 */
        _template:function (scriptId , myDom , data) {
            var _this = this;
            var elementList = template(scriptId, data);
            myDom.html(elementList);
            return _this;
        },
        /* 获取分类信息 */
        _getCommonMenu:function () {
            var _this = this;

            $.ajax({
                url: _this.url.header + '/menu/queryCommonMenu',
                dataType: "jsonp",
                jsonp: 'callback',
                success:function (data) {
                    // console.log(data);
                    if(data.code == 1){
                        var num = _this.args.menuId -1 ;
                        $(".lastNav").text(data.result[num].menu_name + " >> ");
                        _this._template("queryCommonMenu" , $(".main .content .content-l>ul") , data);
                        _this._menuActive();
                    }else{
                        layer.alert(data.message);
                    }
                }
            })

            return _this;
        },
        /* 获取详情信息 */
        _getList:function () {
            var _this = this;
            $.ajax({
                url: _this.url.header + '/article/queryArticleById',
                data: {
                    articleId:_this.args.articleId
                },
                dataType: "jsonp",
                jsonp: 'callback',
                success:function (data) {
                    // console.log(data);
                    if(data.code == 1){
                        $(".lastNav2").text(data.result.article_title);
                        $(".main .content .content-r .tit").text(data.result.article_title);
                        $(".main .content .content-r .time").text("发布时间：" + data.result.create_time);
                        $(".main .content .content-r .r-content").html(data.result.article_content);
                    }else{
                        layer.msg(data.message,{ time: 3000, icon: 2, offset: ['150px']});
                    }
                }
            })
            return _this;
        },
        /* 分类栏的active选中 */
        _menuActive:function () {
            var _this = this;
            var index = _this.args.menuId - 1;
            $(".main .content .content-l>ul>li").eq(index).addClass("active");

            return _this;
        },
        /* 搜索框功能实现 */
        _search:function () {
            var _this = this;
            $(".callMe").hide();
            var keyWord = $.trim($('.main .nav .search input').val());
            if(keyWord == ""){
                layer.msg("请输入关键字",{ time: 3000, icon: 2, offset: ['150px']});
                $('.main .nav .search input').val("");
            }else {
                $('.xb-pagination').setPager({
                    pageindex: 1,
                    pagesize: 7,
                    ajax_function: function (pageindex) {
                        return $.ajax({
                            url: _this.url.header + '/article/queryArticleByKeyWord',
                            data: {
                                keyword:keyWord,
                                pageIndex: pageindex,
                                pageSize : 7
                            },
                            dataType: 'jsonp',
                            jsonp: 'callback'
                        });
                    },
                    successFun: function (data) {
                        // console.log(data);
                        if (data.code == '1') {
                            if(data.result.total == 0){
                                $(".main .content .content-r .list").html("<a href=\"./helpCenterGuide.html\"><img src=\"../../images/help/sad.png\" alt=\"#\"></a>");
                            }else {
                                _this._template("keyWordTitle" , $(".main .content .content-r .list") , data.result);
                                $(".keyContent").each(function (i,k) {
                                    $(this).html(data.result.list[i].article_content);
                                });
                                $(".main .content .content-r .list>.keyWordsUl li .tit > a").each(function (i,k) {
                                    $(this).html(data.result.list[i].article_title);
                                });
                            }
                        } else {
                            layer.msg('加载数据失败',{ time: 3000, icon: 2, offset: ['150px']});
                        }
                    },
                    failFun: function (data) {
                        // layer.msg('加载数据失败');
                    }
                });
            }

            return _this;
        }


    }
    $(function () {
        helpCenterContent.init();
    });


})