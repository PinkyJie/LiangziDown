function getTimeStr() {
    var date = new Date();
    return [
        [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
        ].join(''),
        [
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        ].join('')
    ].join('-');
}

function genUrlFromCookie(cookie, count) {
    return 'http://api.linezing.com/?' + count + '&_s=' + cookie.lzsession;
}

function downloadStat(user, session) {
    var fileName = encodeURIComponent(user) + '-' + getTimeStr() + '.csv';
    var url = "https://liangzidang.sinaapp.com?file=" + fileName + '&token=' + session;
    window.open(url);
}

document.addEventListener('DOMContentLoaded', function () {
    var cookie = chrome.extension.getBackgroundPage().cookieData;
    var unloginDiv = document.getElementById('unlogin'),
        loginedDiv = document.getElementById('logined'),
        userSpan = document.getElementById('user'),
        tipSpan = document.getElementById('tip'),
        downloadBtn = document.getElementById('download');
    if (cookie.lzsession && cookie.lznick) {
        unloginDiv.style.display = 'none';
        loginedDiv.style.display = 'block';
        userSpan.textContent = decodeURI(cookie.lznick);
        if (cookie.lzcat === '3') {
            tipSpan.style.display = 'block';
            downloadBtn.style.display = 'none';
        } else {
            tipSpan.style.display = 'none';
            downloadBtn.style.display = 'inline';
            downloadBtn.addEventListener('click', function(){
                downloadStat(userSpan.textContent, cookie.lzsession);
            });
        }
    } else {
        unloginDiv.style.display = 'block';
        loginedDiv.style.display = 'none';
    }
});

