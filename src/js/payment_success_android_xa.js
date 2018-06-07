require(['jquery','copy','template', 'layer', 'WebUploader', 'registLayer', 'xuzu', 'validate','placeholders','qrcode','cookie'], function ($,CopyToClipboard,template,layer, WebUploader, registLayer, xuzu) {
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width : 140,//设置宽高
        height : 140
    });


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
            url: BASE_URL.order +"master/order/user/findOrderItemByOrderNo",
            type: "get",
            dataType: "jsonp",
            data: {
                userId:$.cookie("loginToken"),
                orderNo:orderNo,
                businessNo:"xubei"
            },
            success: function (data) {
                var productListElement = template("product-info", data.result);
                $(".main>.content>.content-r").html(productListElement);
                $(".xuzu").on("click",function () {
                    /* 时租价 订单号传给弹窗*/
                    //var shizujia = data.result.goods_price;
                    xuzu("5","1231321541D");
                })
                /* 查看我租赁的商品 */
                $("#showOrder").click(function () {
                    window.location.href = "http://www.xubei.com/user/buyer/listRentOrder.htm?orderNo=" + data.result.order_no ;
                });

                /* 生成二维码 */
                //var buyname = data.result.user_name;
                //var order_no = data.result.order_no;
                //qrcode.makeCode("http://h5.xubei.com/slogin?buyname="+buyname+"&order_no="+order_no);
                /* 复制功能 */
                $("#copy").click(function () {
                    var txt = $(this).parent().find("span").text();
                    CopyToClipboard(txt);
                });
            }
        })
    }



});