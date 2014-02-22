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

function genDefaultOptions() {
    if (typeof window.localStorage['options'] === 'undefined') {
        var options = {};
        options['download_fields'] = {
            'day': true,
            'log_time': true,
            'ref_type': true,
            'ref': true,
            'title': true,
            'url': true,
            'ip': true,
            'location_name': true,
            'uv_no': true,
            'uv_return': true,
            'uv': true
        };
        options['notifications'] = {
            'is_notify': true,
            'notify_hour': 23,
            'notify_minute': 50
        };
        window.localStorage['options'] = JSON.stringify(options);
    }
}

genDefaultOptions();

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
function createAlarmAt(notifyHour, notifyMin) {
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
    chrome.alarms.create('download-alarm', {
        delayInMinutes: diff
    });
}

chrome.alarms.onAlarm.addListener(function(alarm){
    if (alarm.name !== 'download-alarm') {
        return;
    }
    // open notification
    fireNotification();
    // next day
    console.log('alarm after 24 hours');
    chrome.alarms.clear('download-alarm');
    chrome.alarms.create('download-alarm', {
        delayInMinutes: 24 * 60
    });
});

// notification for download
function fireNotification() {
    var opt = {
        type: 'basic',
        title: chrome.i18n.getMessage('appNotifyTitle'),
        message: chrome.i18n.getMessage('appNotifyBody'),
        iconUrl: 'images/icon-128.png'
    };
    chrome.notifications.create('download-notification', opt, function(notification){});
}

chrome.notifications.onClicked.addListener(function(notification){
    if (notification === 'download-notification') {
        window.open('http://lz.taobao.com');
    }
});

// create alarm
var options = {
    'get': function() {
        return JSON.parse(window.localStorage['options']);
    },
    'set': function(options) {
        window.localStorage['options'] = JSON.stringify(options);
    }
};
var notifications = options.get().notifications;
if (notifications.is_notify) {
    chrome.alarms.clear('download-alarm');
    createAlarmAt(notifications.notify_hour, notifications.notify_minute);
}


