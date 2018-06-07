require(['jquery', 'layer', 'WebUploader', 'registLayer', 'loginLayer', 'validate', 'placeholders', 'tools'], function($, layer, WebUploader, registLayer, loginLayer) {
    layer.config({
        path: '/js/lib/layer/'
    });
    var gameId = $.getQueryString('gameId') || 1109;
    var allName = $.getQueryString('allName');
    // var allName = "账号出租-王者荣耀-ios微信版-Q1区王者独尊";
    $('#selectedName').html(allName)
    var fillForm = {
        init: function() {
            var self = this;
            var step1 = self.findAllActity(); //优惠活动
            //self.changeRadio();
            self.radioClick(); //redio事件
            var step2 = self.findAllField(); //动态渲染内容
            $.when(step1, step2).done(self.getEditData(self));
            self.formValidator();
            self.fileUpload();
            $('.fillForm input,.fillForm textarea').placeholder();
        },
        renderEdit: function(data) {
            var testData = data.detail;
            var imgList = data.picture;
            $.each($('[data-field]'), function() {
                var key = $(this).attr('name');
                var type = $(this).attr('data-field');
                if (type === 'radio') {
                    $(this).find('span[data-val="' + testData[key] + '"]').addClass('active').siblings().removeClass('active');
                } else {
                    $(this).val(testData[key]);
                }
                if (type === 'select') {
                    $(this).find("option[value='" + testData[key] + "']").attr("selected", true);
                }

            });
            $.each(imgList, function(i, item) {
                var $li = $('<div class="file-item thumbnail" image_path="' + item.LOCATION + '">' +
                        '<span class="close">×</span><img src="' + item.LOCATION + '">' +
                        '</div>'
                    ),
                    $img = $li.find('img');
                // $list为容器jQuery实例
                $('#list').append($li);
            });
        },
        getEditData: function(self) {
            var self = self;
            $.ajax({
                url: BASE_URL.goods + 'goods/findGoodsTypeAll',
                dataType: "jsonp",
                jsonp: 'callback',
                data: {
                    goodsId: $.getQueryString('goodsId')
                },
                success: function(data) {
                    if (data.code === '1') {
                        self.renderEdit(data.result)
                    }
                }
            });
        },
        hasString: function(Obj, string) {
            if (Obj.indexOf(string) > 0) {
                return true;
            }
        },
        radioClick: function() {
            $('body').on('click', '.radio>span', function() {
                $(this).addClass('active').siblings().removeClass('active');
                $(this).closest('.radio').attr('data-val', $(this).attr('data-val'));
            });
        },
        findAllField: function() {
            return $.ajax({
                url: BASE_URL.goods + 'goods/findGoodsConfig',
                dataType: "jsonp",
                jsonp: 'callback',
                data: {
                    gameId: gameId
                },
                success: function(data) {
                    if (data.code === "1") {
                        var text = "";
                        for (var i in data.result) {
                            if (data.result[i].type == 'text') {
                                text += "<li><label>" + data.result[i].desc + ":</label><input type='text' data-field='text'  desc='" + data.result[i].desc + "' name='" + data.result[i].key + "' class='form_control dynamic'  /></li>";
                            }
                            if (data.result[i].type == 'select') {
                                if (data.result[i].key == '段位' && data.result[i].game == '王者荣耀') {
                                    text += "<li><label>" + data.result[i].desc + ":</label>" + "<div class='info-right'>\n" +
                                        "<select id='gradingId' type='select' data-field='select' desc='段位' class='wzry-select dynamic' name='段位' class='fl h28 w130  dw' reg='/\\S+/' inspect='1' cap='请选择段位'>\n" +
                                        "<option value='>请选择</option><option value='awdw'>无段位</option>\n" +
                                        "<option value='ayyht'>倔强青铜</option><option value='azxby'>秩序白银</option><option value='aryhj'>荣耀黄金</option>\n" +
                                        "<option value='azgbj'>尊贵铂金</option><option value='ayhzs'>永恒钻石</option><option value='azzxy'>至尊星耀</option>\n" +
                                        "<option value='azqwz'>最强王者</option>\n" +
                                        "</select>\n" +
                                        "</div>" + "</li> ";
                                } else {
                                    text += "<li><label>" + data.result[i].desc + ":</label><input type='text'  desc='" + data.result[i].desc + "' name='" + data.result[i].key + "' class='form_control dynamic'  /></li>";
                                }
                            }
                            if (data.result[i].type == 'radio') {
                                text += "<li><label>" + data.result[i].desc + ":</label><div name='" + data.result[i].key + "'data-field='radio' desc='" + data.result[i].desc + "'   class='radio dynamic'><span data-val='0'  class='active'>允许使用<i></i></span><span data-val='1'>不允许使用<i></i></span></div></li>";
                            }
                        }
                        $("#field").html(text);
                    };
                }
            });
        },
        findAllActity: function() {
            return $.ajax({
                url: BASE_URL.goods + 'goods/findGoodsActity',
                //url: 'http://order-api.xubei.org:8081/goods-api/' + 'goods/findGoodsActity',
                dataType: "jsonp",
                jsonp: 'callback',
                data: {
                    gameId: gameId
                },
                success: function(data) {
                    if (data.code === "1") {
                        var text = "";
                        for (var i in data.result) {
                            text += "<span data-val=" + data.result[i].rule + ">" + data.result[i].str_rule + "<i></i></span>";
                        }
                        $("#actitys").html(text);
                    };
                }
            });
        },
        formValidator: function() {
            $.validator.setDefaults({
                //验证通过
                submitHandler: function() {

                    // 没有上传文件校验
                    // if ($('#commentForm #list .file-item').length < 1) {
                    //     $('.fillForm .explain').show();
                    //     return false;
                    // }
                    //校验完成，判断是否登入
                    checkIsLogin(function() {
                        //图片路径
                        $('.submit_btn').attr('disabled');
                        var textArr = '';
                        $('#list>div').each(function(i) {
                            if ($(this).attr('image_path')) {
                                textArr += $(this).attr('image_path') + ",";
                            }
                        });
                        $('#textArr').val(textArr);
                        //系统
                        $("#phoneType").val($('.system .active').attr('data-val'));
                        //上号方式
                        $("#isShow").val($('.shWay .active').attr('data-val'));
                        //动态标签
                        var stringss = '';
                        $('.dynamic').each(function() {
                            if ($(this).attr('type') == 'text') {
                                var key = $(this).attr('name');
                                var desc = $(this).attr('desc');
                                var value = $(this).val();
                                stringss += key + '=' + desc + '=' + value + ';';
                            } else if ($(this).attr('type') == 'select') {
                                var key = $(this).attr('name');
                                var desc = $(this).attr('desc');
                                var value = $(this).val();
                                stringss += key + '=' + desc + '=' + value + ';';
                            } else {
                                var key = $(this).attr('name');
                                var desc = $(this).attr('desc');
                                var value = $(this).children('.active').attr('data-val');
                                stringss += key + '=' + desc + '=' + value + ';';
                            }
                        })
                        $('#actity_str').val($("#actitys .active").attr('data-val'));
                        $('#actity').val($("#actitys .active").text());

                        $("#goodsAttr").val(stringss);
                        $("#loginToken").val($.cookie("loginToken"));
                        $('#gameId').val($.getQueryString('gameId'));
                        $('#goodsId').val($.getQueryString('goodsId'));
                        $('#selectedAllName').val($('#selectedName').text());
                        var params = $("#commentForm").serialize();
                        $.ajax({
                            type: "POST",
                            url: BASE_URL.goods + "goods/saveGoods",
                            //url: 'http://order-api.xubei.org:8081/goods-api/' + "goods/saveGoods",
                            data: params,
                            success: function(msg) {
                                //是否有审核，在个人中心查看
                                if (msg.code == "1") {
                                    window.location.href = 'publishSuccess.html?edit=1&goodsid=' + msg.result.goodsid + '&sign_seller=' + msg.result.sign_seller;
                                } else {
                                    layer.msg(msg.message);
                                }
                                $('.submit_btn').removeAttr('disabled');
                            }
                        });
                    });
                }
            });
            //自定义手机号码验证规则
            jQuery.validator.addMethod("isTel", function(value, element) {
                var tel = /^(?:13\d|15\d|17\d|18\d)\d{5}(\d{3}|\*{3})$/;
                return this.optional(element) || (tel.test(value));
            }, "请输入正确的手机号码");
            //自定义最短租赁时间验证规则
            jQuery.validator.addMethod("timeHowLong", function(value, element) {
                return (value >= 2) ? (this.optional(element) || true) : (this.optional(element) || false);
            }, "请输入正确的手机号码");
            //表单验证规则
            $("#commentForm").validate({
                rules: {
                    goodsTitle: {
                        required: true,
                        minlength: 10
                    },
                    remark: "required",
                    gameAcount: "required",
                    gamePwd: "required",
                    leasePrice: {
                        required: true,
                        number: true
                    },
                    dayHours: {
                        required: true,
                        number: true
                    },
                    tenHours: {
                        required: true,
                        number: true
                    },
                    foregift: {
                        required: true,
                        number: true
                    },
                    shortLease: {
                        required: true,
                        number: true,
                        timeHowLong: true
                    },
                    phone: {
                        required: true,
                        isTel: true
                    },
                    agree: "required"
                },
                messages: {
                    goodsTitle: {
                        required: "商品标题不能为空",
                        minlength: "长度不能小于10个字符哟~"
                    },
                    remark: "商品描述不能为空",
                    gameAcount: "游戏账号不能为空",
                    gamePwd: "游戏密码不能为空",
                    leasePrice: {
                        required: "请输入按小时计的租金设置",
                        number: "请输入有效的数字哟~"
                    },
                    dayHours: {
                        required: "请输入按天计的租金设置",
                        number: "请输入有效的数字哟~"
                    },
                    tenHours: {
                        required: "请输入按次数的租金设置",
                        number: "请输入有效的数字哟~"
                    },
                    foregift: {
                        required: "押金设置不能为空",
                        number: "请输入有效的数字哟~"
                    },
                    shortLease: {
                        required: "请输入最短租赁时间,最少2个小时",
                        number: "请输入有效的数字哟~",
                        timeHowLong: "最少2个小时哟"
                    },
                    phone: {
                        required: "请输入正确的手机号码"
                    },
                    agree: "请接受我们的声明"
                },
                errorElement: 'em',
                errorPlacement: function(error, element) {
                    error.appendTo(element.parent());
                    hasFile();
                }
            })
        },
        fileUpload: function() {
            var uploader = WebUploader.create({
                // 选完文件后，是否自动上传。
                auto: true,
                // swf文件路径
                swf: './js/lib/Uploader.swf',
                // 文件接收服务端。
                //server: BASE_URL.goods + 'arbitration/upTemp',
                server: 'http://good-api.xubei.com/goods-api/arbitration/upTemp',
                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: '#filePicker',
                duplicate: false,
                // 只允许选择图片文件。
                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/*'
                }
            });
            uploader.on('fileQueued', function(file) {
                var $li = $('<div id="' + file.id + '" class="file-item thumbnail">' +
                        '<span class="close">×</span><img>' +
                        '<div class="info">' + file.name + '</div>' +
                        '</div>'
                    ),
                    $img = $li.find('img');
                // $list为容器jQuery实例
                $('#list').append($li);
                // 创建缩略图
                // 如果为非图片文件，可以不用调用此方法。
                // thumbnailWidth x thumbnailHeight 为 100 x 100
                uploader.makeThumb(file, function(error, src) {
                    if (error) {
                        $img.replaceWith('<span>不能预览</span>');
                        return;
                    }

                    $img.attr('src', src);
                }, 70, 70);
                hasFile();
            });
            uploader.on('uploadSuccess', function(file, data) {
                //console.log('---',data)
                $('#' + file.id).addClass('upload-state-done').attr('image_path', data.result.image_path);
            });
            // 文件上传失败，显示上传出错。
            uploader.on('uploadError', function(file) {
                var $li = $('#' + file.id),
                    $error = $li.find('div.error');
                // 避免重复创建
                if (!$error.length) {
                    $error = $('<div class="error"></div>').appendTo($li);
                }
                $error.text('上传失败');
            });
            $('#uploader-demo').on('click', '.close', function() {
                var id = $(this).closest('.file-item').attr('id');
                //uploader.removeFile(id, true);
                $(this).closest('.file-item').remove();
                hasFile();
            })
        },
    }
    fillForm.init();

    function hasFile() {
        if ($('#commentForm #list .file-item').length < 1) {
            $('.fillForm .explain').show()
        } else {
            $('.fillForm .explain').hide()
        }
    };

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
                success: function(data) {
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