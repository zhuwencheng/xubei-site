require(['jquery', 'copy', 'template', 'layer', 'WebUploader', 'registLayer', 'xuzu', 'validate', 'placeholders', 'qrcode', 'cookie'], function ($, CopyToClipboard, template, layer, WebUploader, registLayer, xuzu) {
    /* 右边数据获取 
    $.ajax({
        url: BASE_URL.goods + "goods/goodsActity",
        type: "get",
        dataType: "jsonp",
        success: function (data) {
            $(".main>.content>.content-r>.description").html(data.result.html);
        }
    });*/

    /* 获取左边数据  模板渲染 */
    var orderNo = getQueryString("orderNo");
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
    getList();
    function getList() {
        $.ajax({
            //url: BASE_URL.order + "master/order/user/findOrderItemByOrderNo",
            url: BASE_URL.sell + "newOrderSale/findOrderDetail.htm",
            data: {
                orderNo: orderNo,
            },
            type: "get",
            dataType: "jsonp",
            /* data: {
                 userId: $.cookie("loginToken"),
                 orderNo: orderNo,
                 businessNo: "xubei"
             },*/
            success: function (data) {
                if (data.retCode == 200) {
                    var productListElement = template("product-info", data.result);
                    $(".main>.content>.content-l").html(productListElement);
                    $(".xuzu").on("click", function () {
                        /* 时租价 订单号传给弹窗*/
                        var shizujia = data.result.goods_price;
                        xuzu(shizujia, orderNo);
                    })
                    /* 复制功能 */
                    $(".copy").click(function () {
                        var txt = $(this).parent().find("span").text();
                        CopyToClipboard(txt);
                    });
                }


            }
        })
    }
});