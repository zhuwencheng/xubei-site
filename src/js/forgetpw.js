define(['jquery', 'layer', 'text!component-site/forgetpw.html', 'css!../../css/component/registLayer.css', 'cookie', 'validate', 'placeholders'], function ($, layer, tem) {
    layer.config({
        path: '/js/lib/layer/'
    });
    var countTime = 60;
    return function (callback) {
        return layer.ready(function () {
            layer.open({
                type: 1,
                title: '忘记支付密码',
                area: ['705px', '450px'],
                content: tem
            });
            $('input[placeholder]').placeholder();
            var userName = $.cookie('userName');
            $('#c-phone').val(userName);
            $('.getCode').removeClass('disabled');
            $('.getCode').on('click', function () {
                if (!$(this).hasClass('disabled')) {
                    sendCode();
                };
            });
            $('#forget-submit').on('click', function () {
                if ($(".forgetPwdForm").valid()) {
                    resetPsd();
                };
            });
            $(".forgetPwdForm").validate({
                rules: {
                    password: {
                        required: true,
                        isPwd: true
                    },
                    rpassword: {
                        required: true,
                        campare: true
                    },
                    yzmTel: {
                        required: true
                    }
                },
                messages: {
                    password: {
                        required: "*交易密码不能为空",
                        isPwd: "*交易密码为6位数字"
                    },
                    rpassword: {
                        required: "*重复密码不能为空",
                        campare: "*重复密码必须跟密码相同",
                    },
                    yzmTel: {
                        required: "*验证码不能为空"
                    }
                },
                errorElement: 'em',
                errorPlacement: function (error, element) {
                    error.appendTo(element.parent());
                }
            });
            jQuery.validator.addMethod("campare", function (value, element) {
                return $('input[name="password"]').val() == $('input[name="rpassword"]').val();
            }, '重复密码必须跟密码相同');
            jQuery.validator.addMethod("isPwd", function (value, element) {
                return value.match(/^\d{6}$/)
            }, '重复密码必须跟密码相同');
            //方法区域
            function countDown(time) {
                var $btn = $(".getCode");
                if (countTime == 0) {
                    $btn.removeClass("disabled");
                    $btn.text("获取验证码");
                    countTime = 60;
                } else {
                    $btn.addClass("disabled");
                    $btn.text(countTime + "s重新获取");
                    countTime = countTime - 1;
                    setTimeout(function () {
                        countDown();
                    }, 1000);
                }
            }
            function sendCode() {
                $.ajax({
                    url: BASE_URL.user + 'mobile/sendMobileCode',
                    dataType: "jsonp",
                    jsonp: 'callback',
                    data: {
                        mobile: $('#c-phone').val()
                    },
                    success: function (data, type) {
                        if (data.code === '1') {
                            layer.msg('发送成功！');
                            countDown();
                        } else {
                            layer.msg(data.message);
                        }
                    }
                });
            }
            function resetPsd() {
                $.ajax({
                    url: BASE_URL.user + 'businessUser/updatePayPwd',
                    dataType: "jsonp",
                    jsonp: 'callback',
                    data: {
                        loginToken: $.cookie('loginToken'),
                        newPassword: $('input[name="password"]').val(),
                        code: $('input[name="yzmTel"]').val(),
                    },
                    success: function (data, type) {
                        if (data.code === '1') {
                            layer.msg('设置成功！');
                            window.setTimeout(function () {
                                layer.closeAll();
                            }, 1000);
                        } else {
                            layer.msg(data.message);
                        }
                    }
                });
            }
        });
        callback && callback();
    }
});