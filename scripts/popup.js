function genFileName() {
    var date = new Date();
    return [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDay(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    ].join('-');
}

function genUrlFromCookie(cookie, count) {
    return 'http://api.linezing.com/?' + count + '&_s=' + cookie.lzsession;
}

function downloadStat(cookie) {
    alert('test!');
}

document.addEventListener('DOMContentLoaded', function () {
    var cookie = chrome.extension.getBackgroundPage().cookieData;
    var unloginDiv = document.querySelector('#unlogin'),
        loginedDiv = document.querySelector('#logined'),
        userSpan = document.querySelector('#user'),
        downloadBtn = document.querySelector('#download');
    if (cookie.lzsession && cookie.lznick) {
        unloginDiv.style.display = 'none';
        loginedDiv.style.display = 'block';
        userSpan.textContent = cookie.lznick;
        downloadBtn.addEventListener('click', function(){
            downloadStat(cookie);
        });
    } else {
        unloginDiv.style.display = 'block';
        loginedDiv.style.display = 'none';
    }
});

