/**
 * Created by Administrator on 2017/5/16.
 */
var config = {
    //baseUrl: '../', //依赖相对路径
    baseUrl: '//new.xubei.com/', //依赖相对路径
    waitSeconds:0,
    paths: {	//如果某个前缀的依赖不是按照baseUrl拼接这么简单，需要在这里指出
        jquery: 'js/lib/jquery-1.9.1.min',
        template: 'js/lib/template',
        text: 'js/lib/text',  //用于requirejs导入html类型的依赖
        css: 'js/lib/text',  //用于requirejs导入html类型的依赖
        homeToll:'js/lib/home-tool',
        imgScroll:'js/lib/scrollImg',
        pager:'js/lib/xb-pager',
        layer:'js/lib/layer/layer',
        tools:'js/lib/tool',
        cookie:'js/lib/jquery.cookie.min',
        placeholders :'js/lib/placeholders',
        lazyLoad : 'js/lib/lazyLoad',
        showImg : 'js/lib/show',
        WebUploader:'js/lib/webuploader.min',
        validate:'js/lib/jquery.validate',
        // localization:'js/lib/localization/messages_zh',
        qrcode:'js/lib/qrcode',
        copy:'js/lib/copy',
        registLayer:'js/registLayer',
        loginLayer:'js/loginLayer',
        checkLogin : 'js/checkLogin',
        forgetpw:'js/forgetpw',
        xuzu:'js/xuzu'
    },
    map: {
        '*': {
            'css': 'js/lib/css',
            'text': 'js/lib/text'
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
        'validate' : {
            deps : ['jquery']
        },
        'localization' : {
            deps : ['jquery','validate']
        },
        'WebUploader': {
            deps: ['jquery']
        },
        'registLayer':{
            deps: ['jquery']
        },
        'loginLayer': {
            deps: ['jquery']
        }
    },
    isquerying :false
};
require.config(config);
require(['js/renderHomeComponent'],function(main){
    main();
});

