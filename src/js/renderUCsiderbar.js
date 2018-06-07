/**
 * Created by Administrator on 2017/5/25.
 */
define(['jquery','checkLogin', 'text!component-site/header2.html', 'text!component-site/footer.html', 'text!component-site/siderbar.html', 'css!../../css/component/home-toptoolbar-uc', 'css!../../css/component/home-footer.css', 'css!../../css/common/uc-basic.css','cookie'], function ($, checkLogin,hTem, fTem, sTem) {
    return function (callback) {
        var index = $('.hx-component-header').attr('activeNav');
        var header = $('.hx-component-header').replaceWith(hTem);
        var activeName=$('.xb-component-ucsider').attr('activeNav');
        $('.hx-nav-wrapper .link').eq(index).addClass('active');
        $('.hx-component-footer').replaceWith(fTem);
        $('.xb-component-ucsider').replaceWith(sTem);
        $('.uc-siderbar a[name='+activeName+']').addClass('active');
        //老版交互代码
        $(".changeMenu").each(function (i, v) {
            $(this).click(function () {
                $(".childMenu").hide().eq(i).show();
                $(".jian").hide().eq(i).show();
            });

        });


        //the seach menu

        $(".childMenu2 li span").each(function (i, v) {
            $(this).click(function () {
                var ob = $(".childMenu3").eq(i);
                ob.show();
                ob.find("li span").each(function (i, v) {
                    $(this).click(function () {
                        $(".changeMenu").eq(2).find("span.changeInner").html($(this).html());

                    })
                })
            });
        });


        $(".childMenu").each(function (i, v) {
            $(this).find("li span").each(function (z, vl) {
                $(this).click(function () {

                    $(".changeMenu").eq(i).find("span.changeInner").html($(this).html());
                    $(".childMenu").eq(i).hide();
                    $(".childMenu").eq(i + 1).show();
                    $(".jian").eq(i).hide();
                    $(".jian").eq(i + 1).show();
                });
            });
        });

        $(".childMenu3 li").click(function () {
            $(".childMenu3").hide()
        })
        $(".childMenu .zsyclose").each(function () {
            $(this).click(function () {
                $(".childMenu").hide();
                $(".jian").hide();
            })
        });

        $("#seachBtnn").click(function () {
            var lease_publish = $.trim($("#menu1").text());
            var goods_publish = $.trim($("#menu2").text());
            //var goods_level = $.trim($("#goods_level").val());
            var keyw = $.trim($("#keyw").val());

            if (lease_publish == "选择交易类型" && goods_publish == "选择类目") {
                confirm("请选择交易类型");
                return false;
            }
            if (lease_publish != "选择交易类型" && goods_publish == "选择类目") {
                confirm("请选择类目");
                return false;
            }
            if (lease_publish == "选择交易类型" && goods_publish != "选择类目") {
                confirm("请选择交易类型");
                return false;
            }
            if (keyw != "") {
                $("#keyws").val(encodeURIComponent(keyw));
            }
            if (keyw == "") {
                $("#keyws").val("");
            }
            $("#formMy").submit();
        });
        function setLogin(){
            $.when(checkLogin()).done(function(){
                $('#z-username').text($.cookie('userName'));
                $('#logged').show();
                $('#notLogged').hide();
            }).fail(function(){
                location.href ="http://www.xubei.com/login.htm";
            });
        };
        window.setLogin=setLogin;
        setLogin();
    };
});