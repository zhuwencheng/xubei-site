/**
 * Created by Administrator on 2016/6/30.
 */
(function ($){
    var ScrollImg=function(dom,options){
        this.$dom=$(dom);
        this.init(options);
    };
    ScrollImg.prototype={
        constructor: ScrollImg,
        index:0,
        clearId:null,
        defaults:{
            time:3000,
            showTool:true
        },
        init:function(options){
            var that=this;
            $.extend(that,that.defaults,options);
            that.scrollWidth=this.$dom.width();
            that.renderHtml().initEvents();
            return that;
        },
        renderHtml:function(){
            var that = this;
            var a = that.$dom.find('a');
            that.count = a.length;
            var liHtml = '';
            $.each(a, function (i, item) {
                liHtml += '<li></li>';
            });
            if (that.count > 1) {
                that.$dom.append('<ul class="control-nav">' + liHtml + '</div>');
                var controlNav = that.$dom.find('.control-nav');
                controlNav.css({ marginLeft: -controlNav.width()/2 });
                controlNav.find('li').eq(0).addClass('active');
                that.clearId = window.setTimeout(function () { that._toIndex(1) }, that.time);
            }
            return that;
        },
        initEvents:function(){
            var that = this;
            that.$dom.on('click', '.control-nav li', function () {
                var index = $(this).index();
                that.$dom.find('.scroll-wrapper').stop();
                window.clearTimeout(that.clearId);
                that._toIndex(index);
            });
            return that;
        },
        _toIndex:function(index){
            //console.log(index);
            var that=this;
            $.when( that.$dom.find('.scroll-wrapper').animate({ marginLeft:-that.scrollWidth*index }, 'easein' ) ).then( function(){
                that.index=index;
                that.$dom.find('.control-nav li').removeClass('active').eq(index).addClass('active');

            });
            that.clearId=window.setTimeout(function(){
                if(index+1>=that.count){
                    that._toIndex(0);
                }else{
                    that._toIndex(index+1);
                }
            },that.time);
            return that;
        }
    }
    $.fn.scrollImg = function (options) {
        return this.each(function (key, value) {
            var element = $(this);
            var nivoslider = new ScrollImg(this, options);
        });
    };
})(jQuery);