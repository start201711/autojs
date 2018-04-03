# 使用说明
> * 蚂蚁森林自动收能量脚本
> * 蚂蚁庄园自动投食、驱赶脚本
## 自动收能量脚本
1. 下载全部文件
2. 自己截图，制作take.png文件，
3. 在config.js文件里面配置解锁密码
4. 在edge里面设置执行shell，设置定时任务
```
    fp="你的蚂蚁森林.js全路径"
    am start -n com.stardust.scriptdroid/.external.open.RunIntentActivity -d file://${fp} -t application/x-javascript
```


##蚂蚁庄园脚本
1. 配置几个坐标
2. 定时执行。。。。

#### 非常感谢龙泽一郎大佬做的解锁模块！让我们不再需要繁琐的解决解锁问题