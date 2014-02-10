# coding=utf-8

import os
import json
import datetime
import urllib

from flask import (Flask, request, make_response)

application = app = Flask(__name__)

def get_data(token):
    base_url = 'http://api.linezing.com/'
    api_url = '=/view/recent/~/~'
    user_token = token

    req1 = urllib.urlopen(base_url+api_url+'?limit=1&offset=0&_s='+user_token)
    res1 = req1.read()
    res1_json = json.loads(res1)
    limit = res1_json[0]['cnt']

    req2 = urllib.urlopen(base_url+api_url+'?limit='+str(limit)+'&offset=0&_s='+user_token)
    res2 = req2.read()
    res2_json = json.loads(res2)
    return res2_json[1]

def gen_csv(user, data):
    content = []
    content.append('序号, 访问日期, 访问时间, 入店来源, 来源网址, 被访页面, 页面网址, 访客IP, 访客位置, 顾客跟踪, 是否回头客, 顾客UV')
    content.append()('\n')
    for i, res in enumerate(data):
        content.append(str(i+1)+', ')
        content.append(res['day'].encode('utf8')+', ')
        content.append(res['log_time'].encode('utf8')+', ')
        content.append(res['ref_type'].encode('utf8')+', ')
        content.append(res['ref'].encode('utf8')+', ')
        content.append(res['title'].encode('utf8')+', ')
        content.append(res['url'].encode('utf8')+', ')
        content.append(res['ip'].encode('utf8')+', ')
        content.append(res['location_name'].encode('utf8')+', ')
        content.append('顾客'+str(res['uv_no'])+', ')
        content.append(('回访' if res['uv_return'] == 1 else '新')+', ')
        content.append(res['uv'])
        content.append('\n')
    return content

@app.route('/', methods=['POST'])
def root():
    if 'user' not in request.form or 'token' not in request.form:
        return 403
    user = request.form['user']
    token = request.form['token']
    data = get_data(token)
    cur_time = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    file_name = "%s-%s" % (user, cur_time)
    response = make_response(data)
    response.headers['Content-type'] = 'text/csv'
    response.headers['Content-Disposition'] = "attachment;filename=" + file_name
    return response

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
