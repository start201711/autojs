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
    toastLog("即将收进行投食任务，请勿操作\n按音量上键键停止脚本");
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
    for (let i = 0; i < 2; i++) {
        //这里需要设置投食按钮的位置
        script.press(595, 1150, 20);
        sleep(50);
    }
    log("投食完毕");
    sleep(3000);
    shell("am force-stop " + pkg, true);
    toastLog("本轮完毕！");
    sleep(3000);
}


function into() {
    let w = id("com.alipay.android.phone.openplatform:id/app_text").text("蚂蚁庄园").findOne(8000);
    return w && w.parent() && w.parent().click() && desc("星星球").findOne(20 * 1000);
}