require(['jquery', 'template', 'layer', 'registLayer', 'loginLayer', 'showImg', 'cookie'], function($, template, layer, registLayer, loginLayer) {





    var goodsId = getQueryString("goodsId");

    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }


    var a;
    $(".main").on('click', ".desRight>.time>.one", function() {
        a = parseInt($("#shortLease").text());
        $(".cNum").val(a);
        $(this).addClass("current").css({
            "height": "100px",
            "border": "2px solid #498cfa",
            "z-index": "2",
            "margin-top": "-6px"
        }).find("span").css({
            "top": "68px",
            "background": "url('../images/icon.png') 50px 1796px"
        });
        $(this).siblings().removeClass("current").css({
            "height": "100%",
            "border": "none",
            "z-index": "0",
            "margin-top": "0px",
            "border": "1px solid #e2e2e2"
        }).find("span").css({
            "top": "60px",
            "background": "url('../images/icon.png') 50px 1742px"
        });
        $(".main>.description>.desRight>.time div .p-top").css({
            "background-color": "#F8F8F8",
            "color": "#333"
        });
        $(this).find(".p-top").css({
            "background-color": "#208fdd",
            "color": "#fff"
        });
    });

    $(".main").on('click', ".desRight>.time>.four, .desRight>.time>.three, .desRight>.time>.two", function() {
        a = 1;
        $(".cNum").val(1);
        $(this).addClass("current").css({
            "height": "100px",
            "border": "2px solid #498cfa",
            "z-index": "2",
            "margin-top": "-5px"
        }).find("span").css({
            "top": "68px",
            "background": "url('../images/icon.png') 50px 1796px"
        });
        $(this).siblings().removeClass("current").css({
            "height": "100%",
            "border": "none",
            "z-index": "0",
            "margin-top": "0px",
            "border": "1px solid #e2e2e2"
        }).find("span").css({
            "top": "60px",
            "background": "url('../images/icon.png') 50px 1742px"
        });
        $(".main>.description>.desRight>.time div .p-top").css({
            "background-color": "#F8F8F8",
            "color": "#333"
        });
        $(this).find(".p-top").css({
            "background-color": "#208fdd",
            "color": "#fff"
        });
        $(".cNum").val(a);
    });
    /* 点击立即租赁 */
    $(".main").on('click', ".zu", function() {
        function createOrder() {
            $.ajax({
                url: BASE_URL.sell + "newOrderSale/createSaleOrder.htm",
                type: "get",
                dataType: "jsonp",
                //  headers: {
                //     'Access-Token':$.cookie('loginToken')
                //  },
                data: {
                    goodsId: goodsId
                },
                success: function(data) {
                    if (data.retCode == 200) {
                        window.location.href = "./order_payment_xabuy.html?orderNo=" + data.result.orderNo;
                    } else {
                        if (data.message == "请登录") {

                            loginLayer();
                            //window.location.href = "http://www.xubei.com/login.htm";
                        } else {
                            layer.open({
                                title: '提示',
                                content: data.message
                            });
                        }

                    }
                }
            });
        }
        createOrder();
        // if ($.cookie('loginToken') == null) {
        //     window.location.href = "http://www.xubei.com/login.htm";
        // } else {
        //     /* 验证cookie是否有效 */
        //     $.ajax({
        //         url: BASE_URL.org.user + 'businessUser/checkLogin',
        //         data: {
        //             "userId": $.cookie('loginToken'),
        //             businessNo: "xubei"
        //         },
        //         dataType: "jsonp",
        //         success: function (data) {
        //             console.log(data);
        //             if (data.code == 1) {
        //                 /* 验证商品是否可出租  并跳转订单创建页面 */
        //                 // verification();
        //                 createOrder();
        //             } else {
        //                 window.location.href = "http://www.xubei.com/login.htm";
        //             }
        //         }

        //     });
        // }
    })

    getList();

    function getList() {
        $.ajax({
            //url: BASE_URL.goods + "goods/goodsDetails",
            url: BASE_URL.goods + "goods/sale/goodsDetail",
            type: "get",
            dataType: "jsonp",
            data: {
                goodsId: goodsId,
                businessNo: "xubei"
            },
            success: function(data) {
                document.title = data.result.detail.game_all_name + "买号";
                var productListElement = template("product-details", data.result);
                $(".main > .description").html(productListElement);
                var productInfoElement = template("product-info", data.result);
                $(".main > .information").html(productInfoElement);
                var navElement = template("nav-bar", data.result);
                $(".main > .nav").html(navElement);
                // 临时修改方案
                // var needChange = ['paiweisai', 'coin', 'Stamps', 'paiweisai', 'jinbi', 'paiwei', 'dianquan'];
                // $.each(needChange,function (i,item) {
                //     var dom=$('[data-gkey="' + item+'"]');
                //     var value=dom.text()=='0'?'允许使用':'不允许使用';
                //     dom.text(value);
                // })
                //图片预览小图移动效果,页面加载时触发
                showBigImg();

                function showBigImg() {
                    var tempLength = 0; //临时变量,当前移动的长度
                    var viewNum = 5; //设置每次显示图片的个数量
                    var moveNum = 2; //每次移动的数量
                    var moveTime = 300; //移动速度,毫秒
                    var scrollDiv = $(".spec-scroll .items ul"); //进行移动动画的容器
                    var scrollItems = $(".spec-scroll .items ul li"); //移动容器里的集合
                    var moveLength = scrollItems.eq(0).width() * moveNum; //计算每次移动的长度
                    var countLength = (scrollItems.length - viewNum) * scrollItems.eq(0).width(); //计算总长度,总个数*单个长度

                    //下一张
                    //$(".main").on("click",".spec-scroll .next",function(){
                    $(".spec-scroll .next").bind("click", function() {
                        if (tempLength < countLength) {
                            if ((countLength - tempLength) > moveLength) {
                                scrollDiv.animate({ left: "-=" + moveLength + "px" }, moveTime);
                                tempLength += moveLength;
                            } else {
                                scrollDiv.animate({ left: "-=" + (countLength - tempLength) + "px" }, moveTime);
                                tempLength += (countLength - tempLength);
                            }
                        }
                    });
                    //上一张
                    //$(".main").on("click",".spec-scroll .prev",function(){
                    $(".spec-scroll .prev").bind("click", function() {
                        if (tempLength > 0) {
                            if (tempLength > moveLength) {
                                scrollDiv.animate({ left: "+=" + moveLength + "px" }, moveTime);
                                tempLength -= moveLength;
                            } else {
                                scrollDiv.animate({ left: "+=" + tempLength + "px" }, moveTime);
                                tempLength = 0;
                            }
                        }
                    });
                };
                //图片放大镜效果
                $(".jqzoom").jqueryzoom({ xzoom: 380, yzoom: 410 });
                /* 功能代码 */
                a = parseInt($("#shortLease").text());
                $(".cNum").val(a);
                //加的效果
                $(".add").click(function() {
                    var n = $(this).prev().val();
                    var num = parseInt(n) + 1;

                    if (num < a) {
                        return;
                    }
                    $(this).prev().val(num);
                });
                //减的效果
                $(".jian").click(function() {
                    var n = $(this).next().val();
                    var num = parseInt(n) - 1;
                    if (num < a) {
                        return
                    }
                    $(this).next().val(num);
                });

                /* 用户信息 标题切换 */
                $(".main>.information>.tit>p").click(function() {
                    $(".main>.information>.tit>p").removeClass("current");
                    $("#userMessage, #inform").hide();
                    $(this).addClass("current");
                    if ($(this).hasClass("x1")) {
                        $("#userMessage").show();
                    } else {
                        $("#inform").show();
                    }
                });
                /* 百度分享 b*/
                var bdtit = $(".main>.description>.desRight>.tit").text();
                var bdImg;
                if (data.result.picture.length < 1 || data.result.picture == null) {
                    bdImg = "http://static.xubei.com/assets/images/threeChangeIndex/310-70-1.png";
                } else {
                    bdImg = data.result.picture[0].location
                }
                window._bd_share_config = {
                    "common": {
                        bdText: bdtit,
                        bdDesc: "我在虚贝等你开黑哦！！！" + bdtit,
                        bdUrl: location.href,
                        bdPic: bdImg,
                        "bdMini": "2",
                        "bdStyle": "0",
                        "bdSize": "16"
                    },
                    "share": {},
                    "selectShare": {
                        "bdContainerClass": null,
                        "bdSelectMiniList": ["qzone", "tsina", "tqq", "renren", "weixin"]
                    }
                };
                with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];
            }
        })
    }


});