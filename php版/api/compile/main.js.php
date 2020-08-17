/*
计时api


var total=0;
var count=100;
var begin,end,timing;
begin=window.performance.now();
end=window.performance.now();
timing=end-begin;
console.log(timing);
for(var i=0;i<count;i++){
    begin=window.performance.now();//开始
	
	
    end=window.performance.now();//结束
    total+=end-begin-timing;
}
console.log("代码运行耗时："+(total/count)+"ms");



*/
//https://tool.css-js.com/
//压缩
//console.log("测试时间：",window.performance.now());
(function(){
	var o={};
	/*
	* 配置之前首先需要域名，不能是127.0.0.1、IP地址、localhost，必须有xxx.xx，如：test.cn的域名，协议HTTP、HTTPS均可，建议HTTPS。
	* version 访问时的后端访问地址，如后端访问地址为：https://xxx.cn/api/v，这里就填"/api/v"即可
	* OSAppId 系统应用的公钥，对应数据库字段：app_info中的publickey
	* minVersion 打开时发现低于这个版本号在这里会强制升级，以解决自动更新失效的版本（注意不要高于OSAppId的版本号）默认0
	* 此文件会自动压缩，注释会自动删除。
	* */
	o.config={//这里需要配置后端的访问路径开始
		version:"/webappos/api/os/v.php",//访问时的后端访问地址（version）相对于网站根目录 必填
		auth:"/webappos/api/os/a.php",//后端访问地址（auth） 必填
		check:"/webappos/api/os/c.php",//后端访问地址（check） 必填
		OSAppId:"7304e2ba4ad4d653334f88544533f937693d9edc",//开机启动的无界面系统应用APPID 必填
		minVersion:14991,//打开时发现低于这个版本号在这里会强制升级，以解决自动更新失效的版本（注意不要高于OSAppId的版本号）默认0
		startAppId:"dea93ba952214d7026b5396eebe0706c06fb2b02",//启动系统应用后启动的应用ID（首屏应用）必填
		defaultApp:[
			//"126091994f297c1930dd3944c3c942370c9a694e",
			//"dbd0520149a111ef36f85782fffb24582dc870d2",
			//"beedc3e866012349a31f33dddbd27ff522307039"
		],//默认安装的应用列表 默认[]
		websocket:null,//WebSocket地址 默认null
		websocket_pushAppId:null,//WebSocket主动推送给指定的应用，应用在onMessage接收信息 默认null
		data:null//其它信息 默认null
	};//需要配置的地方结束
	o.config.domain=window.location.host;//网站域名，这里是自动获取的方式
	if(/^\d+\.\d+\.\d+\.\d+:?\d*$/.test(o.config.domain)||/^localhost:?\d*$/.test(o.config.domain)){//判断有没有域名
		//如果没有域名，则报错！
		console.error("WebAppOS: A domain name is required for WebAppOS. Such as www.xxx.cn.");
		console.error("WebAppOS: Will not start until the error is fixed");return;
		//必须要一个域名，否则会导致环境不安全！
		//如果临时在本机运行可以使用修改hosts文件设置一个域名映射到你的ip地址。
	}
	o.config.subDomain=o.config.domain.substring(o.config.domain.indexOf(".")+1);//自动获取二级域名
	if(o.config.subDomain.indexOf(":")>=0)//如果有端口号，那么
		o.config.subDomain=o.config.subDomain.substring(0,o.config.subDomain.indexOf(":"));//自动去掉端口号
	
	/*轻量型本地缓存能力，作者CH*/
	o.db=function(){"use strict";var a,e={connect:function(b){if(b){if(!("indexedDB"in window))return f.connect(b),void 0;d=this,a=indexedDB.open("chdb"),a.onupgradeneeded=function(){a.result.createObjectStore("kv")},a.onerror=function(a){a.preventDefault()},a.onsuccess=function(a){e.db=a.target.result,e.setItem("hello","world",function(){e.getItem("hello",function(a){"world"==a?b(e.db):f.connect(b)})})}}},setItem:function(a,b,c){if(b===null)b=void 0;var d=this.db.transaction("kv","readwrite").objectStore("kv"),e=d.put(b,a);c&&(e.onsuccess=function(){c(b)},e.onerror=function(){c()})},getItem:function(a,b){var c,d;b&&(c=this.db.transaction("kv","readonly").objectStore("kv"),d=c.get(a),d.onsuccess=function(){var a=d.result;void 0===a&&(a=null),b(a)},d.onerror=function(){b()})},removeItem:function(a,b){var c=this.db.transaction("kv","readwrite"),d=c.objectStore("kv");d.delete(a),b&&(c.oncomplete=function(){b(null)},c.onerror=c.onabort=function(){b()})},iterate:function(a,b){var c,d;a&&(c=this.db.transaction("kv","readonly").objectStore("kv"),d=c.openCursor(),d.onsuccess=function(){var e,f,c=d.result;c?(e=c.key,f=c.value,void 0===a(e,f)?c.continue():b&&b(null)):b&&b(null)},d.onerror=function(){b&&b()})},clear:function(a){var b=this.db.transaction("kv","readwrite").objectStore("kv"),c=b.clear();a&&(c.onsuccess=function(){a(null)},c.onerror=c.onabort=function(){a()})}},f={connect:function(a){if(a){if(!("openDatabase"in window))return g.connect(a),void 0;d=this,this.db=openDatabase("chdb","","chWebOS",4980736),this.db.transaction(function(b){b.executeSql("CREATE TABLE IF NOT EXISTS chdb (id INTEGER PRIMARY KEY, key unique, value)",[],function(){f.setItem("hello","world",function(){f.getItem("hello",function(b){"world"==b?a(e.db):g.connect(a)})})},function(){g.connect(a)})})}},setItem:function(a,b,c){this.db.transaction(function(d){d.executeSql("INSERT OR REPLACE INTO chdb (key, value) VALUES (?, ?)",[a,JSON.stringify(b)],function(){c&&c(b)},function(){c&&c()})},function(){c&&c()})},getItem:function(a,b){b&&this.db.transaction(function(c){c.executeSql("SELECT * FROM chdb WHERE key = ? LIMIT 1",[a],function(a,c){b(c.rows.length?JSON.parse(c.rows.item(0).value):null)},function(){b()})})},removeItem:function(a,b){this.db.transaction(function(c){c.executeSql("DELETE FROM chdb WHERE key = ?",[a],function(){b&&b(null)},function(){b&&b()})})},iterate:function(a,b){a&&this.db.transaction(function(c){c.executeSql("SELECT * FROM chdb",[],function(c,d){var g,h,e=d.rows,f=e.length;for(g=0;f>g;g++)if(h=e.item(g),void 0!==a(h.key,JSON.parse(h.value)))return b&&b(null),void 0;b&&b(null)})})},clear:function(a){this.db.transaction(function(b){b.executeSql("DELETE FROM chdb",[],function(){a&&a(null)},function(){a&&a()})})}},g={connect:function(a){if(a){if(!("localStorage"in window))return console.warn("浏览器不支持本地储存！"),void 0;d=this,console.warn("浏览器正在使用localStorage存储！"),this.db=localStorage,a(this.db)}},setItem:function(a,b,c){this.db.setItem(a,JSON.stringify(b)),c&&c(b)},getItem:function(a,b){b&&b(JSON.parse(this.db.getItem(a)))},removeItem:function(a,b){this.db.removeItem(a),b&&b(null)},iterate:function(a,b){var c,d;if(a){for(c=0;c<this.db.length;c++)if(d=this.db.key(c),void 0!==a(d,this.db.getItem(d)))return b&&b(null),void 0;b&&b(null)}},clear:function(a){for(var b=this.db.length-1;b>=0;b--)this.db.removeItem(this.db.key(b));a&&a(null)}},d=e;return{setItem:function(a,b,c){d.db?d.setItem(a,b,c):d.connect(function(){d.setItem(a,b,c)})},getItem:function(a,b){d.db?d.getItem(a,b):d.connect(function(){d.getItem(a,b)})},removeItem:function(a,b){d.db?d.removeItem(a,b):d.connect(function(){d.removeItem(a,b)})},iterate:function(a,b){d.db?d.iterate(a,b):d.connect(function(){d.iterate(a,b)})},clear:function(a){d.db?d.clear(a):d.connect(function(){d.clear(a)})}}}();
	/*轻量型本地缓存能力End*/
	+function(){
		var big=new Array(1024 * 1024).join("s");//1MB
		o.db.setItem("f",big,function(){
				o.db.getItem("f",function(big2){
						o.db.removeItem("f");
						if(big!==big2)alert("系统存储空间可能不足！请释放部分存储空间，否则可能导致启动白屏等情况！");
				});
		});
	}();
	/*存储空间检测报警*/
	/*安全禁用本地缓存，作者CH*/
	/*["indexedDB","openDatabase","localStorage"].forEach(function(d){
		try{
			Object.defineProperty(window,d,{
				get:function(){return void 0},
			});
		}catch(e){};
	});*/
	//console.log();
	//document.appendChild();
	var c=function(e){return document.createElement(e)};//document创建标签
	
	var d=document;//document
	var html=d.documentElement;
	if(!d.body){//body未初始化时执行：
		var vitualBody=c("body");
		html.appendChild(vitualBody);//没有body的话就初始化body
		var l=c("link");l.setAttribute("rel","icon");l.setAttribute("href","data:;base64,=");d.head.appendChild(l);
		//当body未初始化时才能去掉图标，即第二次打开都不会加载图标，上面一行是去掉图标的关键代码
	}
	var b=d.body;//body为了缩减代码量，下同
	var h=d.head;//head
	
	b.style.margin="0";//取消浏览器的默认margin
	html.style.height=b.style.height="100%";//设置区域大小
	
	var m=c("meta");m.setAttribute("charset","UTF-8");h.appendChild(m);//utf8编码
	m=c("meta");m.name="viewport";m.content="width=device-width,initial-scale=1,minimum-scale=1,user-scalable=no";h.appendChild(m);
	//上一行代码是为了进行移动端适配
	
	
	var work=o.work=c("div");//工作区域
	work.className="CH_work";//仅做识别用，工作区域
	work.style.width=work.style.height="100%";
	
	
	var sys=o.sys=c("div");//系统区域
	sys.className="sys";
	sys.style.position="fixed";
	sys.style.width=sys.style.height="100%";
	work.appendChild(sys);//将系统区域插入工作区域中
	
	var appList=o.appList=c("div");//应用列表
	appList.className="appList";
	appList.style.position="fixed";
	appList.style.width=appList.style.height="100%";
	work.appendChild(appList);//将应用列表插入工作区域中
	
	var fullscreen=o.fullscreen=c("div");//全屏cover
	fullscreen.id="fullscreen";
	work.appendChild(fullscreen);//将全屏区域插入工作区域中
	
	b.appendChild(work);//将工作区域插入body中
	
	/*
	CH webAppOS 2.0
	
	作者：桂林理工大学 CH
	联系QQ：877562884
	目的：
	
	应用窗体化
	高度解耦
	代码精简
	应用安全
	安卓app支持
	api统一
	应用生命周期
	性能优先
	网络传输压缩
	缓存优先
	支持离线
	网络失败处理
	异步操作
	
	结构：
	<work><!--框架工作区域-->
		<appList><!--应用列表-->
			<app><!--App应用整体-->
				
				<appTitle></appTitle><!--应用标题栏随着应用跑-->
				
				<iframe></iframe><!--应用实体-->
				
				...更多ui
				
			</app>
			...更多app
		</appList>
		<>
	</work>
	
	此文件为微内核
	真正的内核在应用中。
	下面要开始做初始化系统内核应用做准备
	
	打开系统应用
	应用appid：
	56f075a770c512e5dd2009022d728269e10350af
	
	
	打开应用流程：
	
	判断缓存版本是否有更新 c.php
	有更新或第一次打开
		下载应用代码并缓存
	没有更新
		直接启动
	这里需要用到ajax与服务器交互，能否加快速度呢？
	
	流程如下：（已优化）
	
	有无缓存
	有缓存
		打开缓存代码
		判断是否有更新 c.php
		有更新
			更新源码
			通知系统有更新
		没有更新
			noop
	无缓存
		下载源码
		打开应用
	
	
	*/
	/*o.s=function(k,v,fn){//同步写入
		o.db.setItem(k,v,fn);
	};
	o.g=function(k,fn){//异步读取
		o.db.getItem(k,fn);
	};*/
	o.s=o.db.setItem;
	o.g=o.db.getItem;
	o.randomChar=function(len){
		len = len || 32;
		var $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
		var maxPos = $chars.length;
		var pwd = "";
		for(var i=0;i<len;i++)pwd+=$chars.charAt(Math.floor(Math.random()*maxPos));
		return pwd;
	};
	var OSAppId=o.config.OSAppId;//系统应用appid
	o.request=function(url,post,fn){
		var a=new XMLHttpRequest();
		a.open(post?"POST":"GET",url,true);
		a.onreadystatechange=function() {
			if (a.readyState==4&&a.status==200||a.status==304){
 				//var s=a.responseText;
				//try{s = JSON.parse(a.responseText);}catch(e){}
				fn(a.responseText);
			}
		};
		if(post)a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		a.send(post);
	}
	//我们不用考虑有人修改缓存的数据，原因很简单，我们只要防止应用修改其他应用的数据即可。
	//这里专门为启动系统应用做准备，因为其他应用的打开方式会在系统应用中重写。
	o.g("ch:deviceId",function(data){//开始异步
		if(!data){//没有deviceID说明第一次打开
			o.deviceId=o.randomChar(16);
			o.s("ch:deviceId",o.deviceId);
		}else
			o.deviceId=data;
		//到了这里我们就有了设备唯一识别码了
		//开始获取版本号
		var init_system=function(h1,h2){//传入HTML和JS
			//到了这里就可以启动系统了！
			//进入启动系统逻辑
			//由于这里只是要启动系统，可使用简单的启动流程
			//无需造成跨域，无需iframe
			//无需应用框架，即
			sys.innerHTML=h1;
			var app=function(s){
				s.onLoad({v:2});
			}
			eval(h2);
			
		};
		o.g("ch:app:ver:"+OSAppId,function(v){
			if(v&&v>=o.config.minVersion){//████████████████████████████████████████████████████████████████████████████████████████████████████████████
				//说明有系统源码，则启动系统
				//有版本号，且版本号不低于维护的版本号
				//即自动更新失效的版本，在这里强制升级
			
				o.g("ch:app:html:"+OSAppId,function(h){//获取系统内核的HTML源码
					o.g("ch:app:js:"+OSAppId,function(j){//获取系统内核的JS源码
						//已经获取到了缓存的系统的源码
						init_system(h,j);
					});
				});
			}else{
				//没有源码则要下载
				o.request(o.config.version,"prog=" + OSAppId + "&device=" + o.deviceId,function(s){
					try{s=JSON.parse(s);}catch(e){}
					if(s && s.ver){
						s=s.ver;
						var code_html,code_js;
						var finish=function(){//完成了
							//下载成功，设置版本号
							o.s("ch:app:json:"+OSAppId, s.data); //设置json，可有可无？暂无用处
							o.s("ch:app:ver:"+OSAppId,s.version|0);//下载好了，缓存
							//版本号异步设置，无需同步
							init_system(code_html,code_js);
						};
						o.request(s.html,null,function(h){//下载应用HTML源码
							o.s("ch:app:html:"+OSAppId,h);//下载好了，缓存
							code_html=h;
							if(code_js)finish();
						});
						o.request(s.js,null,function(h){//下载应用JS源码
							o.s("ch:app:js:"+OSAppId,h);//下载好了，缓存
							code_js=h;
							if(code_html)finish();
						});
					}
				});
			}
		});
	});
	return o;
})()//这里不要加分号！！！