require(['jquery', 'template', 'layer', 'showImg', 'cookie', 'qrcode'], function($, template, layer) {
    var orderPayType = getQueryString("orderPayType");
    var orderNo = getQueryString("orderNo");
    var orderId = "";
    var payUrl = "";

    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }


    getPrice();
    setTimeout(payTimeOut, 25 * 60 * 1000);
    var inteval = window.setInterval(lun, 2000);

    if (orderPayType == "wx") {
        getPayUrl(BASE_URL.pay + "pay/payBaseOrderOfWechatScan");
        $(".type").text("打开手机微信");
        $(".promptImg").css("background", "url(http://new.xubei.com/images/wx.png) no-repeat");
    } else if (orderPayType == "zfb") {
        getPayUrl(BASE_URL.pay + "pay/scanQRCodePayBaseOrderOfAlipay");
        $(".type").text("打开手机支付宝");
        $(".promptImg").css("background", "url(http://new.xubei.com/images/zfb.png) no-repeat");
    }

    function getPrice() {
        $.ajax({
            url: BASE_URL.sell + "newOrderSale/findOrderDetail.htm",
            data: {
                orderNo: orderNo,
            },
            dataType: "jsonp",
            success: function(data) {
                if (data.retCode == 200) {
                    var data1 = data.result;
                    orderId = data1.orderId;
                    $(".main>.content>.tit>.two>span b").text(data1.orderItemPrice);
                    $(".desc").on("click", function() {
                        window.location.href = BASE_URL.sell + "user/buyer/showBuyOrderDetail.htm?orderId=" + orderId;
                    })

                } else {
                    layer.open({
                        title: '提示',
                        move: false,
                        content: data.message,
                    })
                }
            }
        })
    }

    // 轮询订单状态
    function lun() {
        $.ajax({
            url: BASE_URL.sell + "newOrderSale/findOrderDetail.htm",
            data: {
                orderNo: orderNo,
            },
            dataType: "jsonp",
            success: function(data) {
                if (data.retCode == 200) {
                    var data1 = data.result;
                    if (data1.orderStatus == 0) {

                    } else {
                        window.clearInterval(inteval);
                        window.location.href = "../lease_success_xabuy.html?orderNo=" + orderNo;
                    }
                } else {
                    layer.open({
                        title: '提示',
                        move: false,
                        content: data.message,
                    })

                }
            }
        })
    }

    //25分钟之后订单超时
    function payTimeOut() {
        layer.open({
            icon: 2,
            title: '提示',
            move: false,
            content: '订单支付超时',
            yes: function(index, layero) {
                window.location.href = "../sellList.html";
            }
        });
    }

    function getPayUrl(u) {
        $.ajax({
            url: u,
            data: {
                orderNo: orderNo,
                type: "sell"

            },
            dataType: "jsonp",
            success: function(data) {
                if (data.code == 1) {
                    payUrl = data.result;
                    var qrcode = new QRCode(document.getElementById("qrcode"), {
                        width: 168, //设置宽高
                        height: 168
                    });
                    qrcode.makeCode(payUrl);
                } else {
                    //$(".error").text("*" + data.message);
                    layer.open({
                        icon: 2,
                        title: '提示',
                        move: false,
                        content: data.message,
                        yes: function(index, layero) {
                            window.location.href = "../sellList.html";
                        }
                    });
                }
            }
        })
    }











});