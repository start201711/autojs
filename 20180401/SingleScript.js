/*
 * 说明：模块用于确保多个脚本同时执行时，能
 * 够确保这些脚本按照先后顺序、一个个排队执行，
 * 类似单一线程池功能
 * 
 * 方法：确保jar文件和此模块在同一个目录，
 * 在自己的需要确保单任务的脚本开头，
 * 调用加载此模块，并且调用enqueue方法即可
 * var single=quire("SingleScript");
 * single.enqueue();
 *
 * By 酷安@群主让我注册
 * 使用时请保留此注释
 */
importClass(java.io.File);
importClass(java.lang.ClassLoader);
importClass(java.lang.Class);
importClass(com.stardust.autojs.rhino.AndroidClassLoader);
let parent = context.getClassLoader();
let engine = engines.myEngine();
let clz = Class.forName("com.stardust.autojs.engine.ScriptEngine", true, parent);
let cls;
try {
    cls = Class.forName("com.stardust.TaskQueue", true, parent);
} catch (e) {
    let loader = new AndroidClassLoader(parent, new File(context.getCacheDir(), "jar"));
    let path = files.path("./SingleScript.jar");
    log(path);
    loader.loadJar(new File(path));
    cls = loader.loadClass("com.stardust.TaskQueue");
}

let _register = cls.getMethod("register", clz);
let _unregister = cls.getMethod("unregister", clz);
let _taskCount = cls.getMethod("getTaskCount");
let str = engine + "";
str = str.substring(str.lastIndexOf("@"));
let SingleScript = {};

SingleScript.enqueue = function (b) {
    let n = this.size();
    if (n !== 0) {
        log(str + "前面还有" + n + "个任务，排队中");
    }
    _register.invoke(null, engine);
    log(str + "\t任务执行中");
    if (b !== true) {
        events.on("exit", function () {
            SingleScript.dequeue();
        });
    }
};
SingleScript.dequeue = function () {
    _unregister.invoke(null, engine);
    log(str + "\t出队");
};
SingleScript.size = function () {
    return _taskCount.invoke(null);
};

module.exports = SingleScript;