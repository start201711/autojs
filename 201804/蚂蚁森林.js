const pkg = "com.eg.android.AlipayGphone";
const max_try_count = 5; //最大尝试次数
const max_run_time = 200 * 1000; //脚本运行最长时间
let single = require("SingleScript");
single.enqueue();

let enable = require("enable");
let unlock = require("unlock");
enable();
unlock();


const _path = "take.png";
if (!files.exists(_path)) {
    throw new java.lang.Exception("小手图片不存在");
}
const temp = images.read(_path);
let Script = require("Script");
let script = new Script();
let save = require("SaveXml");
main();
exit();

function main() {
    events.observeKey();
    events.onceKeyDown("volume_up", function () {
        toastLog("脚本停止运行");
        exit();
    });
    events.on("exit", function () {
       // KeyCode(26);//脚本退出时息屏，如果有此需要，请取消注释
    });
    toastLog("即将收取蚂蚁森林能量，请勿操作\n按音量上键停止脚本");
    shell("pm enable " + pkg, true);
    threads.start(function () {
        if (max_run_time <= 0) {
            return;
        }
        let run_time = 0;
        while (run_time++ < max_run_time) {
            sleep(1000);
        }
        exit();
    });

    let tryCount = 0;
    while (tryCount++ < max_try_count) {
        launch(pkg);
        if (into()) {
            break;
        } else {
            shell("am force-stop " + pkg, true);
            sleep(2000);
        }
    }

    if (tryCount >= max_try_count) {
        log("已尝试" + tryCount + "次，不再重试");
        exit();
    }

    toastLog("成功进入蚂蚁森林");
    takeMyself();
    toastLog("开始收取好友能量");
    threads.start(function () {
        let btn = classNameContains("Button").textMatches("立即开始|START NOW").findOne(10 * 1000);
        btn ? btn.click() : false;
    });
    if (!requestScreenCapture()) {
        exit();
    }
    takeOthers();
    while (!idContains("J_rank_list_more").click()) ;
    if (idContains("J_rank_list_self").findOne(10 * 1000)) {
        toastLog("开始收取更多好友的能量");
        takeOthers();
        next();
    } else {
        log("进入更多好友失败");
    }
    desc("返回").click();
    sleep(500);
    desc("返回").click();
    toastLog("收取能量结束");
}

function takeOthers() {
    while (1) {
        let p;
        while (p = findImage(captureScreen(), temp)) {
            script.press(device.width / 2, p.y + 0.8 * temp.getHeight());
            try {
                takeOther();
            } catch (e) {
                log(e);
            }
            idContains("h5_tv_nav_back").click();
            sleep(1000);
        }
        let end = idContains("J_rank_list_more").find();
        if (!end.empty() && end.get(0).bounds().top < device.height) {
            break;
        }
        scrollable(true).className("android.webkit.WebView").scrollForward();
        sleep(2000);
    }
}


function takeOther() {
    desc("浇水").findOne(5000);
    let cover = descMatches(/\d{2}:\d{2}:\d{2}/).find();
    if (!cover.empty()) {
        log("保护罩还剩" + cover.get(0).desc() + "，忽略");
        return;
    }
    let start = getEnergy();
    take();
    sleep(1200);
    let end = getEnergy();
    let title = idContains("h5_tv_title").findOne(2000);
    title = title ? title.text() : null;
    log("收取了" + title + (end - start) + "g能量")
}

function takeMyself() {
    desc("浇水").findOne(5000);
    let start = idContains("tree_energy").findOne(2000);
    take();
    let selector = descMatches("还剩\n?00:0[12]");
    let wait;
    let m;
    while (m = selector.findOne(500)) {
        log(m.bounds());
        script.pressCenter(m);
        wait = true;
    }
    if (wait) {
        take();
    }
    sleep(500);
    let end = idContains("tree_energy").findOne(2000);
    try {
        let ei = parseInt(end.desc().match(/\d+/)[0]);
        let si = parseInt(start.desc().match(/\d+/)[0]);
        log("收取了自己" + (ei - si) + "g能量");
    } catch (e) {
        log(e);
    }
}

function getEnergy() {
    try {
        let sl = descMatches(/\d+g/)
            .filter(function (o) {
                return o.bounds().centerX() > device.width / 2;
            });
        let a = idContains("J_friend_pk_wrap")
            .findOne(5000)
            .findOne(sl);
        return parseInt(a.desc().match(/\d+/)[0]);
    } catch (e) {
        log(e);
        return NaN;
    }
}

function take() {
    let c = idContains("J_bubbles_wrap")
        .findOne(5000)
        .find(descMatches("绿色\n?能量|\\d+g"));
    toastLog("找到" + c.size() + "个能量球");
    c.each(function (o) {
        script.pressCenter(o);
        sleep(500);
    });
}

function into() {
    let w = id("com.alipay.android.phone.openplatform:id/app_text").text("蚂蚁森林").findOne(8000);
    return w && w.parent() && w.parent().click() && idContains("tree_energy").findOne(20 * 1000);
}

function next() {
    let time = new Date().getHours();
    let min = 60;
    if (time > 6) {
        let d = descMatches(/\d+’/).find();
        d.each(function (o) {
            let value = parseInt(o.desc().match(/\d+/)[0]);
            min = Math.min(min, value);
        });
        log("距离下一次收取还有" + min + "分钟");
        //shell("am broadcast -function.js autojs.next.time --es next " + min, true);
    }
    return min;
}