require(['jquery', 'layer',  'registLayer', 'loginLayer', 'tools'], function ($, layer,registLayer, loginLayer) {
    layer.config({
        path: '/js/lib/layer/'
    });
    $('.toPosition').on('click',function(e){
        var a=$('.'+$(this).attr('data-attr')).offset().top;
        $('html').animate({ scrollTop: a+'px' }, 'easein');
        e.preventDefault();
    });//回到顶部
    $('.need-login').on('click',function(e){
        e.preventDefault();
        var href=$(this).attr('href');
        checkIsLogin(function(){
            location.href=href;
        })
    });
    function checkIsLogin(fn) {
        //验证通过
        var loginToken = $.cookie("loginToken");
        if (loginToken) {
            //校验loginToken是否过期
            $.ajax({
                url: BASE_URL.user + "businessUser/checkLogin",
                data: {
                    "userId": loginToken
                },
                dataType: "jsonp",
                success: function (data) {
                    if (data.code == 1) {
                        //已登录
                        fn();
                    } else {
                        loginLayer();
                        return false;
                    }
                }
            })
        } else {
            loginLayer();
            return false;
        }
    }
}) 
