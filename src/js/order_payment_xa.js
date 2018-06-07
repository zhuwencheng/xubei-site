require(['jquery', 'layer', 'WebUploader', 'registLayer', 'forgetpw', 'validate', 'placeholders', 'cookie'], function ($, layer, WebUploader, registLayer, forgetpw) {
    //忘记密码弹窗
    $("#forgetPw").on("click", function () {
        forgetpw();
    })
    $(".main>.payChoice>.balance>.b2").hide();
    /* 错误信息弹窗 */
    $("#tanchang").hide();
    var args = {
        goodsId: getQueryString("goodsId"),
        leaseType: getQueryString("leaseType"),
        count: getQueryString("count"),
        orderPayType: null,
        mobile: null,
        orderNo: getQueryString("orderNo"),
        isRelet: getQueryString("isRelet")
    }

    getList();

    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }


    /* 是否选中余额支付 */
    $(".main>.payChoice>.pay>.choicePay>.passWord").hide();
    $(".main>.payChoice>.balance>.b2 input").change(function () {
        if ($(this).is(':checked')) {
            $('input:radio').removeAttr("checked");
            $("input[name=pay]").prop("disabled", "disabled");
            $(".main>.payChoice>.pay>.choicePay>.passWord").show();
        } else {
            // console.log(123);
            $("input[name=pay]").removeAttr("disabled");
            $("input[name=pay]:eq(0)").prop('checked', true);
            $(".main>.payChoice>.pay>.choicePay>.passWord").hide();
        }
    });

    /* 点击确认支付 */
    $(".main .payBtn").click(function () {
        function payment() {
            /* 判断用户信息有没有拿到 */
            if (args.mobile == null) {
                $.ajax({
                    url: BASE_URL.user + "businessUser/findUserDetail",
                    type: "get",
                    dataType: "jsonp",
                    data: {
                        loginToken: $.cookie("loginToken")
                    },
                    success: function (data) {
                        if (data.code == 1) {
                            args.mobile = data.result.user.mobile;
                        }
                    }
                })
            }
            args.orderPayType = $('input:radio:checked').val() || $('.main>.payChoice>.balance>.b2 input').val();
            /* 判断支付类型 */
            /* zfb wx 直接创建订单 */
            if (args.orderPayType == "zfb" || args.orderPayType == "wx") {
                /* 创建订单 */

                window.location.href = BASE_URL.order + "master/order/createOrder?orderPayType=" + args.orderPayType + "&goodsId=" + args.goodsId + "&userId=" + $.cookie("loginToken") + "&count=" + args.count + "&leaseType=" + args.leaseType + "&businessNo=xubei" + "&mobile=" + args.mobile + "&orderNo=" + args.orderNo + "&isRelet=" + args.isRelet;
            } else {
                /* ye 调用接口 创建订单 */
                /* 获取密码 */
                var pw = $(".main>.payChoice>.pay>.choicePay>.passWord>input").val();
                $.ajax({
                    url: BASE_URL.order + 'master/order/createOrderBalancePay',
                    data: {
                        "userId": $.cookie("loginToken"),
                        "goodsId": args.goodsId,
                        "count": args.count,
                        "leaseType": args.leaseType,
                        "payPassword": pw,
                        "businessNo": "xubei",
                        "mobile": args.mobile,
                        "isRelet": args.isRelet,
                        orderNo: args.orderNo
                    },
                    dataType: "jsonp",
                    success: function (data) {
                        // console.log(data);
                        if (data.code == 1) {
                            window.location.href = data.result.return_url + "?orderNo=" + data.result.order_no
                        } else {
                            $(".error").text("*" + data.message);
                        }
                    }
                })
            }




        }

        /* 验证cookie */
        if ($.cookie('loginToken') == null) {
            window.location.href = "http://www.xubei.com/login.htm";
        } else {
            /* 验证cookie是否有效 */
            $.ajax({
                url: BASE_URL.user + 'businessUser/checkLogin',
                type: "get",
                data: {
                    "userId": $.cookie('loginToken')
                },
                dataType: "jsonp",
                success: function (data) {
                    if (data.code == 1) {
                        if (args.orderNo && args.orderNo != "null") {
                            /* 验证订单是否能支付 */
                            $.ajax({
                                url: BASE_URL.order + "master/order/user/checkByOrderItemTime",
                                type: "get",
                                dataType: "jsonp",
                                data: {
                                    userId: $.cookie("loginToken"),
                                    orderNo: args.orderNo,
                                    businessNo: "xubei",
                                    isRelet: args.isRelet
                                },
                                success: function (data) {
                                    if (data.code == 1) {
                                        payment();
                                    } else {
                                        $(".error").text("*" + data.message);
                                    }
                                }
                            })
                        } else {
                            /* 没有订单号  验证商品是否能出租 */
                            verification();
                            function verification() {
                                $.ajax({
                                    url: BASE_URL.order + "goods/user/checkGoodsIsLease",
                                    type: "get",
                                    dataType: "jsonp",
                                    data: {
                                        userId: $.cookie("loginToken"),
                                        goodsId: args.goodsId,
                                        businessNo: "xubei"
                                    },
                                    success: function (data) {
                                        if (data.code == 1) {
                                            payment();
                                        } else {
                                            $(".error").text("*" + data.message);
                                        }
                                    }
                                });

                            }
                        }
                    } else {
                        window.location.href = "http://www.xubei.com/login.htm";
                    }
                }

            });
        }

    });



    function getList() {
        $.ajax({
            url: BASE_URL.order + "master/order/findOrderPayParams",
            type: "get",
            dataType: "jsonp",
            data: {
                userId: $.cookie("loginToken"),
                orderNo: args.orderNo,
                businessNo: "xubei",
                leaseType: args.leaseType,
                count: args.count,
                goodsId: args.goodsId
            },
            success: function (data) {
                // console.log(data);
                if (data.code == 1) {
                    var data1 = data.result;
                    $(".prompt .t2").text(data1.goods_title);
                    $(".prompt .ya-money span").text(data1.foregift_amount);
                    var sum = parseFloat(data1.actual_amount);
                    $(".prompt .zu-money span").text(data1.amount);
                    $(".main>.payChoice>.balance>.b2 span").text(sum);
                    $(".prompt .sum-money span").text(sum);

                    /* 获取账户余额 */
                    $.ajax({
                        url: BASE_URL.user + "businessUser/findUserDetail",
                        type: "get",
                        dataType: "jsonp",
                        data: {
                            loginToken: $.cookie("loginToken")
                        },
                        success: function (data) {
                            // console.log(data);
                            if (data.code == 1) {
                                var ye = data.result.useracount.available_amount;
                                args.mobile = data.result.user.mobile;
                                $(".main>.payChoice>.balance>.b1 span").text(ye);
                                /* 判断合计金额是否大于余额 */
                                if (parseFloat(ye) >= parseFloat(sum)) {
                                    $(".main>.payChoice>.balance>.b2").show();
                                }
                            }
                        }
                    })

                } else {
                    if (data.message == "请登录") {
                        window.location.href = "http://www.xubei.com/login.htm";
                    } else {
                        $("#tanchang p").text(data.message);
                        $("#tanchang").css("z-index", "100000").show();
                    }
                }

            }
        })
    }
});