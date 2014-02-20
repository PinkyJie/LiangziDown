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

// alarm at specific time every day
function createEverydayAlarm() {
    var notifyHour = 23, notifyMin = 50;
    var now = new Date();
    var diff;
    var nowMinutes = now.getHours() * 60 + now.getMinutes();
    var alarmMinutes = notifyHour * 60 + notifyMin;
    // if time pass specific time, alarm next day
    if (nowMinutes > alarmMinutes) {
        diff = 24 * 60 - (nowMinutes - alarmMinutes);
    } else {
        diff = alarmMinutes - nowMinutes;
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
    var opt = {
        type: 'basic',
        title: chrome.i18n.getMessage('appNotifyTitle'),
        message: chrome.i18n.getMessage('appNotifyBody'),
        iconUrl: 'images/icon-128.png'
    };
    chrome.notifications.create('2350notification', opt, function(notification){});
}

chrome.notifications.onClicked.addListener(function(notification){
    if (notification === '2350notification') {
        window.open('http://lz.taobao.com');
    }
});


