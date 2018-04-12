# 使用说明
### 脚本内容
> *  蚂蚁森林自动收能量脚本
> *  蚂蚁庄园自动投食、驱赶脚本
#### 设备要求：
android 7.0+或者已root的5.0+，
由于使用需要exposed edge定时任务，实际要求相当于已root 5.0+
### 支付宝版本10.1.15.463（就是图标带有福到-年到那个）10.1.18版本之后应该是不支持的
### 目前应该是没卵用了，就当参考吧
### 自动收能量脚本
1. 下载全部文件
2. 安装[autojs](https://www.coolapk.com/apk/com.stardust.scriptdroid)、[exposed edge](https://play.google.com/store/apps/details?id=com.jozein.xedgepro)等软件
2. 自己截收取好友能量的小手的图片，重命名为take.png放入当前目录下
![小手图片](https://github.com/start201711/autojs/blob/master/201804/take.png)
3. 在config.js文件里面配置解锁密码
4. 在exposed edge里面使用shell执行命令，设置多个定时任务
```
    fp="你的`蚂蚁森林.js`全路径"
    am start -n com.stardust.scriptdroid/.external.open.RunIntentActivity -d file://${fp} -t application/x-javascript
```
**注意有的exposed edge版本不支持中文路径那就改成英文路径
或者像我那样，再新写一个start.js（非中文路径下），里面写上下面的代码，
edge shell命令执行start.js，实现伪支持中文路径**
```ecmascript 6
engines.execScriptFile("/sdcard/脚本/蚂蚁森林/蚂蚁森林.js");
```

5. 如果会使用tasker，把next函数里面的shell发送广播命令取消注释，
然后在tasker里面添加收到广播事件，循环执行脚本
![image](https://github.com/start201711/autojs/blob/master/201804/ScreenShot/Screenshot_2018-04-03-19-55-21.jpg)

### 蚂蚁庄园脚本
1. 配置几个固定的点击坐标
2. 定时执行。。。
3. 使用tasker最好，exposed edge 不太适合

## 非常感谢`龙泽一郎`大佬做的解锁模块！解决了繁琐的解锁问题


##### 更新日志

- [x] 添加重试功能
- [x] 去掉不必要的root权限检测，自动开启无障碍服务
- [x] 增加SingleScript模块，限制同一时间只能运行一个脚本
- [x] 优化查找能量球的方法，添加能量统计功能
- [x] 如果自己的能量球还剩下1-2分钟，脚本会停留在当前界面，不断点击能量球，直到能量球消失为止
- [ ] 目前captureScreen有可能返回为null，导致异常，期待autojs开发者的修复。
#### 一切都在慢慢完善中……
