define(['jquery', 'layer', 'text!component-site/registLayer.html', 'css!../../css/component/registLayer.css', 'cookie'], function ($, layer, tem) {
    layer.config({
        path: '/js/lib/layer/'
    });
    var phoneStatus = false, codeStatus = false, countTime = 60;
    function checkName() {
        var deferred = $.Deferred();//延迟方法
        var Name = $("#name").val();
        $.ajax({
            url: BASE_URL.user + 'businessUser/verifyUsername',
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                mobile: $('#c-phone').val()
            },
            success: function (data, type) {
                if (data.code === "1") {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            }
        });
        return deferred;
    };
    function checkImgCode() {
        var deferred = $.Deferred();//延迟方法
        var key = $("#imgcode").attr('data-key');
        var val = $.trim($('input[name="yzmImg"]').val());
        $.ajax({
            url: BASE_URL.user + 'code/checkImgCode',
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                tokenCode: key,
                imgCode: val
            },
            success: function (data, type) {
                if (data.code === "1") {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            }
        });
        return deferred;
    };
    function queryImgCode() {
        $.ajax({
            url: BASE_URL.user + 'code/getCode',
            dataType: "jsonp",
            jsonp: 'callback',
            success: function (data, type) {
                if (data.code === '1') {
                    $('#imgcode').attr({
                        src: data.result.imagepath,
                        'data-key': data.result.tokencode
                    })
                }
            }
        });
    }
    function resetSendBtn() {
        if (phoneStatus && codeStatus) {
            $('.getCode').removeClass('disabled');
        } else {
            $('.getCode').addClass('disabled');
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
    function querySign() {
        $.ajax({
            url: BASE_URL.user + 'register/registerUser',
            dataType: "jsonp",
            jsonp: 'callback',
            data: {
                mobile: $('#c-phone').val(),
                mobileCode: $('input[name="yzmTel"]').val(),
                loginPwd: $('input[name="password"]').val()
            },
            success: function (data, type) {
                if (data.code === '1') {
                    var id = data.result.userid;
                    $.cookie('loginToken', id, { path: '/', domain: 'xubei.com' });
                    setLogin();
                    $(window).trigger('login');
                    layer.closeAll();
                } else {
                    layer.msg(data.message);
                }
            }
        });
    }
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
    return function (callback) {
        return layer.ready(function () {
            var dialog = layer.open({
                type: 1,
                title: '注册帐号',
                area: ['706px', '580px'],
                content: tem
            });
            queryImgCode();
            callback && callback();
            $('.goLogin a').click(function () {
                require(['loginLayer'], function (loginLayer) {
                    layer.closeAll();
                    loginLayer();
                });
            });
            $('input[name=tel]').on('blur', function () {
                if (!$(this).hasClass('error')) {
                    checkName().done(function () { phoneStatus = true; $('#r-phone-error').hide(); resetSendBtn(); }).fail(function () { phoneStatus = false; $('#r-phone-error').show(); resetSendBtn(); });
                };
            });
            $('input[name=yzmImg]').on('blur', function () {
                if (!$(this).hasClass('error')) {
                    checkImgCode().done(function () { codeStatus = true; $('#img-error').hide(); resetSendBtn(); }).fail(function () { $('#img-error').show(); resetSendBtn(); });
                };
            });
            $('.getCode').on('click', function () {
                if (!$(this).hasClass('disabled')) {
                    sendCode();
                };
            });
            $('#sign-submit').on('click', function () {
                if ($(".registLayerForm").valid() && phoneStatus && codeStatus) {
                    querySign();
                };
            });
            $("#imgcode").click(queryImgCode);
            //表单验证
            $(".registLayerForm").validate({
                rules: {
                    tel: {
                        required: true,
                        isTel: true
                    },
                    password: {
                        required: true,
                        minlength: 6,
                        maxlength: 15
                    },
                    rpassword: {
                        required: true,
                        campare: true
                    },
                    yzmImg: {
                        required: true,
                        minlength: 4,
                        maxlength: 4
                    },
                    yzmTel: {
                        required: true
                    },
                    agree: "required"
                },
                messages: {
                    tel: {
                        required: "*手机号码不能为空"
                    },
                    password: {
                        required: "*密码不能为空",
                        minlength: "*密码长度为6-15位",
                        maxlength: "*密码长度为6-15位"
                    },
                    rpassword: {
                        required: "*重复密码不能为空",
                        campare: "*重复密码必须跟密码相同"
                    },
                    yzmImg: {
                        required: "*验证码不能为空",
                        minlength: "*验证码长度不对",
                        maxlength: "*验证码长度不对"
                    },
                    yzmTel: {
                        required: "*验证码不能为空"
                    },
                    agree: "*请接受我们的声明"
                },
                errorElement: 'em',
                errorPlacement: function (error, element) {
                    error.appendTo(element.parent());
                }
            })
            jQuery.validator.addMethod("isTel", function (value, element) {
                var tel = /^(?:13\d|15\d|17\d|18\d)\d{5}(\d{3}|\*{3})$/;
                return tel.test(value);
                //return this.optional(element) || (tel.test(value));
            }, "*请输入格式正确的手机号码");
            jQuery.validator.addMethod("valCheckName", function (value, element) {
                return checkName();
            }, '名称已存在');
            jQuery.validator.addMethod("campare", function (value, element) {
                return $('input[name="password"]').val() == $('input[name="rpassword"]').val();
            }, '重复密码必须跟密码相同');

        })
    }
});