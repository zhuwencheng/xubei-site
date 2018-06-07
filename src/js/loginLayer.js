define(['jquery', 'layer', 'text!component-site/loginLayer.html', 'css!../../css/component/loginLayer.css', 'cookie', 'validate'], function ($, layer, tem) {
    layer.config({
        path: '/js/lib/layer/'
    });
    function login() {
        $.ajax({
            url: 'http://www.xubei.com/ajaxLogin2.htm',
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                phone: $('#login-phone').val(),
                pwd: $('#login-psd').val()
            },
            success: function (data, type) {
                if (data.outstr === 1) {
                    var id = data.loginToken;
                    $.cookie('loginToken', id, { path: '/', domain: 'xubei.com' });
                    setLogin();
                    layer.closeAll();
                    $(window).trigger('login');
                } else {
                    layer.msg(data.message);
                }
            }
        });
    }
    return function (callback) {
        return layer.ready(function () {
            layer.open({
                type: 1,
                title: '账号密码登录',
                area: ['500px', '400px'],
                content: tem
            });
            callback && callback();
            $('.noAccount .regist').click(function () {
                require(['registLayer'], function (registLayer) {
                    layer.closeAll();
                    registLayer();
                });
            });
            $('.loginLayerBtn').on('click', function () {
                if ($(".loginLayerForm").valid()) {
                    login();
                };
            });
            //表单验证
            $(".loginLayerForm").validate({
                rules: {
                    tel: {
                        required: true,
                        isTel: true
                    },
                    password: {
                        required: true,
                        minlength: 6
                    }
                },
                messages: {
                    tel: {
                        required: "*手机号码不能为空"
                    },
                    password: {
                        required: "*密码不能为空",
                        minlength: "*密码长度最少6位"
                    }
                }
            })
            jQuery.validator.addMethod("isTel", function (value, element) {
                var tel = /^(?:13\d|15\d|17\d|18\d)\d{5}(\d{3}|\*{3})$/;
                return this.optional(element) || (tel.test(value));
            }, "*请输入格式正确的手机号码");

        })
    }
});