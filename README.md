LiangziDown（量子党）
===========

Chrome插件，用于批量下载淘宝量子恒道的实时来访数据。

###缘起

![](https://raw2.github.com/PinkyJie/LiangziDown/master/screenshots/1.PNG)

淘宝卖家通常都会使用[量子恒道](http://lz.taobao.com)来查看店铺的访问情况，其中有一项统计数据为“实时客户访问”用于了解店铺的实时访问情况非常方便。但由于量子恒道官方的限制，只能查看当天的数据，并且不能批量下载保存。本插件可以批量下载当天的来访数据并保存为CSV格式。

###安装

插件已经在Chrome Web Store发布，点击[这里](https://chrome.google.com/webstore/detail/%E9%87%8F%E5%AD%90%E5%85%9A/dkdgdjlebbekbmboilieclmigakdbjld?hl=zh-CN)安装

当然，也可以手动安装：

1. 确保你使用Chrome浏览器
2. [下载本项目](https://github.com/PinkyJie/LiangziDown/archive/master.zip)并解压
3. 使用Chrome打开`chrome://extensions/`, 即扩展管理页面
4. 勾选上“开发者模式”，然后点击“加载正在开发的扩展程序”按钮，选择解压后的文件夹即可

![](https://raw2.github.com/PinkyJie/LiangziDown/master/screenshots/0.PNG)

如上图插件的解压路径为`E:\WorkSpace\LiangziDown`

###使用

* 打开[量子恒道首页](http://lz.taobao.com)，即可看到地址栏最右边的插件图标，未登录情况下点开图标将出现登录提示

![](https://raw2.github.com/PinkyJie/LiangziDown/master/screenshots/2.PNG)

* 登录成功后再次点击图标，将显示您的淘宝用户名以及下载按钮

![](https://raw2.github.com/PinkyJie/LiangziDown/master/screenshots/3.PNG)

* 点击下载按钮，Chrome将打开新tab页进行下载，文件类型为CSV，可用Excel打开，默认文件名称为`淘宝用户名-年月日-时分秒`（未来将可配置）

![](https://raw2.github.com/PinkyJie/LiangziDown/master/screenshots/4.PNG)

* 使用Excel打开文件即可看到实时访客数据，字段涵盖网页上所有字段（未来将可配置）

![](https://raw2.github.com/PinkyJie/LiangziDown/master/screenshots/5.PNG)

* (new!)由于每天的12点量子恒道将清空当天的统计数据，故每天23:50将弹出通知，提醒下载

![](https://raw2.github.com/PinkyJie/LiangziDown/master/screenshots/6.PNG)

###后台

插件的后台代码在`server`目录下，目前托管在SAE上
