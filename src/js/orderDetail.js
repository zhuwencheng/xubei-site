require(['jquery', 'template', 'layer', 'tools', 'cookie', 'qrcode'], function ($, template, layer) {
    layer.config({
        path: '/js/lib/layer/'
    });
    var orderType="";
    var fillForm = {
        init: function () {
            var self = this;
            self.get_orderData($.cookie("loginToken"), $.getQueryString("orderNo"));
            self.order_cancel($.cookie("loginToken"), $.getQueryString("orderNo"));   
            $('body').on('click','#goPay',function(){
                self.goPay($.cookie("loginToken"), $.getQueryString("orderNo"));
            })        
        },
        get_orderData: function (userId,orderNo){
            var self = this;
            $.ajax({
                url: BASE_URL.order +'master/order/user/findOrderItemByOrderNo',
                data:{
                    "userId": userId,
                    "businessNo":"xubei",
                    "orderNo": orderNo
                },
                type:'post',
                dataType:'json',
                success:function(data){
                    if (data.code == 1) { //请求成功
                        var result = data.result;
                        self.goodsData(result.goods_id,function(goodsData){
                            var html='';
                            var obj = Object.assign(result,goodsData);
                            if (result.order_status == 0) {//0为未支付
                                html = template('tpl_unpay',obj);                       
                            } else if (result.order_status == 1) {//1为支付中 
                            } else if (result.order_status == 2) {//2为支付成功
                                if (result.game_login_mode=="上号器登录"){
                                    if (result.login_device =="android"){
                                        html = template('tpl_buyer_and',obj);
                                    } else if (result.login_device == "iphone"){
                                        html = template('tpl_buyer_ios',obj);
                                    } else if(result.login_device == "pc"){
                                        html = template('tpl_buyer',obj);
                                    }
                                } else if (result.game_login_mode == "账号密码登录"){
                                    html = template('tpl_buyer',obj);
                                }                               
                            } else if (result.order_status == 3) {//3为支付失败
                                html = template('tpl_failure',obj);            
                            } else if (result.order_status == 4) {//4维权中 hidden
                            } else if (result.order_status == 5) {//5位退款成功  hidden                      
                            } else if (result.order_status == 6) {//6位退款失败  hidden                           
                            } else if (result.order_status == 7) {//7取消订单   
                                html = template('tpl_cancel', obj);                     
                            } else if (result.order_status == 100) {//100 交易完成
                                html = template('tpl_complete',obj); 
                            }
                            $('.uc-r-main').html(html);    
                            //二维码
                            if (result.order_status == 2 && result.game_login_mode == "上号器登录"){
                                if (result.login_device == "android" || result.login_device == "iphone") {
                                    self.makeCode(result.mobile,result.order_no)
                                } 
                            }  
                        })
                    }else{ 
                        layer.msg(data.message);
                    }
                }
            })
        },
        goodsData:function(goodsId, fn) {
            $.ajax({
                url: BASE_URL.goods +'goods/goodsDetail',
                data: {
                    "goodsId": goodsId,
                    "businessNo": "xubei"
                },
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    if (data.code == 1) {
                        fn(data.result);
                    }
                },
                error: function (xhr, status, error) {
                    fn({});
                }
            })
        },
        makeCode:function (username, orderId) {
            var qrcode = new QRCode(document.getElementById('codes'), {
                width: 92,
                height: 91,
                text: "http://h5.xubei.com/slogin?buyname=" + username + '&order_no=' + orderId
            });
        },
        order_cancel: function (userId,orderNo) {
            var self = this;
            $('.uc-r-main').on('click','.cancelOrder',function(){
                layer.confirm('您确定要取消订单吗？取消订单后，不能恢复', {
                    btn: ['不，我要留下', '确定'] 
                }, function (index) {
                    layer.close(index);
                }, function () {
                    $.ajax({
                        url: BASE_URL.order +'master/order/user/overOrder',
                        data: {
                            "userId": userId,
                            "businessNo": "xubei",
                            "orderNo": orderNo
                        },
                        type: 'post',
                        dataType: 'json',
                        success: function (data) {
                            if (data.code == "1") {
                                self.get_orderData(userId, orderNo)
                            } else {
                                layer.msg('取消订单服务器错误');
                            }
                        },
                    })
                });
            })
        },
        goPay: function (userId, orderNo){
            var self = this;
            $.ajax({
                url: BASE_URL.order +'master/order/user/checkByOrderItemTime',
                data: {
                    "userId": userId,
                    "businessNo": "xubei",
                    "orderNo": orderNo,
                    "orderType":"1"
                },
                type: 'post',
                dataType: 'json',
                success:function(data){
                    if (data.code == 1) {
                        window.location.href = "../order_payment_xa.html?orderNo=" + orderNo ;
                    }else{
                        layer.msg(data.message, {time:2000});
                    }
                }
            })
        }
    }
    fillForm.init();
}) 
