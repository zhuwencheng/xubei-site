define(['jquery', 'layer', 'text!component-site/xuzu.html', 'css!../../css/component/xuzu.css', 'cookie','validate','placeholders'], function ($, layer, tem) {
    layer.config({
        path: '/js/lib/layer/'
    });
    return function (shizujia,orderNo) {
        return layer.ready(function () {
            layer.open({
                type: 1,
                title: '商品续租',
                area: ['450px', '310px'],
                content: tem
            });
            /*  时租价  */
            $(".szj").text(parseFloat(shizujia).toFixed(2));
            $(".sum").text(parseFloat(shizujia).toFixed(2));
            var a = 1 ;
            $(".cNum").val(a);
            //加的效果
            $(".add").click(function () {
                var n = $(this).prev().val();
                var num = parseInt(n) + 1;

                if (num < a) {
                    return;
                }
                $(this).prev().val(num);
                var szj = $(".szj").text();
                var sum = parseFloat(szj)*num;
                $(".sum").text(sum.toFixed(2));
            });
            //减的效果
            $(".jian").click(function () {
                var n = $(this).next().val();
                var num = parseInt(n) - 1;
                if (num < a) {
                    return
                }
                $(this).next().val(num);
                var szj = $(".szj").text();
                var sum = parseFloat(szj)*num;
                $(".sum").text(sum.toFixed(2));
            });
            /* 点击我要续租 */
            $(".loginLayerBtn").click(function () {
                var count = $(".cNum").val();
                // console.log(count);
                // console.log(orderNo);
                if( count && orderNo){
                    window.location.href= "./order_payment_xa.html?orderNo=" + orderNo + "&count=" + count + "&isRelet=1";
                }

            })
        });
        //callback && callback();
    }
});