const pkg = "com.eg.android.AlipayGphone";
const max_try_count = 5; //最大尝试次数
const max_run_time = 100 * 1000; //脚本运行最长时间
let single = require("SingleScript");
single.enqueue();
let enable = require("enable");
let unlock = require("unlock");
enable();
unlock();

let Script = require("Script");
let script = new Script();

main();
exit();


function main() {
    prepare();
    doSth();
}

function prepare() {
    events.observeKey();
    events.onceKeyDown("volume_up", function () {
        toastLog("脚本停止运行");
        exit();
    });
    toastLog("即将进行驱赶任务，请勿操作");
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
}

function doSth() {

    threads.start(function () {
        let btn = classNameContains("Button").textContains("立即开始").findOne(8 * 1000);
        btn ? btn.click() : false;
    });


    if (!requestScreenCapture()) {
        toast("请求截图失败，脚本退出");
        exit();
    }
    //这里需要设置偷吃东西的两只鸡的位置
    for (let i = 0; i < 10; i++) {
        script.press(218, 851, 100);
        sleep(500);
        script.press(518, 851, 100);
        sleep(500);
    }
    sleep(3000);
    shell("am force-stop " + pkg, true);
    toastLog("本轮完毕！");
    sleep(3000);
    exit();

}


function into() {
    let w = id("com.alipay.android.phone.openplatform:id/app_text").text("蚂蚁庄园").findOne(8000);
    return w && w.parent() && w.parent().click() && desc("星星球").findOne(20 * 1000);
}