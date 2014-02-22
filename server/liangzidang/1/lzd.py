# -*- coding: utf-8 -*-

import json
import urllib
import collections

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

def gen_csv(data, fields):
    header_map = collections.OrderedDict([
        ('day', u'访问日期'),
        ('log_time', u'访问时间'),
        ('ref_type', u'入店来源'),
        ('ref', u'来源网址'),
        ('title', u'被访页面'),
        ('url', u'页面网址'),
        ('ip', u'访客IP'),
        ('location_name', u'访客位置'),
        ('uv_no', u'顾客跟踪'),
        ('uv_return', u'是否回头客'),
        ('uv', u'顾客UV')
    ])
    content = []
    if len(fields) == 0:
        fields = header_map.keys()
    header = [u'序号']
    for x in fields:
        header.append(header_map[x])
    content.append(u' ,'.join(header))
    content.append(u'\n')
    for i, res in enumerate(data):
        content.append(u'%d, ' % (i+1))
        for x in fields:
            if x == 'uv_no':
                content.append(u'%s%d, ' % (u'顾客', res[x]))
            elif x == 'uv_return':
                content.append(u'%s, ' % (u'回访' if res[x] == 1 else u'新'))
            elif x == 'uv':
                content.append(res[x])
            else:
                content.append(u'%s, ' % res[x])
        content.append('\n')
    return u''.join(content)

@app.route('/', methods=['GET'])
def root():
    if 'file' not in request.args or 'token' not in request.args:
        return u'非法访问'
    file_name = request.args.get('file')
    token = request.args.get('token')
    data = get_data(token)
    fields = []
    if 'fields' in request.args:
        fields = request.args.get('fields').split(',')
    content = gen_csv(data, fields)
    response = make_response(content.encode('gbk'))
    response.headers['Content-type'] = 'text/csv'
    response.headers['Content-Disposition'] = "attachment;filename=" + urllib.quote(file_name.encode('utf-8'))
    return response

if __name__ == '__main__':
    app.run()
