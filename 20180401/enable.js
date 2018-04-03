module.exports = function() {
    try {
        let enabled = shell("settings get secure enabled_accessibility_services", true).result.replace(/\n/, "");
        if (enabled.indexOf("stardust") < 0) {
            let stardust = "com.stardust.scriptdroid/com.stardust.scriptdroid.accessibility.AccessibilityService";
            let ret = shell("settings put secure enabled_accessibility_services " + enabled + ":" + stardust, true);
            if (ret.code) {
                throw new java.lang.Exception();
            } else {
                log("检测到无障碍服务被关闭，\n现在已使用脚本强行开启");
            }
        }
        shell("settings put secure accessibility_enabled 1", true);
    } catch (e) {
        toastLog("尝试开启无障碍服务异常");
    }
};