define(['jquery', 'cookie','tools'], function ($) {
    var channel = $.getQueryString("channel");
    if (channel){
        $.cookie('channel', channel, { path: '/', domain: 'xubei.com' });
    };
    function checkLogin() {
        var deferred = $.Deferred();//延迟方法
        if ($.cookie('loginToken') == null) {
            deferred.reject();
        } else {
            $.ajax({
                url: BASE_URL.user + 'businessUser/checkLogin',
                data: {
                    "userId": $.cookie('loginToken')
                },
                dataType: "jsonp",
                success: function (data) {
                    if (data.code === "1") {
                        $.cookie('userName', data.result.user_name, { path: '/', domain: 'xubei.com' });
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                }

            });
        };
        return deferred;
    };


    window.checkLogin = checkLogin;
    return checkLogin;
});