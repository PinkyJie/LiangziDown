chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

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

// show icon only on lz.taobao.com
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (getHostFromUrl(tab.url) === 'lz.taobao.com') {
        chrome.pageAction.show(tabId);
    }
});

// get cookie from content script
var cookieData = {};
chrome.runtime.onMessage.addListener(function(request){
    if (request.type !== 'liang-zi-heng-dao') {
        return;
    }
    cookieData = request.cookie;
});

// alarm at 23:50 every day
function createEverydayAlarm() {
    var now = new Date();
    var diff;
    // if time pass 23:50, alarm next day
    if (now.getHours() == 23 && now.getMinutes() > 50) {
        diff = 24 * 60 - now.getMinutes() - 50;
    } else {
        diff = 23 * 60 + 50 - now.getHours() * 60 - now.getMinutes();
    }
    // create alarm
    console.log('alarm after ' + diff + ' mins');
    chrome.alarms.create('2350alarm', {
        delayInMinutes: diff
    });
}

chrome.alarms.onAlarm.addListener(function(alarm){
    if (alarm.name !== '2350alarm') {
        return;
    }
    fireNotification();
});

chrome.alarms.clear('2350alarm');
createEverydayAlarm();

// notification for download
function fireNotification() {

}
