/**
 * Created by Administrator on 2017/5/16.
 */
var config = {
    baseUrl: '../', //依赖相对路径
    paths: {	//如果某个前缀的依赖不是按照baseUrl拼接这么简单，需要在这里指出
        jquery: 'js/lib/jquery-1.9.1.min',
        template: 'js/lib/template',
        handlebars: 'js/lib/handlebars-v3.0.3',
        text: 'js/lib/text',  //用于requirejs导入html类型的依赖
        css: 'js/lib/text',  //用于requirejs导入html类型的依赖
        homeToll:'js/lib/home-tool',
        imgScroll:'js/lib/fullImgSroll',
        pager:'js/lib/hx-pager',
        layer:'js/lib/layer/layer',
        tools:'js/lib/tool',
        cookie:'js/lib/jquery.cookie.min',
        placeholders :'js/lib/placeholders',
        lazyLoad : 'js/lib/lazyLoad',
        showImg : 'js/lib/show',
        checkLogin : 'js/checkLogin',
        qrcode : 'js/lib/qrcode'
    },
    map: {
        '*': {
            'css': 'js/lib/css'
        }
    },
    shim: { //引入没有使用requirejs模块写法的类库。backbone依赖underscore
        'underscore': {
            exports: '_'
        },
        'jquery': {
            exports: '$'
        },
        'homeToll': {
            deps: ['jquery']
        },
        'imgScroll': {
            deps: ['jquery']
        },
        'pager': {
            deps: ['jquery']
        },
        'layer':{
            deps: ['jquery']
        },
        'tools':{
            deps: ['jquery']
        },
        'cookie':{
            deps: ['jquery']
        },
        'placeholders' : {
            deps : ['jquery']
        },
        'lazyLoad' : {
            deps : ['jquery']
        },
        'showImg' : {
            deps : ['jquery']
        },
        'qrcode' : {
            deps : ['jquery']
        }
        // 'CopyToClipboard' : {
        //     deps : ['jquery']
        // }
        /*,
         'backbone': {
         deps: ['underscore', 'jquery'],
         exports: 'Backbone'
         }*/

    },
    isquerying :false
};
require.config(config);
require(['js/renderUCsiderbar'],function(main){
    var callbackFun=function(){
        $('#to-top').on('click',function(e){
            $('html').animate({ scrollTop: '0px' }, 'easein');
            e.preventDefault();
        });//回到顶部
    }
    main(callbackFun);
});

