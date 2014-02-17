# -*- coding: utf-8 -*-

import json
import urllib

from flask import (Flask, request, make_response)

app = Flask(__name__)
app.debug = True

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

def gen_csv(data):
    content = []
    content.append(u'序号, 访问日期, 访问时间, 入店来源, 来源网址, 被访页面, 页面网址, 访客IP, 访客位置, 顾客跟踪, 是否回头客, 顾客UV')
    content.append(u'\n')
    for i, res in enumerate(data):
        content.append(u'%d, ' % (i+1))
        content.append(u'%s, ' % res['day'])
        content.append(u'%s, ' % res['log_time'])
        content.append(u'%s, ' % res['ref_type'])
        content.append(u'%s, ' % res['ref'])
        content.append(u'%s, ' % res['title'])
        content.append(u'%s, ' % res['url'])
        content.append(u'%s, ' % res['ip'])
        content.append(u'%s, ' % res['location_name'])
        content.append(u'%s%d, ' % (u'顾客', res['uv_no']))
        content.append(u'%s, ' % (u'回访' if res['uv_return'] == 1 else u'新'))
        content.append(res['uv'])
        content.append('\n')
    return u''.join(content)

@app.route('/', methods=['GET'])
def root():
    if 'file' not in request.args or 'token' not in request.args:
        return u'非法访问'
    file_name = request.args.get('file')
    token = request.args.get('token')
    data = get_data(token)
    content = gen_csv(data)
    response = make_response(content.encode('gbk'))
    response.headers['Content-type'] = 'text/csv'
    response.headers['Content-Disposition'] = "attachment;filename=" + urllib.quote(file_name.encode('utf-8'))
    return response

if __name__ == '__main__':
    app.run()
