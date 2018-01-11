//简单说明：这个是用于检查更新的，直接使用即可。

var url = "https://raw.githubusercontent.com/start201711/autojs/master/%E8%84%9A%E6%9C%AC.js";

var js = http.get(url).body.string();

js.match(/最后修改于：(.*?)\n/g);
var ret = RegExp.$1;
log(ret);

if (confirm("蚂蚁森林自动收能量脚本最后更新于\n" + ret + "\n你需要更新吗？")) {
	setClip(js);
	alert("最新脚本已复制到剪贴板，粘贴即可使用");
}
