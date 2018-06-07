require(['jquery','tools'], function ($) {
    var goodsid = $.getQueryString("goodsid");
    var sign_seller = $.getQueryString("sign_seller");
    var isEdit = $.getQueryString("edit");
    if (isEdit=="1"){
        $('.success strong').html('修改成功啦！')
    }
    var publish={
        init:function(){
            this.modifyDom();
            this.share();
        },
        share:function(){
            window._bd_share_config = {
                "common": {
                    bdText: "发布成功啦~",
                    bdDesc: "我在虚贝等你开黑哦！！！",
                    bdUrl: 'http://www.xubei.com',
                },
                share: [{
                    "bdSize": 24
                }]
            }
            with (document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5)];
        },
        modifyDom:function(){
            if (sign_seller=="1"){
                $('.isSign').show();
                $('#goodsDetail').attr('href', 'http://new.xubei.com/goods_details_xa.html?goodsId='+ goodsid)
            }else{
                $('.isSign').hide();
                $('#goodsDetail').hide();
            }
            
            
        }
    }
    publish.init();
})     