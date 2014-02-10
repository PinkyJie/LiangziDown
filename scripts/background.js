function getHostFromUrl(url) {
    var host;
    if(typeof url === 'undefined' || null === url) {
        url = window.location.href;
    }
    var regex = /.*\:\/\/([^\/]*).*/;
    var match = url.match(regex);
    if(typeof match !== 'undefined' && null !== match) {
        host = match[1];
    }
    return host;
}

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (getHostFromUrl(tab.url) === 'lz.taobao.com') {
        chrome.pageAction.show(tabId);
    }
});

var cookieData = {};
chrome.runtime.onMessage.addListener(function(request){
    if (request.type !== 'liang-zi-heng-dao') {
        return;
    }
    cookieData = request.cookie;
});
