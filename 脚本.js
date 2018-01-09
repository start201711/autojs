//转载请注明来自酷安用户@群主让我注册 
//根据此代码修改，请注明根据酷安@群主让我注册 修改
//使用方法：
//1.准备工作：需要两个小图片
//（a）好友的列表右上角的绿色的小图标，命名为take.png
//（b）好友列表最下方的爱心捐献图标，命名为end.png
//这两个图片放在sdcard根目录下
//2.设置为定时脚本，一般早上7：40差不多了把
//3.如果不会写解锁屏幕代码，请勿设置手机锁屏密码；如果会，请自行编写解锁模块的代码（最后有示例）
//4.申请截图时不需要点击立即开始（可能我是5.1的原因，因为系统是5.1，不能设置不再显示，否则直接崩）
//5.这里内置两种捕获能量球的方式，可以互换使用。
//6.由于我只有5.1系统的手机，我也不知道在不同版本的手机的click和swipe函数效果如何，这个碰上了再解决吧。
//最后修改于：2018/1/9 18：35
//
var ismyself = false;
if (ismyself) {
	var unlock = require("unlock"); //解锁模块
	unlock();
} else {
	device.wakeUpIfNeeded(); //这种方式请勿设置锁屏密码
}
if (ismyself) {
	shell("pm enable com.eg.android.AlipayGphone", true);
}
sleep(3000);
var temp = images.read("sdcard/take.png");
var end = images.read("sdcard/end.png");
var r = new Robot();
var dh = 40 * device.height / 720;


new java.lang.Thread(function() {
	classNameContains("Button").textContains("立即开始").click();
}).start();


if (!requestScreenCapture()) {
	toast("请求截图失败");
	exit();
}


launch("com.eg.android.AlipayGphone");
while (!click("蚂蚁森林"));
className("android.widget.Button").desc("攻略").waitFor();
toastLog("成功进入");
sleep(3000);


takeMyself2();
toastLog("收取自己的能量完毕");
sleep(5000);


while (1) {
	for (var p = findImage(captureScreen(), temp); p; p = findImage(captureScreen(), temp)) {
		r.click(p.x, p.y + dh);
		takeOther2();
		sleep(2000);
		idContains("h5_tv_nav_back").click();
		sleep(5000);
	}

	if (findImage(captureScreen(), end)) {
		break;
	}
	r.swipe(device.width / 2, device.height * 2 / 3, device.width / 2, device.height * 1 / 3);
	sleep(3000);
}


toastLog("收取能量完毕");
if (ismyself) {
	shell("pm disable com.eg.android.AlipayGphone", true);
}
exit();

/*********************************各种函数*********************************************/

function takeMyself() {
	var a = descContains("线下支付").find();
	if (a) {
		toastLog("能量球个数1：" + a.size());
		a.each(function(x) {
			log(x.bounds());
			r.click(x.bounds().centerX(), x.bounds().centerY() - dh);
		});
	}
	var b = descContains("行走").find();
	if (b) {
		log("能量球个数2：" + b.size());
		b.each(function(x) {
			toastLog(x.bounds());
			r.click(x.bounds().centerX(), x.bounds().centerY() - dh);
		});
	}

	//todo 	需要添加更多的情况
}

function takeOther() {
	className("android.widget.Button").desc("浇水").waitFor();
	sleep(3000);
	var a = descContains("  可收取").find();
	if (a) {
		toastLog("能量球个数：" + a.size());
		a.each(function(x) {
			toastLog(x.bounds());
			r.click(x.bounds().centerX(), x.bounds().centerY() - dh);
			sleep(1000);
		});
	}
}


function takeMyself2() {

	var right_bottom = className("android.widget.Button").desc("攻略").findOne();
	log(right_bottom);
	var left_top = descContains("返回").findOne();
	log(left_top);

	var filtes = [];
	var left = 0;
	var right = device.width;
	var top = left_top.bounds().bottom;
	var bottom = right_bottom.bounds().top;

	log(left + "-" + top + "-" + right + "-" + bottom);

	var all = descMatches("^\\d+g$").boundsInside(left, top, right, bottom).untilFind();
	toastLog("能量球个数：" + (all.size() - 1));
	all.each(function(x) {
		filtes.push(x);
	});

	filtes.sort(function(o1, o2) {
		return distance(o1) - distance(o2);
	});

	if (filtes.length > 0) {
		filtes.splice(0, 1);
	}

	for (var i = 0; i < filtes.length; i++) {
		//原有的click无效
		r.click(filtes[i].bounds().centerX(), filtes[i].bounds().centerY());
		log("点击->" + filtes[i]);
	}


	function distance(o) {
		return Math.pow((o.bounds().top - top), 2) + Math.pow((o.bounds().right - right), 2);
	}

}


function takeOther2() {

	var right_bottom = className("android.widget.Button").desc("浇水").findOne();
	var left_top = descContains("返回").findOne();
	var filtes = [];
	var left = 0;
	var right = device.width;
	var top = left_top.bounds().bottom;
	var bottom = right_bottom.bounds().top;

	log(left + "-" + top + "-" + right + "-" + bottom);

	var all = descMatches('^\\d+g$').boundsInside(left, top, right, bottom).untilFind();
	toastLog("能量球个数：" + all.size());
	all.each(function(x) {
		r.click(x.bounds().centerX(), x.bounds().centerY());
		log("点击->" + x);
	});

}

function Robot() {
	var r = null;
	if (device.sdkInt < 24) {
		r = new RootAutomator();
	}

	this.click = function(x, y) {
		if (r == null) {
			press(x, y, 50);
		} else {
			r.touchDown(x, y);
			sleep(10);
			r.touchUp();
		}
	}
	this.swipe = function(x1, y1, x2, y2, duration) {
		if (duration == undefined) {
			duration = 200;
		}
		if (r == null) {
			swipe(x1, y1, x2, y2, duration);
		} else {
			r.touchDown(x1, y1);
			sleep(duration);
			r.touchMove(x2, y2);
			sleep(duration);
			r.touchUp();
		}
	}

}

/*******************解锁模块代码实例，我把自己的代码乱改***********************/
//下面的代码放另一个文件里面
// function unlock() {
// 	var pm = context.getSystemService(context.POWER_SERVICE);
// 	var b = pm.isScreenOn();
// 	if (!b) {
// 		unlock0();
// 	}
// }

// function unlock0() {
// 	"root";
// 	device.wakeUp();
// 	sleep(3000);
// 	var ra = new Robot();
// 	ra.swipe(760, 1000, 360, 750);
// 	sleep(1000);
// 	ra.click(650, 450);
// 	sleep(1000);
// 	ra.click(650, 350);
// 	sleep(1000);
// 	ra.click(160, 750);
// 	sleep(1000)
// 	ra.click(760, 360);
// 	sleep(2000);
// } 

// module.exports = unlock;
