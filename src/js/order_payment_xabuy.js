require(['jquery', 'layer', 'WebUploader', 'registLayer', 'forgetpw', 'validate', 'placeholders', 'cookie'], function($, layer, WebUploader, registLayer, forgetpw) {
    //忘记密码弹窗
    $("#forgetPw").on("click", function() {
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
    var qq = false;
    var phone = false;

    function sell() {
        var phonenumber = $(".phonenumber").val();
        var qqnumber = $(".qqnumber").val();
        $.ajax({
            url: BASE_URL.sell + "newOrderSale/updateSaleOrderPhoneAndQq.htm",
            type: "get",
            dataType: "jsonp",
            data: {
                phone: phonenumber,
                qq: qqnumber,
                orderNo: args.orderNo,
            },
            success: function(data) {
                console.dir(data);
            }
        })

    }

    function payEvent(qq, phone) {
        if (qq == true && phone == true) {
            $(".payBtn").removeClass("events");
            sell();
        } else {
            $(".payBtn").addClass("events");
        }
    }

    //QQ号码验证
    $(".qqnumber").blur(function() {
        var qqnumber = $(".qqnumber").val();
        var qqreg = /^[1-9][0-9]{4,10}$/;
        if (qqnumber == "") {
            $(".qqerror").text("请输入QQ号码！");
            qq = false;
            payEvent(qq, phone);
        } else if (!qqreg.test(qqnumber)) {
            $(".qqerror").text("QQ号字符最大长度为11！");
            qq = false;
            payEvent(qq, phone);
        } else {
            $(".qqerror").text("");
            qq = true;
            payEvent(qq, phone);
        }
    })

    //手机号码验证
    $(".phonenumber").blur(function() {
        var phonenumber = $(".phonenumber").val();
        var reg = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
        if (phonenumber == "") {
            $(".phoneerror").text("请输入手机号码！");
            phone = false;
            payEvent(qq, phone);
        } else if (!reg.test(phonenumber)) {
            $(".phoneerror").text("请输入正确的手机号码格式！");
            phone = false;
            payEvent(qq, phone);
        } else {
            $(".phoneerror").text("");
            phone = true;
            payEvent(qq, phone);
        }
    })

    /* 是否选中余额支付 */
    $(".main>.payChoice>.pay>.choicePay>.passWord").hide();
    $(".main>.payChoice>.balance>.b2 input").change(function() {
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
    $(".main .payBtn").click(function() {
        if (!$(".xieyi input").get(0).checked) {
            layer.open({
                title: '提示',
                content: "请阅读并同意《虚贝资产租赁协议》"
            })
            return;
        }

        payment();

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
                    success: function(data) {
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
                window.location.href = "./goods_pay.html?orderPayType=" + args.orderPayType + "&orderNo=" + args.orderNo;

                // window.location.href = BASE_URL.order + "master/order/createOrder?orderPayType=" + args.orderPayType + "&goodsId=" + args.goodsId + "&userId=" + $.cookie("loginToken") + "&count=" + args.count + "&leaseType=" + args.leaseType + "&businessNo=xubei" + "&mobile=" + args.mobile + "&orderNo=" + args.orderNo + "&isRelet=" + args.isRelet;
            } else {
                /* ye 调用接口 创建订单 */
                /* 获取密码 */
                var pw = $(".main>.payChoice>.pay>.choicePay>.passWord>input").val();
                $.ajax({
                    // url: BASE_URL.order + 'master/order/createOrderBalancePay',
                    url: BASE_URL.pay + 'pay/blancePay',
                    type: "get",
                    data: {
                        orderNo: args.orderNo,
                        type: "sell",
                        payPwd: pw,
                        token: $.cookie('loginToken'),

                    },
                    dataType: "jsonp",
                    success: function(data) {
                        if (data.code == 1) {
                            //window.location.href = data.result.return_url + "?orderNo=" + data.result.order_no
                            window.location.href = "../lease_success_xabuy.html?orderNo=" + args.orderNo;
                        } else {
                            $(".error").text("*" + data.message);
                        }
                    }
                })
            }




        }
    });



    function getList() {
        $.ajax({
            //url: BASE_URL.order + "master/order/findOrderPayParams",
            url: BASE_URL.sell + "newOrderSale/findOrderDetail.htm",
            type: "get",
            dataType: "jsonp",
            data: {
                orderNo: args.orderNo
            },
            success: function(data) {
                if (data.retCode == 200) {
                    var data1 = data.result;
                    $(".prompt .t2").text(data1.goodsTitle);
                    $(".main>.payChoice>.balance>.b2 b").text(data1.orderItemPrice)
                    var sum = data1.orderItemPrice;
                    $(".prompt .sum-money span").text(data1.orderItemPrice);

                    /* 获取账户余额 */
                    $.ajax({
                        //url: BASE_URL.org.user + "businessUser/findUserDetail",
                        url: BASE_URL.pay + "pay/findBalance",
                        type: "get",
                        dataType: "jsonp",
                        data: {
                            token: $.cookie("loginToken")
                        },
                        success: function(data) {
                            if (data.code == 1) {
                                var ye = data.result.AVAILABLE_AMOUNT;
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
                        // $("#tanchang").css("z-index", "100000").show();
                    }
                }

            }
        })
    }
});