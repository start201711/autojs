/**
 * 欢迎使用和提交bug反馈
 * 设备要求：
 * 1.需要root（脚本用到唤醒、截图、点击等权限）
 * 2.安卓5.0以上
 * 3.Auto.js软件版本3.0以上
 *
 * 使用方法：
 * 1.将take.png（找图所需，仅适用于1920*1080屏幕。其它机型请自己制作截图，图片应略小于小手范围，10KB以下）、
 *   config.js（配置文件）、Robot.js（机器人模块）、Secure.js（解锁模块，可选）、蚂蚁森林设置向导.js 与脚本放置于同目录下，一般为/storage/emulated/0/脚本/
 * 2.将“蚂蚁森林”按钮设置在支付宝首页，方便查找控件
 * 3.运行蚂蚁森林设置向导.js，修改个性化配置。支持的解锁方式（仅限类原生系统，如LineageOS、Mokee）：滑动（5.0+）、PIN码（5.0+）、密码（5.0+）、
 *   图案（7.0+，将点转换为数字即可，布局参考9宫格数字键盘）
 * 4.直接在软件里面运行脚本即可，不用手动打开支付宝。建议先手动运行一次，成功之后再配置定时任务
 * 5.申请截图的权限时，不需要手动点击"立即开始"，脚本会自行点击"立即开始"
 * 6.脚本运行时，可以按音量上键停止运行
 *
 * 定时任务（建议）步骤：
 * 1.安装edge pro软件
 * 2.添加多重动作，假设命名为蚂蚁森林。假设脚本路径是/storage/emulated/0/脚本/蚂蚁森林.js
 *   动作的第一步是唤醒，第二步是shell命令，参考
 *   am start -n com.stardust.scriptdroid/.external.open.RunIntentActivity -d file:///storage/emulated/0/脚本/蚂蚁森林.js -t application/x-javascript
 * 3.添加定时计划，动作是保存的多重动作
 * 4.若该机型不能正常解锁，可以使用edge录制手势解决，建议步骤：1.唤醒 2.延时 3.注入手势 4.延时 5.shell命令
 * 5.定时收自己的能量可以适当提前，有剩余能量球的时候，脚本会持续检测（默认1分钟）
 *
 * 软件测试结果：
 * 1.魔趣7.1系统正常，偶尔出现崩溃情况，依赖于Auto.js.apk稳定性
 * @author ridersam <e1399579@gmail.com>
 */

//sleep(3000);
auto(); // 自动打开无障碍服务

let options = require("./config.js");

// 所有操作都是竖屏

//start(options);

/**
 * 开始运行
 * @param options
 */
function start(options) {
    let isScreenOn = device.isScreenOn(); // 屏幕是否点亮
    if (!isScreenOn) {
        log("唤醒");
        device.wakeUp();
        sleep(500);
    }
    this.checkModule();

    let Robot = require("./Robot.js");
    let robot = new Robot(options.max_retry_times);


    let Secure = require("./Secure.js");
    let secure = new Secure(robot, options.max_retry_times);
    secure.openLock(options.password, options.pattern_size);
}

/**
 * 检查必要模块
 */
function checkModule() {
    if (!files.exists("Robot.js")) {
        throw new Error("缺少Robot.js文件，请核对第一条");
    }

    if (!files.exists("Secure.js") && context.getSystemService(context.KEYGUARD_SERVICE).inKeyguardRestrictedInputMode()) {
        throw new Error("缺少Secure.js文件，请核对第一条");
    }
}

module.exports = function() {

    sleep(3000);
    start(options);
};