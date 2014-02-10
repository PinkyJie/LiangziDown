function processCookie(cookieStr) {
    if (cookieStr.length === 0) {
        return {};
    }
    var cookie = {};
    var cookies = cookieStr.split('; ');
    cookies.forEach(function(c){
        var arr = c.split('=');
        var key = arr[0];
        var value = decodeURIComponent(arr[1]);
        cookie[key] = value;
    });
    return cookie;
}

chrome.runtime.sendMessage({
    type: 'liang-zi-heng-dao',
    cookie: processCookie(document.cookie)
});
