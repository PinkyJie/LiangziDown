function loadOptions(options) {
    var fields = options['download_fields'],
        notifications = options['notifications'];
    for (var key in fields) {
        var ele = document.getElementById(key);
        ele.checked = fields[key];
    }
    document.getElementById('is_notify').checked = notifications['is_notify'];
    document.getElementById('notify_hour').value = notifications['notify_hour'] + '';
    document.getElementById('notify_minute').value = notifications['notify_minute'] + '';
}

function saveOptions() {
    var options = {};
    options['download_fields'] = {
        'day': document.getElementById('day').checked,
        'log_time': document.getElementById('log_time').checked,
        'ref_type': document.getElementById('ref_type').checked,
        'ref': document.getElementById('ref').checked,
        'title': document.getElementById('title').checked,
        'url': document.getElementById('url').checked,
        'ip': document.getElementById('ip').checked,
        'location_name': document.getElementById('location_name').checked,
        'uv_no': document.getElementById('uv_no').checked,
        'uv_return': document.getElementById('uv_return').checked,
        'uv': document.getElementById('uv').checked
    };
    options['notifications'] = {
        'is_notify': document.getElementById('is_notify').checked,
        'notify_hour': +document.getElementById('notify_hour').value,
        'notify_minute': +document.getElementById('notify_minute').value
    };
    chrome.extension.getBackgroundPage().options.set(options);
    showTip();
}

function showTip() {
    var tip = document.getElementById('alert');
    tip.style.display = 'block';
    setTimeout(function(){
        tip.style.display = 'none';
    }, 800);
}

function changeNotifySelect(value) {
    document.getElementById('notify_hour').disabled = value;
    document.getElementById('notify_minute').disabled = value;
}

document.addEventListener('DOMContentLoaded', function(){
    // load options from background page
    var options = chrome.extension.getBackgroundPage().options;
    loadOptions(options.get());
    var isNofityCheck = document.getElementById('is_notify');
    changeNotifySelect(!isNofityCheck.checked);
    isNofityCheck.addEventListener('change', function(){
        changeNotifySelect(!this.checked);
    });
    document.getElementById('save').addEventListener('click', function(){
        saveOptions();
    });
});
