app({
onLoad:function(event){
if(!event||!event.v||event.v!==2)console.log("WebAPPOS: 加载失败，缺少版本控制组件！");
var startTime=0;
if(window.performance&&window.performance.now)
startTime=window.performance.now();
console.log("WebAPPOS: 开始加载webAppOS内核！");
var OSAppId=o.config.OSAppId;
var c=function(e){return document.createElement(e)};
var appList=o.appList;
o.data={};
o.data.jsapi=document.getElementById("jsapi").innerHTML;
o.data.appStyle=document.getElementById("appstyle").innerHTML;
o.eval=function(code,data,that){return eval('('+code+')');};
o.document=document;
o.appList.innerHTML="";
o.pcb=[];
o.pcbList=[];
o.pcbApp=null;
o.colorInput=document.getElementById("theme-color");
var ua = navigator.userAgent.toLowerCase();
o.flag={
screenOrientation:0,
is_Weixin_webBrowser:ua.indexOf('micromessenger') !== -1,
is_Weixin_miniApp:ua.indexOf('miniprogram') !== -1,
is_QQ:/ qq/i.test(ua),
is_App:ua.indexOf('webappos') !== -1,
is_Yiban_Android:typeof window.local_obj !== 'undefined',
is_Yiban_IOS:typeof window.ios_yibanhtml5location !== 'undefined',
is_Android:ua.indexOf('android') !== -1||ua.indexOf('adr') !== -1,
is_iOS:/\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(ua),
is_TemplateJS:false,
history_length:history.length,
};
o.flag.is_PC = !o.flag.is_Android && !o.flag.is_iOS;
o.flag.is_Weixin=o.flag.is_Weixin_webBrowser||o.flag.is_Weixin_miniApp;
o.flag.is_Yiban=o.flag.is_Yiban_Android||o.flag.is_Yiban_IOS;
o.zIndex=1;
if(o.flag.is_Yiban&&typeof demo !== "undefined" && typeof demo.hideTitleBar !== "undefined")demo.hideTitleBar();
 
(function(o) {function md5cycle(x, k) { var a = x[0], b = x[1], c = x[2], d = x[3]; a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586); c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330); a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426); c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983); a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417); c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162); a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101); c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329); a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632); c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302); a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083); c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848); a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690); c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501); a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784); c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734); a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463); c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556); a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353); c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640); a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222); c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189); a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835); c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651); a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415); c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055); a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606); c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799); a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744); c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649); a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379); c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551); x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]); } function cmn(q, a, b, x, s, t) { a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b); } function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); } function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); } function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); } function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); } function md51(s) { txt = ''; var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i; for (var i = 64; i <= s.length; i += 64) { md5cycle(state, md5blk(s.substring(i - 64, i))); } s = s.substring(i - 64); var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; for (var i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3); tail[i >> 2] |= 0x80 << ((i % 4) << 3); if (i > 55) { md5cycle(state, tail); for (var i = 0; i < 16; i++) tail[i] = 0; } tail[14] = n * 8; md5cycle(state, tail); return state; } function md5blk(s) { var md5blks = [], i; for (var i = 0; i < 64; i += 4) { md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24); } return md5blks; } var hex_chr = '0123456789abcdef'.split(''); function rhex(n) { var s = '', j = 0; for (; j < 4; j++) s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F]; return s; } function hex(x) { for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]); return x.join(''); } function md5(s) { return hex(md51(s)); } function add32(a, b) { return (a + b) & 0xFFFFFFFF; } if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {function add32(x, y) { var lsw = (x & 0xFFFF) + (y & 0xFFFF), msw = (x >> 16) + (y >> 16) + (lsw >> 16); return (msw << 16) | (lsw & 0xFFFF); } } o.md5 = md5; })(o);
o.i = function(k, fn, finish) { 
o.db.iterate(function(key,value){
if (key.indexOf(k) === 0)return fn(key,value)
},function(){
if(finish)finish();
});
};
o.d=o.db.removeItem;
o.c=o.db.clear;
document.body.addEventListener('touchmove',function(e){e.preventDefault();},{passive:false});
if(!NodeList.prototype.forEach)NodeList.prototype.forEach=Array.prototype.forEach;
document.oncontextmenu=function(e){e.preventDefault();return false;};
o.generateHTML=function(option){
option=JSON.parse(option);
var p=document.createElement("view");
var ir=function(op,l){
if(op.constructor===Array){
(function(l){
for(var i in op){
if(!op[i].tag)continue;
var t=document.createElement(op[i].tag);
if(op[i].text)t.innerText=op[i].text;
for(var i2 in op[i].attribute||{}){t.setAttribute(i2,op[i].attribute[i2]);}
l.appendChild(t);
if(op[i].children)ir(op[i].children,t);
}
})(l);
}else if(op.constructor===Object){
if(!op.tag)return;
var t=document.createElement(op.tag);
if(op.text)t.innerText=op.text;
for(var i2 in op.attribute||{}){t.setAttribute(i2,op.attribute[i2]);}
l.appendChild(t);
if(op.children)ir(op.children,t);
}
};
ir(option,p);
return p;
};
o.auth={
isVerifyAuth: false,
authType: null,
isAuth: false,
info:null,
logout:function(fn) {
o.i("ch:auth:", function(k){o.d(k)});
o.i("ch:appdata:", function(k){o.d(k)},fn);
return true;
},login:function(key, fn){
var a = new XMLHttpRequest();
a.open('POST', o.config.auth, true);
a.onreadystatechange = function() {
if (a.readyState == 4 && a.status == 200 || a.status == 304) {
a = JSON.parse(a.responseText);
o.auth.isVerifyAuth = true; 
if (a.res == 100) {
o.s("ch:auth:type", a.data.type);
o.s("ch:auth:user", a.data.user);
o.s("ch:auth:key", a.data.key);
o.s("ch:auth:time", a.data.tokenexpires);
localStorage.setItem("webAppOSauth",1);
o.s("ch:auth:info", a.data.info, function() {
o.auth.info = {
type: a.data.type,
user: a.data.user,
key: a.data.key,
info: a.data.info
};
o.auth.isAuth = true;
o.authType = a.data.type;
fn(true);;
});
} else fn(false); 
}
};
a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
a.send("type=login&key=" + key + "&device=" + o.deviceId);
},verifyAuth:function() { 
if (o.auth.isVerifyAuth) return false;
if(!localStorage.getItem("webAppOSauth")){
o.auth.logout();
return;
}
o.g("ch:auth:type", function(data) {
if (data) { 
o.g("ch:auth:user", function(data1) {
o.g("ch:auth:key", function(data2) {
o.g("ch:auth:info", function(data3) {
var a = new XMLHttpRequest();
a.open('POST', o.config.auth, true);
a.onreadystatechange = function() {
if (a.readyState == 4 && a.status == 200 || a.status == 304) {
a = JSON.parse(a.responseText);
o.auth.isVerifyAuth = true; 
if (a.res == 100) {
o.auth.info = {
type: data,
user: data1,
key: data2,
info: data3
};
o.auth.isAuth = true;
o.auth.authType = a.data.type;
} else{
o.core.toast("授权信息已过期，请重新登录！");
o.auth.logout();
} 
}
};
a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
a.send("type=verify&verify=" + data + "&user=" + data1 + "&key=" + data2 + "&device=" + o.deviceId);
});
});
});
} else {
}
});
},autoLogin:function(fn){
o.g("ch:auth:type", function(data) {
if(data){
o.g("ch:auth:user", function(data1) {
o.g("ch:auth:key", function(data2) {
o.g("ch:auth:info", function(data3) {
o.auth.info = {
type: data,
user: data1,
key: data2,
info: data3
};
o.auth.isAuth = true;
o.auth.authType = data;
fn(true);
});
});
});
}else fn(false);
});
}
};
o.originURL = window.document.location.href.toString();
o.urlDecode = function(str) { 
var arr = {};
arrs = str.split("&");
for (var i = 0; i < arrs.length; i++) arr[arrs[i].split("=")[0]] = decodeURIComponent(arrs[i].split("=")[1]);
return arr;
};
o.urlEncode = function(arr) {
var str;
for (var arri in arr)
if (str == '') str += arri + '=' + encodeURIComponent(arr[arri]);
else str += '&' + arri + '=' + encodeURIComponent(arr[arri]);
return str;
};
+function() {
var url = o.originURL.split("#")[0];
o.originURLArr = {};
if (url.indexOf("?") != -1) o.originURLArr = o.urlDecode(url.substr(url.indexOf('?') + 1));
}();
if(o.originURLArr.access_token){
o.g("ch:auth:key",function(res){
if(o.originURLArr.end&&o.originURLArr.end<(new Date().getTime()/1000|0)&&res===o.originURLArr.access_token){
o.auth.logout();
o.core.toast("登录已经过期，请重新登录！");
return;
}else if(o.originURLArr.end&&o.originURLArr.end<(new Date().getTime()/1000|0)){
o.core.toast("此链接已过期！");
}else if(res!==o.originURLArr.access_token){
if(res)
o.core.toast("正在切换登录中...");
else
o.core.toast("正在登录中...");
o.auth.logout(function(){
o.auth.login(o.originURLArr.access_token,function(res){
if(res){
o.core.toast("登录成功！");
o.soft_reboot();
}else
o.core.toast("登录失败！");
});
});
return;
}
if(res)
o.auth.autoLogin(function(res){if(res)o.auth.verifyAuth();});
});
}else
o.auth.autoLogin(function(res){if(res)o.auth.verifyAuth();});
o.history={
refresh:function(){window.history.replaceState(null,null,null);},
replace:function(path){window.history.replaceState(null,null,path);},
root:function(){window.history.replaceState(null,null,"./");},
push:function(app){
if(navigator.userAgent.indexOf("yiban")!==-1)
window.history.pushState({index:o.pcbList.length,app:app},'',"?app="+app+"#q.yiban.cn");
else
window.history.pushState({index:o.pcbList.length,app:app},'',"?app="+app);
},delete:function(){
o.flag.disablePopstate=true;
window.history.go(-1);
},forward:function(){
window.history.pushState(null,'',null);
},pushState:function(state){
}
};
window.onpopstate = function(e) { 
if(o.flag.disablePopstate){o.flag.disablePopstate=false;return;}
if(!e.state||o.pcbList.length-1>=e.state.index){
var res;
try{
if(o.pcbApp.handle.app.onBack)res=o.pcbApp.handle.app.onBack();
}catch(e){
console.warn("WebAPPOS: 应用onBack执行时发生错误！" + e);
}
if(res === false){
o.flag.disablePopstate=true;
window.history.go(1);
return;
}else{
if(o.pcbList.length>1)window.history.pushState(null,null,null);
o.core.closeApp(o.pcbApp.pid);
if(!o.pcbApp){
o.core.toast("Power Off webAppOS");
o.core.exit();
console.log("WebAppOS: 系统关机！");
return;
}
if(o.pcbApp.screenOrientation!=o.flag.screenOrientation){
if(o.pcbApp.screenOrientation)o.core.landscape();else o.core.portrait();
}
o.core.changeColor(o.pcbApp.color);
o.core.changeTitle(o.pcbApp.title);
}
}else{
}
};
o.list={};
o.list.getScanResult=[];
o.list.yibanhtml5location=[];
o.list.onJSApiCallback=[];
window.getScanResult=function(result){
if(o.list.getScanResult.length==0)return;
o.list.getScanResult.splice(0,1)[0](result);
};
window.yibanhtml5location=function(position){
if(o.list.yibanhtml5location.length==0)return;
o.list.yibanhtml5location.splice(0,1)[0](position);
}
window.onJSApiCallback = function(ev){
if(o.list.onJSApiCallback.length==0)return;
o.list.onJSApiCallback.splice(0,1)[0](ev);
};
o.window=window;
if(o.socket&&o.socket.websocket)o.socket.websocket.close();
o.socket = {
queue: [], 
websocket: null,
link: function(fn) {
if(!o.config.websocket)return false;
if (!this.websocket || this.websocket.readyState != 1 || this.websocket.url !== 'wss://yiban.glut.edu.cn/wss') {
this.websocket = new WebSocket(o.config.websocket);
this.websocket.onopen = function() {
this.send(JSON.stringify({
ver: '2',
data: {
device: o.deviceId
},
}));
if (typeof fn == 'function') fn();
};
this.websocket.onmessage = function(msg) {
if (msg == ".") return;
res = JSON.parse(msg.data);
if (res.type == "ping") return;
if (res.type == "message") {
var pid = res.pid;
var source = res.source;
for (var s in o.socket.queue) {
if (o.socket.queue[s].id == res.id) {
var fn = o.socket.queue.splice(s, 1)[0];
fn.callback(source);
break;
}
}
} else if (res.type == "push") { 
if(o.config.websocket_pushAppId)o.core.sendMessage(o.config.websocket_pushAppId,{
type:"push",
source:res.source,
},{app:"system"});
}
};
this.websocket.onclose = function() {
console.log('WebAppOS: websocket断开连接');
};
} else {
if (typeof fn == 'function') fn();
return true;
}
},
send: function(data) {
this.websocket.send(JSON.stringify({
ver: '2',
data: data,
}));
},
};
o.getApi=function(docum,handle){
var app = handle.app;
var env = handle.env;
var watcher = [];
return {
toast: function(text, time) {
requestAnimationFrame(function(){
o.core.toast(text,time);
});
},alert: function(text, title, button, fn, content) {
requestAnimationFrame(function(){
o.core.alert(text,title, button, fn, content);
});
},showLoading:function(text, time) {
requestAnimationFrame(function(){
o.core.showLoading(text,time);
});
},hideLoading: function() {
requestAnimationFrame(function(){
o.core.hideLoading();
});
},import: function(source, fn, step) { 
if (!fn) fn = function() {};
var that = this;
var download = function(url, fn) {
o.g("ch:cdn:" + url, function(v) {
if (v) { fn(v); return }
var a = new XMLHttpRequest();
a.open('GET', url, true);
a.onreadystatechange = function() {
if (a.readyState == 4 && a.status == 200 || a.status == 304) {
o.s("ch:cdn:" + url, a.responseText);
o.s("ch:cdninfo:" + url, {
createTime: new Date().getTime()
}); 
fn(a.responseText); 
}
};
a.send();
});
};
if (typeof source === "object") { 
var index = 0;
var next = function() {
if (index >= source.length) { fn(); return; } 
var url = o.core.checkCDN(source[index]);
download(url, function(res) {
if (step) step(index);
var r = url.split(/\./);
var type = r[r.length - 1];
if (type == 'js') that.loadJS(res);
else if (type == 'css') that.loadCSS(res);
index++;
next();
});
};
next();
} else if (typeof source === "string") { 
var url = o.core.checkCDN(source);
download(url, function(res) {
var r = url.split(/\./);
var type = r[r.length - 1];
if (type == 'js') that.loadJS(res);
else if (type == 'css') that.loadCSS(res);
fn();
});
}
return "asyn";
},title:function(text){
return env.changeTitle(text);
},color:function(color){
return env.changeColor(color);
},bind:function() {
var wind=docum;
if (app.setting && app.setting.title)this.title(app.setting.title); else this.title("");
if (app.setting && app.setting.color)this.color(app.setting.color); else this.color("#3f51b5");
var addWatcher = function(att, fn, source) {
var ed = false;
for (var i in watcher) {
if (i.att == att) {
ed = true;
break;
}
}
if (!ed) (function() {
var v = app.data[att];
handle.eval(function() {
Object.defineProperty(data.app.data, data.att, {
get:function() {
return data.v;
},
set:function(n) {
for (var i in data.watcher) {
if (data.watcher[i].att == data.att) data.watcher[i].fn(n, data.source);
}
data.v = n;
}
});
}.toString() + "()", {
app:app,
att:att,
watcher:watcher,
v:v,
source:source
});
})();
watcher.push({
att:att,
fn:fn
});
app.data[att] = app.data[att];
};
wind.querySelectorAll("[ch]").forEach(function(dom) {
var d;
dom.removeAttribute("ch");
handle.eval(function() {
var comm = data.dom.attributes;
for (var i = 0; i < comm.length; i++) {
(function(i) {
var item = comm[i].name;
var value = comm[i].value;
if (item.substr(0, 1) == ":") {
var att = item.substr(1);
if (!att) return;
data.addWatcher(value, function(n) {
data.dom.setAttribute(att, n);
});
}
})(i);
}
}.toString() + "()", {
dom:dom,
addWatcher:addWatcher
});
});
wind.querySelectorAll("[ch-html]").forEach(function(dom) {
var d;
dom.setAttribute("ch-htmled", d = dom.getAttribute("ch-html"));
dom.removeAttribute("ch-html");
addWatcher(d, function(n) {
dom.innerHTML = n;
});
});
wind.querySelectorAll("[ch-val]").forEach(function(dom) {
var d = dom.getAttribute("ch-val");
dom.setAttribute("ch-valed", d);
dom.removeAttribute("ch-val");
addWatcher(d, function(n) {
dom.value = n;
});
handle.eval(function() {
data.dom.addEventListener("input", function(e) {
data.app.data[data.d] = e.target.value;
});
}.toString() + "()", {
dom:dom,
app:app,
d:d
});
});
wind.querySelectorAll("[ch-watch]").forEach(function(dom) {
var d = dom.getAttribute("ch-watch");
dom.setAttribute("ch-watched", d);
dom.removeAttribute("ch-watch");
handle.eval(function() {
data.dom.addEventListener("input", function(e) {
if (data.app.data) data.app.data[data.d] = e.target.value;
if (typeof data.app[data.d] === "function") data.app[data.d](e.target.value);
});
}.toString() + "()", {
dom:dom,
app:app,
d:d
});
});
wind.querySelectorAll("[ch-img]").forEach(function(dom) {
var d;
dom.setAttribute("ch-imged", d = dom.getAttribute("ch-img"));
dom.removeAttribute("ch-img");
o.g("ch:cache:url:" + d, function(res) {
o.g("ch:cache:ver:" + d, function(re) {
if (res) handle.eval(function() {
if (data.dom.tagName == "IMG") data.dom.setAttribute("src", data.res[0]); else data.dom.style.backgroundImage = "url(" + data.res[0] + ")";
}.toString() + "()", {
dom:dom,
res:res
});
if (!res || dom.getAttribute("ch-update") !== re || dom.getAttribute("ch-update") == "") {
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var img = new Image();
img.crossOrigin = "Anonymous";
img.src = d;
img.onload = function() {
canvas.height = img.height;
canvas.width = img.width;
ctx.drawImage(img, 0, 0, img.width, img.height);
var res = [ canvas.toDataURL("image/png") ];
handle.eval(function() {
if (data.dom.tagName == "IMG") data.dom.setAttribute("src", data.res[0]); else data.dom.style.backgroundImage = "url(" + data.res[0] + ")";
}.toString() + "()", {
dom:dom,
res:res
});
o.s("ch:cache:url:" + d, res);
o.s("ch:cache:ver:" + d, dom.getAttribute("ch-update"));
canvas = null;
};
}
});
});
});
wind.querySelectorAll("[ch-text]").forEach(function(dom) {
var d;
dom.setAttribute("ch-texted", d = dom.getAttribute("ch-text"));
dom.removeAttribute("ch-text");
addWatcher(d, function(n) {
dom.innerText = n;
});
});
wind.querySelectorAll("[ch-display]").forEach(function(dom) {
var d;
dom.setAttribute("ch-displayed", d = dom.getAttribute("ch-display"));
dom.removeAttribute("ch-display");
var v = dom.getAttribute("ch-display-value");
addWatcher(d, function(n, source) {
var v = dom.getAttribute("ch-display-value");
if (!v || n == v) handle.eval(function() {
data.dom.style.display = "block";
}.toString() + "()", {
dom:dom
}); else handle.eval(function() {
data.dom.style.display = "none";
}.toString() + "()", {
dom:dom
});
});
});
wind.querySelectorAll("iscroll").forEach(function(scroll_view) {
handle.eval(function() {
var scroll_view = data.scroll_view;
if (scroll_view.iscroll) return;
scroll_view.iscroll = true;
var touchBeginTime = 0;
var oldY = 0;
var desktopY = 0;
var desktopOldY = 0;
var dis = 0;
var cacheHeight = 0;
var speed;
scroll_view.style.transition = "transform 0.5s";
scroll_view.ch_toScroll = function(x, y) {
dis = -y;
cacheHeight = -scroll_view.scrollHeight + scroll_view.offsetHeight;
if (cacheHeight > 0) cacheHeight = 0;
if (dis > 0) dis = 0; else if (dis < cacheHeight) dis = cacheHeight;
desktopY = dis;
scroll_view.style.transform = "translate3d(0," + desktopY + "px,0)";
return true;
};
scroll_view.ch_getScroll = function() {
return [ 0, -dis ];
};
scroll_view.addEventListener("mousewheel",function(event) {
if (event.wheelDelta > 0) dis = dis + 200; else dis = dis - 200;
cacheHeight = -scroll_view.scrollHeight + scroll_view.offsetHeight;
if (cacheHeight > 0) cacheHeight = 0;
if (dis > 0) dis = 0; else if (dis < cacheHeight) dis = cacheHeight;
desktopY = dis;
scroll_view.style.transform = "translate3d(0," + desktopY + "px,0)";
},{passive: true});
scroll_view.addEventListener("touchstart", function(event) {
scroll_view.style.transition = "transform 0s";
oldY = event.touches[0].clientY;
cacheHeight = -scroll_view.scrollHeight + scroll_view.offsetHeight;
if (cacheHeight > 0) cacheHeight = 0;
touchBeginTime = new Date().getTime();
desktopOldY = 0;
},{passive: true});
scroll_view.addEventListener("touchmove", function(event) {
desktopOldY = oldY - event.touches[0].clientY | 0;
dis = desktopY - desktopOldY | 0;
if (dis > 0) dis = dis * .3; else if (dis < cacheHeight) dis = cacheHeight - (cacheHeight - dis) * .3;
scroll_view.style.transform = "translate3d(0," + dis + "px,0)";
},{passive: true});
scroll_view.addEventListener("touchend", function(event) {
scroll_view.style.transform = "scale(1)";
scroll_view.style.transition = "transform 0.5s";
var onPull = scroll_view.getAttribute("ch-pull");
if (onPull && typeof data.app[onPull] === "function") if (dis > 0) data.app[onPull]({
posX:0,
posY:dis,
pos:dis + 0
}); else if (dis < cacheHeight) data.app[onPull]({
posX:0,
posY:dis - cacheHeight,
pos:dis + 0
});
speed = desktopOldY / (new Date().getTime() - touchBeginTime) * 1e3 | 0;
if (Math.abs(speed) > 500 && Math.abs(desktopOldY) > 10) dis = dis - speed * .2;
if (dis > 0) dis = 0; else if (dis < cacheHeight) dis = cacheHeight;
desktopY = dis;
scroll_view.style.transform = "translate3d(0," + desktopY + "px,0)";
});
}.toString() + "()", {
scroll_view:scroll_view,
app:app
});
});
wind.querySelectorAll("iscroll-y").forEach(function(scroll_view) {
handle.eval(function() {
var scroll_view = data.scroll_view;
if (scroll_view.iscroll) return;
scroll_view.iscroll = true
var touchBeginTime = 0;
var oldY = 0;
var desktopY = 0;
var desktopOldY = 0;
var dis = 0;
var cacheHeight = 0;
var speed;
var stopPropagation;
scroll_view.style.transition = "transform 0.5s";
scroll_view.ch_toScroll = function(y) {
dis = -y;
cacheHeight = -scroll_view.scrollHeight + scroll_view.offsetHeight;
if (cacheHeight > 0) cacheHeight = 0;
if (dis > 0) dis = 0; 
else if (dis < cacheHeight) dis = cacheHeight; 
desktopY = dis;
scroll_view.style.transform = "translate3d(0," + desktopY + "px,0)";
return true;
};
scroll_view.ch_getScroll = function() {
return -dis; 
};
scroll_view.onmousewheel = function(event) {
if (event.wheelDelta > 0)
dis = dis + 200; 
else
dis = dis - 200; 
cacheHeight = -scroll_view.scrollHeight + scroll_view.offsetHeight;
if (cacheHeight > 0) cacheHeight = 0;
if (dis > 0) dis = 0; 
else if (dis < cacheHeight) dis = cacheHeight; 
desktopY = dis;
scroll_view.style.transform = "translate3d(0," + desktopY + "px,0)";
};
scroll_view.addEventListener('touchstart', function(event) {
scroll_view.style.transition = "transform 0s";
oldY = event.touches[0].clientY;
cacheHeight = -scroll_view.scrollHeight + scroll_view.clientHeight;
if (cacheHeight > 0) cacheHeight = 0;
touchBeginTime = new Date().getTime();
desktopOldY = 0;
stopPropagation = false;
});
scroll_view.addEventListener('touchmove', function(event) {
desktopOldY = (oldY - event.touches[0].clientY) | 0;
dis = ((desktopY - desktopOldY) | 0);
if (dis > 0) 
dis = dis * 0.3; 
else if (dis < cacheHeight) 
dis = cacheHeight - (cacheHeight - dis) * 0.3;
if (!stopPropagation && Math.abs(desktopOldY) > 10 && scroll_view.getAttribute("ch-stoppropagation") !== null) stopPropagation = true;
scroll_view.style.transform = "translate3d(0," + dis + "px,0)";
if (stopPropagation) {
event.preventDefault();
}
});
scroll_view.addEventListener('touchend', function(event) {
scroll_view.style.transform = "scale(1)";
scroll_view.style.transition = "transform 0.5s";
var onPull = scroll_view.getAttribute("ch-pull");
if (onPull && typeof data.app[onPull] === "function")
if (dis > 0) 
data.app[onPull]({ pos: dis }); 
else if (dis < cacheHeight) 
data.app[onPull]({ pos: dis - cacheHeight }); 
speed = desktopOldY / (new Date().getTime() - touchBeginTime) * 1000 | 0;
if (Math.abs(speed) > 500 && Math.abs(desktopOldY) > 10) dis = dis - speed * 0.2;
if (dis > 0) dis = 0; 
else if (dis < cacheHeight) dis = cacheHeight; 
desktopY = dis;
scroll_view.style.transform = "translate3d(0," + desktopY + "px,0)";
});
}.toString() + '()', { scroll_view: scroll_view, app: app })
});
wind.querySelectorAll("iscroll-x").forEach(function(scroll_view) {
handle.eval(function() {
var scroll_view = data.scroll_view;
if (scroll_view.iscroll) return;
scroll_view.iscroll = true;
var touchBeginTime = 0;
var oldX = 0;
var desktopX = 0;
var desktopOldX = 0;
var dis = 0;
var cacheWidth = 0;
var speed;
var stopPropagation;
scroll_view.style.transition = "transform 0.5s";
scroll_view.ch_toScroll = function(x) {
dis = -x;
cacheWidth = -scroll_view.scrollWidth + scroll_view.offsetWidth;
if (cacheWidth > 0) cacheWidth = 0;
if (dis > 0) dis = 0; else if (dis < cacheWidth) dis = cacheWidth;
desktopX = dis;
scroll_view.style.transform = "translate3d(" + desktopX + "px,0px,0px)";
return true;
};
scroll_view.ch_getScroll = function() {
return -dis;
};
scroll_view.addEventListener("mousewheel",function(event) {
if (event.wheelDelta > 0) dis = dis + 200; else dis = dis - 200;
cacheWidth = -scroll_view.scrollWidth + scroll_view.offsetWidth;
if (cacheWidth > 0) cacheWidth = 0;
if (dis > 0) dis = 0; else if (dis < cacheWidth) dis = cacheWidth;
desktopX = dis;
scroll_view.style.transform = "translate3d(" + desktopX + "px,0px,0px)";
},{passive: true});
scroll_view.addEventListener("touchstart", function(event) {
scroll_view.style.transition = "transform 0s";
oldX = event.touches[0].clientX;
cacheWidth = -scroll_view.scrollWidth + scroll_view.offsetWidth;
if (cacheWidth > 0) cacheWidth = 0;
touchBeginTime = new Date().getTime();
desktopOldX = 0;
stopPropagation = false;
},{passive: true});
scroll_view.addEventListener("touchmove", function(event) {
desktopOldX = oldX - event.touches[0].clientX | 0;
dis = desktopX - desktopOldX | 0;
if (dis > 0) dis = dis * .3; else if (dis < cacheWidth) dis = cacheWidth - (cacheWidth - dis) * .3;
if (!stopPropagation && Math.abs(desktopOldX) > 10 && scroll_view.getAttribute("ch-stoppropagation") !== null) stopPropagation = true;
scroll_view.style.transform = "translate3d(" + dis + "px,0px,0px)";
if (stopPropagation) event.stopPropagation();
},{passive: true});
scroll_view.addEventListener("touchend", function(event) {
scroll_view.style.transform = "scale(1)";
scroll_view.style.transition = "transform 0.5s";
var onPull = scroll_view.getAttribute("ch-pull");
if (onPull && typeof data.app[onPull] === "function") if (dis > 0) data.app[onPull]({
pos:dis
}); else if (dis < cacheWidth) data.app[onPull]({
pos:dis - cacheWidth
});
speed = desktopOldX / (new Date().getTime() - touchBeginTime) * 1e3 | 0;
if (Math.abs(speed) > 500 && Math.abs(desktopOldX) > 10) dis = dis - speed * .2;
if (dis > 0) dis = 0; else if (dis < cacheWidth) dis = cacheWidth;
desktopX = dis;
scroll_view.style.transform = "translate3d(" + desktopX + "px,0px,0)";
});
}.toString() + "()", {
scroll_view:scroll_view,
app:app
});
});
wind.querySelectorAll(".ch-ripple").forEach(function(elem) {
handle.eval(function() {
var elem = data.elem;
if (elem.ch_ripple) return;
elem.ch_ripple = true;
elem.addEventListener("touchstart", function(event) {
var x = event.changedTouches[0].clientX;
var y = event.changedTouches[0].clientY;
var el = document.createElement("view");
el.ch_rippleId = event.changedTouches[0].identifier;
el.style.position = "absolute";
var pos = elem.getBoundingClientRect();
var el_left = x - pos.left;
var el_top = y - pos.top;
var n = Math.sqrt(Math.max(el_left * el_left + el_top * el_top, Math.pow(el_left - pos.width, 2) + el_top * el_top, Math.pow(el_left - pos.width, 2) + Math.pow(el_top - pos.height, 2), el_left * el_left + Math.pow(el_top - pos.height, 2))) * 2;
el.style.backfaceVisibility = "hidden";
el.style.perspective = "1000";
el.style.left = el_left - n / 2 + "px";
el.style.top = el_top - n / 2 + "px";
el.style.width = n + "px";
el.style.height = n + "px";
el.style.zIndex = "1";
el.style.padding = "0";
el.style.margin = "0";
el.style.fontSize = "0";
el.style.pointerEvents = "none";
el.style.backgroundColor = "rgba(0,0,0,.15)";
el.style.borderRadius = "50%";
el.style.opacity = ".35";
el.style.transform = "scale(0)";
el.style.transitionDuration = "2s";
el.style.transitionTimingFunction = "cubic-bezier(0.22, 0.61, 0.36, 1)";
elem.appendChild(el);
setTimeout(function() {
el.style.transform = "scale(1.01)";
});
},{passive: true});
elem.addEventListener("touchend", function(event) {
var childs = elem.childNodes;
for (var i = 0; i < childs.length; i++) {
if (childs[i].nodeName != "VIEW") continue;
var el = childs[i];
if (el.ch_rippleId != event.changedTouches[0].identifier) continue;
(function(el) {
el.style.transitionDuration = ".5s";
requestAnimationFrame(function() {
el.style.transform = "scale(1)";
el.style.opacity = "0";
});
setTimeout(function() {
if (el.parentElement) el.parentElement.removeChild(el);
}, 500);
})(el);
}
});
}.toString() + "()", {
elem:elem,
app:app
});
});
wind.querySelectorAll("[bindtap]").forEach(function(dom) {
var d = dom.getAttribute("bindtap");
dom.setAttribute("bindtaped", d);
dom.removeAttribute("bindtap");
handle.eval("data.dom.onclick=" + function(event) {
if (typeof data.app[data.d] === "function") {
data.app[data.d](event, this);
} else {
console.warn("bindtap:未找到方法：" + data.d);
}
}.toString(), {
dom:dom,
app:app,
d:d
});
});
wind.querySelectorAll("[bindlongtap]").forEach(function(dom) {
var d = dom.getAttribute("bindlongtap");
dom.setAttribute("bindlongtaped", d);
dom.removeAttribute("bindlongtap");
handle.eval(function() {
var time;
data.dom.addEventListener("touchstart", function(e) {
time = setTimeout(function() {
if (typeof data.app[data.d] === "function") {
data.app[data.d]({
target:data.dom,
event:e,
touch:e
});
} else {
console.warn("bindlongtap:未找到方法：" + data.d);
}
}, 600);
},{passive: true});
data.dom.addEventListener("touchmove", function(e) {
clearTimeout(time);
},{passive: true});
data.dom.addEventListener("touchend", function(e) {
clearTimeout(time);
});
data.dom.addEventListener("touchcancel", function(e) {
clearTimeout(time);
});
}.toString() + "()", {
dom:dom,
app:app,
d:d
});
});
wind.querySelectorAll("[catchtap]").forEach(function(dom) {
var d = dom.getAttribute("catchtap");
dom.setAttribute("catchtaped", d);
dom.removeAttribute("catchtap");
handle.eval("data.dom.onclick=" + function(event) {
event.stopPropagation();
if (typeof data.app[data.d] === "function") {
data.app[data.d]({
target:data.dom
});
} else {
console.warn("catchtap:未找到方法：" + data.d);
}
}.toString(), {
dom:dom,
app:app,
d:d
});
});
wind.querySelectorAll("ch-switch").forEach(function(dom) {
if (dom.ch_switch) return;
dom.ch_switch = true;
handle.eval(function() {
var dom = data.dom;
var ch_switch2, ch_switch3;
ch_switch2 = document.createElement("div");
ch_switch3 = document.createElement("div");
var color;
color = dom.getAttribute("color") || "#01c8ff";
var height = 20, width = 40;
ch_switch2.style.cssText = "height: " + height + "px;width:" + width + "px;background-color: #eaedf6;border-radius: 50px;transition: 0.3s;padding:2px;";
ch_switch3.style.cssText = "height: 100%;background-color: #ffffff;border-radius: 50%;transition: 0.3s;";
ch_switch2.appendChild(ch_switch3);
dom.appendChild(ch_switch2);
ch_switch2.style.height = ch_switch3.offsetWidth / 2 || 20;
ch_switch3.style.width = height;
dom.onclick = function() {
if (this.first) {
ch_switch3.style.transform = "translateX(0)";
ch_switch2.style.backgroundColor = "#eaedf6";
this.first = false;
if (typeof dom.switch_close === "function") dom.switch_close();
} else {
console.log(ch_switch2.offsetWidth - ch_switch3.offsetWidth - 4);
ch_switch3.style.transform = "translateX(" + (ch_switch2.offsetWidth - ch_switch3.offsetWidth - 4) + "px)";
ch_switch2.style.backgroundColor = color;
this.first = true;
if (typeof dom.switch_open === "function") dom.switch_open();
}
};
dom.open = function() {
if (!this.first) dom.onclick();
};
dom.close = function() {
if (this.first) dom.onclick();
};
dom.getStatus = function() {
if (!this.first) return false; else return true;
};
dom.toggle = function() {
dom.onclick();
};
}.toString() + "()", {
dom:dom
});
});
wind.querySelectorAll("ch-progress").forEach(function(dom) {
if (dom.ch_bar) return;
dom.ch_bar = true;
handle.eval(function() {
var dom = data.dom;
var ch_bar1, ch_bar2;
ch_bar1 = document.createElement("div");
ch_bar2 = document.createElement("div");
ch_bar1.style.cssText = "height: 20px;margin-bottom: 20px;overflow: hidden;background-color: #f5f5f5;border-radius: 4px;-webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,.1);box-shadow: inset 0 1px 2px rgba(0,0,0,.1);";
ch_bar2.style.cssText = "float: left;width: 0%;height: 100%;font-size: 12px;line-height: 20px;color: #fff;text-align: center;background-color: #337ab7;-webkit-box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);-webkit-transition: width .6s ease;-o-transition: width .6s ease;transition: width .6s ease;animation: reverse ch_bar 1.40s linear infinite, animate-positive 1.4s;background-image: -webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image: -o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);-webkit-background-size: 40px 40px;background-size: 40px 40px;transition:0.3s;";
ch_bar1.appendChild(ch_bar2);
dom.appendChild(ch_bar1);
var height, width;
height = dom.getAttribute("height");
width = dom.getAttribute("width");
if (height) ch_bar1.style.height = height;
if (width) ch_bar1.style.width = width;
dom.progress = function(percentage) {
ch_bar2.style.width = percentage + "%";
};
}.toString() + "()", {
dom:dom
});
});
wind.querySelectorAll("ch-slider").forEach(function(dom) {
if (dom.ch_slider) return;
dom.ch_slider = true;
handle.eval(function() {
var dom = data.dom;
var d1 = document.createElement("div");
d1.style.position = "relative";
var d2 = document.createElement("div");
d2.setAttribute("style", "width:100%;background-color:#dddddd;height:5px;position: absolute;left:0;top:0;");
var d3 = document.createElement("div");
d3.setAttribute("style", "width:100%;background-color:#ff4081;height:5px;position: absolute;left:0;top:0;width:0;");
var d4 = document.createElement("div");
d4.setAttribute("style", "border-radius:50%;width:10px;height:10px;background-color:#ff4081;position: absolute;top:-3px;left:-5px;transition:transform 0.3s;");
d1.appendChild(d2);
d1.appendChild(d3);
d1.appendChild(d4);
dom.appendChild(d1);
var oldX = 0;
var current_X = 0;
var ch_slider = dom;
var slider = d1;
var dot = d4;
var bar = d2;
var active_bar = d3;
var x;
ch_slider.addEventListener("touchstart", function(e) {
dot.style.transform = "scale(1.5)";
oldX = e.targetTouches[0].clientX;
},{passive: true});
ch_slider.addEventListener("touchmove", function(e) {
x = current_X + e.targetTouches[0].clientX - oldX;
if (x < 0) x = 0;
if (x > bar.offsetWidth) x = bar.offsetWidth;
dot.style.left = x - 5 + "px";
active_bar.style.width = x + "px";
},{passive: true});
ch_slider.addEventListener("touchend", function(e) {
dot.style.transform = "scale(1)";
current_X = x;
});
}.toString() + "()", {
dom:dom
});
});
return true;
},get_App: function() {
return env.app;
},get_Pid: function() {
return env.pid;
},get_deviceId: function() {
return o.md5(o.deviceId);
},
iniGet: function(fn, k, defaul) {
if (typeof defaul === "undefined") defaul = null;
var that = this;
this.storage.get(k, function(res) {
if (res === null) {
that.storage.set(k, defaul);
fn(defaul);
return
}
fn(res);
});
return "asyn";
},
iniSet: function(fn, k, v) {
if (typeof v === "undefined") v = null;
this.storage.set(k, v, function(res) {
fn(v);
});
return v;
},
storage: {
get: function(k, fn) {
o.g("ch:appdata:" + env.app + ":" + k,fn);
return "asyn";
},
set: function(k, v, fn) {
o.s("ch:appdata:" + env.app + ":" + k, v, fn);
return v;
},
keys: function(k, fn, finish) {
o.i("ch:appdata:" + env.app + ":" + k, function(k,v) {
if(fn)fn(v, k.substr(("ch:appdata:" + env.app + ":").length));
},finish);
return "asyn";
},
clear: function(fn) {
o.d(function(){
if(fn)fn();
});
},
},getApiVersion:function(fn){
this.getAppVersion(o.config.OSAppId, function(data) {
fn(data);
});
return "asyn"; 
},getAppVersion: function(appid, fn) {
o.g("ch:app:ver:" + appid,fn);
return "asyn";
},getVersion: function(fn) {
o.g("ch:app:ver:" + this.get_App(),fn);
return "asyn";
},app:{
icon: function(app, fn) {
o.g("ch:app:json:" + app, function(v) {
fn(v);
});
return "asyn";
},
getAppDetail: function(app, fn) {
o.g("ch:app:json:" + app, function(v) {
fn(v);
});
return "asyn";
},
getInstalledList: function(fn, finish) {
return o.core.getInstalledList(fn, function() {
finish();
});
return "asyn";
},
defaultInstall:function(app,fn){
return o.core.defaultInstall(app,fn);
},
install: function(app, fn) {
o.core.updateApp(app,function(res){
if(res)o.core.triggerAll("onChangeApp");
if(fn)fn(res);
});
return "asyn";
},
isInstall: function(app, fn) {
if(!fn)return;
o.g("ch:app:json:" + app, function(v) {
if(v)
fn(true);
else
fn(false);
});
return "asyn";
},
uninstall: function(app, fn) {
return o.core.uninstall(app,fn);
},
openappUpdate: function(app, option, finish) {
var that=this;
o.core.checkUpdate(app, function(r) {
if (r) {
o.app.update(app, function(r) {
if (r) {
that.openapp(app, option, finish); 
} else {
console.log("更新失败！！");
}
});
} else that.openapp(app, option, finish); 
})
},
openapp:function(app, option, finish){
option=option||{};
if(finish)option.success=finish;
option.referer={
app:env.app,
pid:env.pid
}
o.core.openapp(app,option);
},startService:function(app,option){
option=option||{};
option.silent=true;
option.referer={
app:env.app,
pid:env.pid
};
o.core.openapp(app,option);
},
},reload:function(){
o.core.reload(env.pid);
},close:function(option){
return o.core.closeApp(env.pid,option);
},update:function(fn){
o.core.updateApp(env.app,function(res){
fn(res);
});
},trigger: function(eventName, source) { 
return o.core.trigger(eventName,source);
},triggerAll:function(eventName, source) { 
return o.core.triggerAll(eventName, source);
},
sendMessage:function(id, source) { 
return o.core.sendMessage(id,source,{
app:env.app,
pid:env.pid
});
},vibrate: function(t) { 
handle.eval("navigator.vibrate("+t+")");
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
navigator.vibrate && navigator.vibrate(t);
return true;
},landscape:function(){
env.screenOrientation=1;
o.core.landscape();
},portrait:function(){
env.screenOrientation=0;
o.core.portrait();
},reboot:function(type){
if(type===true){
window.location.reload();
return;
}
console.log("webAPPOS: 系统开始进行软重启！");
o.soft_reboot();
},__systemUpdate: function() {
localStorage.setItem("ch:main",null);
return true;
},__systemClear: function() {
o.c(function(){
window.location.reload();
});
return true;
},copy: function(text) {
var textarea = document.createElement("textarea");
textarea.style.position = "absolute";
textarea.style.top = "-9999px";
textarea.style.left = "-9999px";
textarea.innerHTML = text;
textarea.setAttribute("readonly", "");
document.body.appendChild(textarea);
textarea.select();
document.execCommand("copy", false, null);
textarea.parentNode.removeChild(textarea);
return true;
},
get_Device: function() { 
if (o.flag.is_PC) return 1;
if (o.flag.is_Android) return 2;
if (o.flag.is_iOS) return 3;
},
get_Platform: function() { 
return o.flag;
},
is_IOS: function() {
return o.flag.is_iOS;
},
is_Android: function() {
return o.flag.is_Android;
},
is_PC: function() {
return o.flag.is_PC;
},
is_Yiban: function() {
return o.flag.is_Yiban;
},
is_App: function() {
return o.flag.is_App;
},
exit: function(){
o.core.exit();
return false;
},
battery: function(func) {
navigator.getBattery().then(function(data) {
if (typeof func === 'function') func(data);
});
return 'asyn';
},get_originURL: function() {
return o.originURL;
},request: function(options) { 
var formatParams = function(data) {
var arr = [];
for (var name in data) arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
return arr.join("&");
};
options = options || {};
options.type = (options.type || "GET").toUpperCase();
options.dataType = options.dataType || "text";
options.header = options.header || {};
if(options.load)o.core.showLoading(options.load);
if(options.cacheId){
o.g("ch:appdata:"+env.app+":requestCache_"+options.cacheId,function(v){
if(v)options.success.apply(null,v);
});
}
var params = "";
if (typeof options.data === "object") params = formatParams(options.data);
else params = options.data;
if (window.XMLHttpRequest) var xhr = new XMLHttpRequest();
else var xhr = new ActiveXObject('Microsoft.XMLHTTP'); 
xhr.onreadystatechange = function() {
if (xhr.readyState == 4) {
var ajaxtext = xhr.responseText;
var type = xhr.getResponseHeader("Content-Type");
var status = xhr.status;
if (status >= 200 && status < 304) {
try {
ajaxtext = JSON.parse(ajaxtext); 
}catch(e){
if (options.dataType == "json" || type && type.indexOf("json") != -1){
options.fail && options.fail({status:status});
options.error && options.error({status:status});
options.complete && options.complete();
if(options.load)o.core.hideLoading();
return;
}
}
var result=[ajaxtext, {
status:status,
header:xhr.getAllResponseHeaders(),
}];
if(options.cacheId)
o.s("ch:appdata:"+env.app+":requestCache_"+options.cacheId,result);
options.success && options.success.apply(null,result);
}else{
options.error && options.error({status:status});
options.fail && options.fail({status:status});
}
options.complete && options.complete();
if(options.load)o.core.hideLoading();
}
};
if (options.type == "GET") {
if (params) xhr.open("GET", options.url + "?" + params, true);
else xhr.open("GET", options.url, true);
for (var op in options.header) xhr.setRequestHeader(op, options.header[op]);
xhr.setRequestHeader("inglut-device", o.deviceId);
xhr.setRequestHeader("inglut-appkey", env.key);
xhr.send(null);
} else if (options.type == "POST") {
xhr.open("POST", options.url, true);
xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
for (var op in options.header) xhr.setRequestHeader(op, options.header[op]);
xhr.setRequestHeader("inglut-device", o.deviceId);
xhr.setRequestHeader("inglut-appkey", env.key);
xhr.send(params);
}
return xhr;
},getAppKey:function(fn){
o.g("ch:app:key:" + env.app, function(v) {
fn && fn(v);
});
},console: function() {
return console.log;
},NavigateBar_Hide: function() {
env.appTitle.style.display="none";
env.navigateBar = false;
},
NavigateBar_Show: function() {
env.appTitle.style.display="";
env.navigateBar = true;
},
show:function(){
o.core.showApp(env.pid);
},
hide: function() { 
o.core.hideApp(env.pid);
},
get_UA: function() {
return window.navigator.userAgent;
},socket: function(data, callback) {
var that = this;
var id = o.randomChar();
o.socket.link(function() {
o.socket.send({
id: id,
type: "message",
pid: env.pid,
appid: env.app,
appkey: env.key,
device: o.deviceId,
source: data,
user: o.auth.info ? o.auth.info.user : null,
userKey: o.auth.info ? o.auth.info.key : null,
});
if (typeof callback === "function") o.socket.queue.push({id: id, callback: callback})
});
},template: function(code, data, fn) {
if (!code) return false;
if(!o.core.is_TemplateJS){
o.core.importJS("template",function(){
o.core.is_TemplateJS=true;
var s = JSON.parse(handle.stringify(data));
requestAnimationFrame(function() {
var aa = template.compile(code);
fn && fn(aa(s));
});
})
}else{
var s = JSON.parse(handle.stringify(data));
requestAnimationFrame(function() {
var aa = template.compile(code);
fn && fn(aa(s));
});
}
},scan:function(fn){
return o.core.scan(fn);
},
location: function(fn) {
return o.core.location(fn);
},
uuid: function(fn) {
return o.core.uuid(fn);
},
deviceInfo: function(fn) {
return o.core.device(fn);
},phone: function(number) {
return o.core.phone(number);
},history_delete: function() {
console.warn("WebAPPOS: "+env.app+"应用执行了history_delete");
o.history.delete();
return true;
},history_add: function() {
console.warn("WebAPPOS: "+env.app+"应用执行了history_add");
o.history.forward();
return true;
},AppSignature:function(){
return o.core.AppSignature();
},asynUpdate:function(){
return o.core.asynUpdate(env.pid);
},auth:function(){
if (o.auth.info)
return {
res: true,
user: o.auth.info.user,
key: o.auth.info.key,
info: o.auth.info.info,
};
else
return { res: false };
},appLogin: function(key, fn) {
o.auth.login(key, function(res) {
if (res) {
o.core.toast("登录成功！");
fn(true);
} else {
o.core.toast("登录验证失败！");
fn(false);
}
});
},notification:function(option){
o.core.notification(option,env);
},go_YBAuth: function() {
console.log("正在跳转易班登录...");
o.core.gotoURL("https://openapi.yiban.cn/oauth/authorize?client_id=34456451e9f15e5e&redirect_uri="+encodeURIComponent("http://f.yiban.cn/iapp439084")); 
return true;
},gotoURL:function(url) {
if(env !== o.pcbApp)return false;
o.core.gotoURL(url);
},
};
};
o.core={
checkUpdate:function(app,fn){
o.g("ch:app:ver:"+app,function(v){
if(!v){
fn(true);
return;
}
o.request(o.config.check,"app="+app+"&v="+v+"&device="+o.deviceId,function(s){
try{s=JSON.parse(s);}catch(e){}
if(!s)return fn(null);
var newVersion = s.data.version|0;
if(newVersion>v|0)
fn(true);
else
fn(false);
});
});
},updateApp:function(app,fn){
o.request(o.config.version,"prog=" + app + "&device=" + o.deviceId,function(s){
try{s=JSON.parse(s);}catch(e){}
if(s && s.ver){
s=s.ver;
var code_html,code_js;
var finish=function(){
o.s("ch:app:ver:" + app, s.version|0);
o.s("ch:app:json:"+ app, s.data); 
o.s("ch:app:key:" + app, s.key); 
o.s("ch:applist:" + app, {
installTime: new Date().getTime(), 
});
if(fn)fn(true);
};
o.request(s.html,null,function(h){
if(!h){if(fn)fn(false);return;}
o.s("ch:app:html:"+app,h);
code_html=h;
if(code_js)finish();
});
o.request(s.js,null,function(h){
if(!h){if(fn)fn(false);return;}
o.s("ch:app:js:"+app,h);
code_js=h;
if(code_html)finish();
});
}else if(fn)fn(false);
});
},asynUpdate:function(pid){
var that=this;
var app=this.Pid_ToApp(pid);
if(!app)return false;
this.checkUpdate(app,function(fn){
if(fn){
that.updateApp(app,function(fn){
if(fn){
var option=o.core.get_AppPcb(pid).option;
option=option||{};
o.core.openapp(app,{
silent:true,
success:function(res){
if(!option.silent)
o.core.showApp(res.pid,{
animation:false,
});
o.core.closeApp(pid);
}
});
console.log("WebAPPOS: "+app+"小程序已经更新！");
}else{
o.core.toast("小程序更新失败！");
console.warn("WebAPPOS: "+app+"小程序更新失败！");
}
});
}
});
},Pid_ToApp:function(pid){
for(var i in o.pcb)
if(o.pcb[i].pid==pid&&o.pcb[i].iframe)return o.pcb[i].app;
return false;
},is_AppRun:function(app){
for(var i in o.pcb)
if(o.pcb[i].app==app&&o.pcb[i].iframe)return true;
return false;
},is_PidRun:function(pid){
for(var i in o.pcb)
if(o.pcb[i].pid==pid&&o.pcb[i].iframe)return true;
return false;
},get_AppPcb:function(pid){
for(var i in o.pcb)
if(o.pcb[i].iframe&&o.pcb[i].pid==pid)
return o.pcb[i];
},showApp:function(pid,option){
for(var i in o.pcb)
if(o.pcb[i].pid==pid){
var pcb=o.pcb[i];
o.history.push(o.pcb[i].app);
o.pcbList.push({index:i,pid:pid});
o.pcbApp=pcb;
pcb.appDiv.style.zIndex=o.zIndex++;
pcb.appDiv.style.display="";
option=option||{};
if(pcb.option.event)option.event=pcb.option.event;
if(pcb.option.posX)option.posX=pcb.option.posX;
if(pcb.option.posY)option.posY=pcb.option.posY;
if(option.animation!==false){
if(typeof option.posX!=="undefined"&&typeof option.posY!=="undefined"){
pcb.appDiv.style.transformOrigin=option.posX+"px "+option.posY+"px";
}else{
pcb.appDiv.style.transformOrigin="";
if(option.event){
var e=option.event;
if(!isNaN(e.clientX)&&!isNaN(e.clientY)){
pcb.appDiv.style.transformOrigin=e.clientX+"px "+e.clientY+"px";
}else if(typeof e.touches !=="undefined"){
if(e.touches.length){
pcb.appDiv.style.transformOrigin=e.touches[0].clientX+"px "+e.touches[0].clientY+"px";
}
}
}
}
pcb.appDiv.style.transform="scale(0.2)";
pcb.appDiv.style.opacity="0.1";
requestAnimationFrame(function(){
requestAnimationFrame(function(){
pcb.appDiv.style.transform="";
pcb.appDiv.style.opacity="";
});
});
}
return true;
}
return false;
},hideApp:function(pid,option){
for(var i in o.pcb)
if(o.pcb[i].pid==pid){
var pcb=o.pcb[i];
if(pcb.appDiv.style.display==="none")return;
option=option||{};
o.history.delete();
if(option.animation!==false){
var appDiv=pcb.appDiv;
appDiv.style.transform="scale(0.2)";
appDiv.style.opacity="0.1";
requestAnimationFrame(function(){
setTimeout(function(){
appDiv.style.display="none";
if(option.success)option.success();
},200);
});
}else{
pcb.appDiv.style.display="none";
if(option.success)option.success();
}
}
},openapp:function(app,option){
option=option||{};
var pid = o.randomChar();
var pcb={};o.pcb.push(pcb);
pcb.pid=pid;
pcb.app=app;
pcb.option=option;
pcb.navigateBar=true;
pcb.screenOrientation=0;
o.core.portrait();
var appDiv=pcb.appDiv=c("div");
appDiv.className="appDiv";
appDiv.style.display="none";
if(!option.silent)
this.showApp(pid,option);
var appTitle=pcb.appTitle=c("div");
appTitle.className="appTitle";
pcb.changeColor=function(color){
pcb.color=color;
color = color || "#3f51b5";
appTitle.style.backgroundColor = color;
if(o.pcbApp==pcb)o.core.changeColor(color);
};
var appTitle_Back=c("div");
appTitle_Back.className="appTitle_Back";
appTitle_Back.innerHTML='<svg style="width:26px;height:26px;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M128.512 512l336.969143 336.969143-51.712 51.712L0 486.912 413.769143 73.142857l51.712 51.712L151.478857 438.857143H1024v73.142857z" fill="#ffffff"></path></svg>';
appTitle_Back.addEventListener("touchstart",function(){
appTitle_Back.className="appTitle_Back appTitle_Back_Active";
});
appTitle_Back.addEventListener("click",function(){
window.history.go(-1);
});
appTitle_Back.addEventListener("touchend",function(){
appTitle_Back.className="appTitle_Back";
});
var appTitle_Text=c("div");
appTitle_Text.className="appTitle_Text";
appTitle_Text.innerText="标题";
pcb.changeTitle=function(text){
pcb.title=text;
appTitle_Text.innerText = text;
if(o.pcbApp==pcb)o.core.changeTitle(text);
};
var appFrame=c("iframe");
pcb.iframe=appFrame;
appFrame.style.display="none";
appFrame.className="appFrame";
appFrame.scrolling = "no";
appFrame.marginWidth = '0';
appFrame.marginHeight = '0';
var appTitle_More=c("div");
appTitle_More.className="appTitle_More";
var appTitle_More_button=c("div");
appTitle_More_button.className="appTitle_More_button";
appTitle_More_button.innerHTML='<svg style="width:40px;height:24px;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M111.304348 623.304348a111.304348 111.304348 0 1 1 0-222.608696 111.304348 111.304348 0 0 1 0 222.608696z m801.391304 0a111.304348 111.304348 0 1 1 0-222.608696 111.304348 111.304348 0 0 1 0 222.608696z m-400.695652 44.521739a155.826087 155.826087 0 1 1 0-311.652174 155.826087 155.826087 0 0 1 0 311.652174z" data-spm-anchor-id="a313x.7781069.0.i1" fill="#ffffff"></path></svg>';
appTitle_More.appendChild(appTitle_More_button);
appTitle_More_button.addEventListener("touchstart",function(){
appTitle_More_button.style.backgroundColor="rgba(0,0,0,0.2)";
});
appTitle_More_button.addEventListener("click",function(){
o.core.openAppMenu(pcb);
});
appTitle_More_button.addEventListener("touchend",function(){
appTitle_More_button.style.backgroundColor="rgba(255,255,255,0.2)";
});
appTitle.appendChild(appTitle_Back);
appTitle.appendChild(appTitle_Text);
appTitle.appendChild(appTitle_More);
appDiv.appendChild(appTitle);
var appLoad=c("div");
appLoad.className="appLoad";
appDiv.appendChild(appLoad);
appList.appendChild(appDiv);
o.g("ch:app:html:"+app,function(h){
o.g("ch:app:js:"+app,function(j){
var needhideLoading;
var init_app=function(html,js){
appFrame.onload = function() {
o.g("ch:app:key:" + app, function(key){
if(!key){
o.c();
o.core.closeApp(pid);
o.core.toast("小程序加载异常！");
if(option.fail)option.fail();
console.warn("WebAPPOS: "+app+"小程序加载异常！");
return;
}
pcb.key=key;
var ed = document.all ? appFrame.contentWindow.document : appFrame.contentDocument;
var sc = ed.createElement("script");
sc.type = "text/javascript";
try { sc.appendChild(ed.createTextNode(o.data.jsapi)) } catch (ex) { sc.text = o.data.jsapi };
ed.body.appendChild(sc);
pcb.handle=appFrame.contentWindow.app('<style>' + o.data.appStyle + '</style>' + html,js,pcb);
appDiv.removeChild(appLoad);
appFrame.style.display="block";
if(needhideLoading)o.core.hideLoading();
if(option.success)option.success({
pid:pid,
});
});
};
appFrame.src = "none.html";; 
appDiv.appendChild(appFrame);
};
if(h&&j){
init_app(h,j);
}else{
needhideLoading=true;
o.core.showLoading("正在加载小程序...");
o.core.updateApp(app,function(fn){
if(fn){
o.g("ch:app:html:"+app,function(h){
o.g("ch:app:js:"+app,function(j){
init_app(h,j);
});
});
}else{
o.core.closeApp(pid);
o.core.toast("小程序加载失败，请重试！");
if(option.fail)option.fail();
console.warn("WebAPPOS: "+app+"小程序加载失败，请重试！");
}
});
}
});
});
},closeApp:function(pid,option){
if(o.pcbList.length==0)return false;
option = option || [];
for(var pcbList in o.pcbList){
if(o.pcbList[pcbList].pid===pid){
var delete_index=o.pcbList[pcbList].index;
var delete_pcb=o.pcb[delete_index];
if(!delete_pcb.iframe)return false;
this.hideApp(pid,{
success:function(){
delete_pcb.appDiv.parentNode.removeChild(delete_pcb.appDiv);
}
});
delete_pcb.iframe=null;
o.pcbList.splice(pcbList, 1);
if(o.pcbList.length==0)
o.pcbApp=null;
else o.pcbApp=o.pcb[o.pcbList[o.pcbList.length-1].index];
return true;
}
}
return false;
},closeAppId:function(appid,option){
for(var i in o.pcb){
if(o.pcb[i].iframe&&o.pcb[i].app==appid)this.closeApp(o.pcb[i].pid,option);
}
return true;
},uninstall:function(app,fn){
if(!app||app.length!=40)return false;
this.closeAppId(app);
o.i("ch:applist:" + app, function(k){o.d(k)});
o.i("ch:app:js:" + app, function(k){o.d(k)});
o.i("ch:app:html:"+ app, function(k){o.d(k)});
o.i("ch:app:json:"+ app, function(k){o.d(k)});
o.i("ch:app:ver:" + app, function(k){o.d(k)});
o.i("ch:app:key:" + app, function(k){o.d(k)});
o.i("ch:appdata:" + app, function(k){o.d(k)},fn);
return "aysn";
},reload:function(pid,option){
for(var pcbList in o.pcbList){
if(o.pcbList[pcbList].pid===pid){
var app=o.pcb[o.pcbList[pcbList].index].app;
this.closeApp(pid);
this.openapp(app,option);
return true;
}
}
return false;
},landscape:function(){
if (o.flag.screenOrientation == 1)return true;
o.flag.screenOrientation = 1;
if (o.flag.is_App){
this.jsBridgeApi("landscape",{});
return;
}
o.work.style.width = window.innerHeight + 'px';
o.work.style.height = window.innerWidth + 'px';
var offset = (window.innerHeight - window.innerWidth) / 2 + 'px';
o.work.style.transform = "rotate(90deg) translate3d(" + offset + "," + offset + ",0)";
},portrait:function(){
if (o.flag.screenOrientation == 0)return true;
o.flag.screenOrientation = 0;
if (o.flag.is_App){
this.jsBridgeApi("portrait",{});
return;
}
o.work.style.width = window.innerWidth + 'px';
o.work.style.height = window.innerHeight + 'px';
o.work.style.transform = "";
},getInstalledList:function(fn, finish) { 
o.i("ch:applist:", function(k,v) {fn(k.substr("ch:applist:".length),v);},finish); 
},defaultInstall:function(app,fn){
var that = this;
this.isInstall(app, function(r) {
if (r){if(fn)fn(true);return;}
that.updateApp(app, fn);
});
},isInstall: function(app, fn) {
o.g("ch:app:json:" + app, function(v) {
if (v) fn(true);
else fn(false);
});
return "asyn";
},cacheFile:function(url,fn){
o.g("ch:cdn:" + url, function(v) {
if(v)return fn(v);
var a = new XMLHttpRequest();
a.open('GET', url, true);
a.onreadystatechange = function() {
if (a.readyState == 4 && a.status == 200 || a.status == 304) {
o.s("ch:cdn:" + url, a.responseText);
o.s("ch:cdninfo:" + url, {
createTime: new Date().getTime()
}); 
fn(a.responseText); 
}
};
a.send();
});
},importJS:function(path,fn){
var that=this;
this.cacheFile(this.checkCDN(path),function(file){
that.loadJS(file);
fn(true);
});
},loadJS:function(code) {
var s = document.createElement("script");
s.type = "text/javascript";
try { s.appendChild(document.createTextNode(code)) } catch (ex) { s.text = code };
document.body.appendChild(s);
},loadCSS:function(code) {
var s = document.createElement("style");
s.type = "text/css";
try { s.appendChild(document.createTextNode(code)) } catch (ex) { s.text = code };
document.body.appendChild(s);
},checkCDN: function(file) { 
switch (file) {
case "jq":
case "jQuery":
case "jquery":
case "jquery.min.js":
return "/static/cdn/jquery.min.js";
case "bootstrap.min.css":
return "https://cdn.bootcss.com/twitter-bootstrap/4.3.1/css/bootstrap.min.css";
case "bootstrap.min.js":
return "https://cdn.bootcss.com/twitter-bootstrap/4.3.1/js/bootstrap.min.js";
case "template": 
return "/static/cdn/art-template.min.js";
default:
return file;
}
},jsBridgeApi:function(action,arg,callback){
arg=arg||{};
if(typeof callback==="function"){
randomFunc="jsApi_"+Math.random().toString().substr(2)+new Date().getTime();
var fn=callback;
window[randomFunc]=function(){
window[randomFunc]=null;
fn.apply(null,arguments);
}
callback=randomFunc;
}else callback=callback||null;
webAppBridge.jsApi(JSON.stringify({
action:action,
arg:arg,
callback:callback,
}));
},scan:function(fn){
if(!fn)return false;
if(o.flag.is_App){
this.jsBridgeApi("QRscan",{},function(res){
fn(res);
});
return true;
}else if(o.flag.is_Yiban){
o.list.getScanResult.push(function(res){
fn({
action:"QRscan",
value:{
result:true,
value:res
}
});
});
if (o.flag.is_Android) window.local_obj.encode();
if (o.flag.is_iOS) window.encode();
return true;
} else {
fn({
action:"QRscan",
value:{
result:true,
value:prompt("此设备不支持扫一扫，可手动输入二维码：")
}
});
return false;
}
},location:function(fn){
if(!fn)return false;
if (o.flag.is_App){
this.jsBridgeApi("location",{},function(res){
fn(res);
});
return true;
}else if (o.flag.is_Yiban){
o.list.yibanhtml5location.push(function(res){
var result;
try{
result=JSON.parse(res);
}catch(e){
fn({
action:"location",
value:{
result:false,
ErrCode:0,
ErrInfo:res
}
});
return;
}
fn({
action:"location",
value:{
result:true,
longitude:result.longitude,
latitude:result.latitude,
accuracy:result.accuracy,
time:result.time,
address:result.address,
}
});
})
if (o.flag.is_Android)window.local_obj.yibanhtml5location();
if (o.flag.is_iOS) window.ios_yibanhtml5location();
return true;
}else{
fn({
action:"location",
value:{
result:false,
ErrCode:-1,
ErrInfo:"当前浏览器环境不支持定位！",
}
});
return false;
}
},
mobile_api: function(json,fn) {
if(!fn)return false;
if(!o.flag.is_Yiban)return false;
if (o.flag.is_Android)window.local_obj.js2mobile(JSON.stringify(json));
if (o.flag.is_iOS)window.js2mobile(JSON.stringify(json));
return true;
},
uuid: function(fn) {
if(!fn)return false;
if (o.flag.is_App){
this.jsBridgeApi("uuid",{},function(res){
fn(res);
});
return true;
}else if (o.flag.is_Yiban){
o.list.onJSApiCallback.push(function(res){
fn({
action:"uuid",
value:{
result:true,
uuid:JSON.parse(res).value
}
});
});
this.mobile_api({action:'uuid',params:{},callback:'onJSApiCallback'},fn);
return true;
}else
return false;
},
device: function(fn) {
if (o.flag.is_App){
this.jsBridgeApi("device",{},function(res){
fn(res);
});
return true;
}else if (o.flag.is_Yiban){
o.list.onJSApiCallback.push(function(res){
var result=JSON.parse(res);
fn({
action:"device",
value:{
result:true,
appVersion:result.appVersion,
deviceModel:result.deviceModel,
systemVersion:result.systemVersion
}
});
});
this.mobile_api({action:'yiban_device',params:{},callback:'onJSApiCallback'},fn);
return true;
}else
return false;
},
phone:function(number,fn) {
if(o.flag.is_App){
this.jsBridgeApi("phone",{},function(res){
fn(res);
});
return true;
}else if(o.flag.is_Yiban){
if (o.flag.is_Android)window.local_obj.phone(number);
if (o.flag.is_iOS)window.phone(number);
fn({
action:"phone",
value:{
result:true,
}
});
return true;
}else return false;
},
mail: function(fn) {
if(o.flag.is_App) {
fn({
action:"phone",
value:{
result:false,
}
});
}else if(o.flag.is_Yiban) {
if(o.flag.is_Android) window.local_obj.mail(email);
if(o.flag.is_iOS) window.mail(email);
fn({
action:"phone",
value:{
result:true,
}
});
return true;
}else{
return false;
}
},exit:function(){
if(o.flag.is_Yiban) {
if (o.flag.is_Android) window.local_obj.back()
if (o.flag.is_iOS) back();
} else if (o.flag.is_App) {
this.jsBridgeApi("back");
}
},AppSignature:function(fn){
if (o.is_App)
this.jsBridgeApi("signature",{},fn);
else
return false
return true;
},changeTitle:function(title){
document.title = title?title:'\u200E';
},changeColor:function(color){
color = color.replace("#", "0x");
o.colorInput.value = color;
if (o.flag.is_Yiban) {
var iframe=document.createElement('iframe');
iframe.style.visibility='hidden';
iframe.style.width='1px';
iframe.style.height='1px';
iframe.onload=function(){
setTimeout(function(){
document.body.removeChild(iframe);
},0);
};
document.body.appendChild(iframe);
o.history.refresh();
}
},toast: function(text, time) {
if (typeof time !== "number") time = 2000;
var d1, d2;
d1 = document.createElement("div");
d2 = document.createElement("span");
d1.className = "toast";
d1.appendChild(d2);
d2.innerText = text;
o.work.appendChild(d1);
d1.style.transition = "transform 0.5s,opacity 0.5s"; 
requestAnimationFrame(function() {requestAnimationFrame(function() {
d1.style.transform = "translate3d(-50%,-40px,0)"; 
d1.style.opacity = "1"; 
})});
setTimeout(function() {
d1.style.opacity = "0";
setTimeout(function() {
if (d1.parentNode) d1.parentNode.removeChild(d1);
}, 500);
}, time);
},alert: function(text, title, button, fn, content) {
if (typeof text === "object") {
var option = text;
text = option.text || "";
title = option.title || "";
button = option.button || ["确认"];
fn = option.click || null;
content = option.content || [];
}
text = text || "";
title = title || "";
button = button || ["确认"];
fn = fn || null;
content = content || [];
var d1 = document.createElement("div");
d1.className = "alert-hover";
var d2 = document.createElement("div");
d2.className = "alert";
var closeAlert = function() {
d2.style.transform = "scale(0.01)";
d1.style.opacity = "0";
setTimeout(function() {
if (d1.parentNode) d1.parentNode.removeChild(d1);
}, 200);
};
var titleDiv = o.document.createElement("div");
var contentDiv = o.document.createElement("div");
var buttonDiv = o.document.createElement("div");
titleDiv.className = "alert-title";
contentDiv.className = "alert-content";
buttonDiv.className = "alert-button";
titleDiv.innerText = title;
contentDiv.innerText = text;
for (var i in content) {
(function(i) {
var cont = content[i];
if (typeof cont !== "object") return;
if (cont.type == "br") {
var textContent = o.document.createElement("br");
contentDiv.appendChild(textContent);
}
if (cont.type == "span") {
var textContent = o.document.createElement("span");
textContent.setAttribute("style", cont.style);
textContent.innerText = cont.text;
contentDiv.appendChild(textContent);
} else if (cont.type == "text") {
var textContent = o.document.createElement("view");
textContent.setAttribute("style", cont.style);
textContent.innerText = cont.text;
contentDiv.appendChild(textContent);
} else if (cont.type == "radio") {
var radioList = cont.list || [];
for (var i2 in radioList) {
var cont2 = radioList[i2];
var textContent = o.document.createElement("div");
textContent.className = "alert-radio";
textContent.innerText = cont2;
contentDiv.appendChild(textContent);
(function(i2) {
textContent.onclick = function() {
if (cont.click({id: i2})!== false) {
closeAlert();
}
};
})(i2);
}
} else if (cont.type == "checkbox") {
var radioList = cont.list || [];
for (var i2 in radioList) {
var cont2 = radioList[i2];
var textContent = document.createElement("div");
textContent.className = "alert-checkbox";
textContent.innerText = cont2;
contentDiv.appendChild(textContent);
(function(i2) {
textContent.onclick = function() {
if (cont.click({id: i2})!== false) {
closeAlert();
}
};
})(i2);
}
} else if (cont.type == "input") {
var textContent = document.createElement("input");
textContent.className = "alert-input";
textContent.setAttribute("type", cont.inputType || "text");
textContent.setAttribute("value", cont.value || "");
textContent.setAttribute("placeholder", cont.placeholder || "");
contentDiv.appendChild(textContent);
}
})(i);
};
d2.appendChild(titleDiv);
d2.appendChild(contentDiv);
if (button) {
for (var bitem in button) {
var bi = document.createElement("div");
bi.innerText = button[bitem];
bi.className = "alert-button-item";
(function(bitem) {
bi.onclick = function() {
requestAnimationFrame(function() {
if (typeof fn === "function") {
fn({
id: bitem
});
}
closeAlert();
});
};
})(bitem);
buttonDiv.appendChild(bi);
}
}
d2.appendChild(buttonDiv);
d1.appendChild(d2);
o.work.appendChild(d1);
requestAnimationFrame(function() {
requestAnimationFrame(function() {
d1.style.opacity = "1";
d2.style.transform = "translate3d(0,-50%,0)";
});
});
},showLoading:function(text, time) {
if (typeof text === "undefined") text = '加载中...';
! function() {
var d1, d2, d3;
d1 = document.createElement("div");
d2 = document.createElement("div");
d2.innerHTML='<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3842" data-spm-anchor-id="a313x.7781069.0.i1" width="200" height="200"><path d="M97.768844 509.427136m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3843"></path><path d="M97.768844 519.718593m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3844"></path><path d="M97.768844 530.01005m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3845"></path><path d="M97.768844 540.301508m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3846"></path><path d="M97.768844 545.447236m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3847"></path><path d="M97.768844 555.738693m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3848"></path><path d="M97.768844 566.030151m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3849"></path><path d="M102.914573 576.321608m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3850"></path><path d="M102.914573 586.613065m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3851"></path><path d="M102.914573 591.758794m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3852"></path><path d="M108.060302 602.050251m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3853"></path><path d="M108.060302 612.341709m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3854"></path><path d="M113.20603 622.633166m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3855"></path><path d="M113.20603 627.778894m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3856"></path><path d="M118.351759 638.070352m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3857"></path><path d="M118.351759 648.361809m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3858"></path><path d="M123.497487 653.507538m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3859"></path><path d="M123.497487 663.798995m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3860"></path><path d="M128.643216 674.090452m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3861"></path><path d="M133.788945 679.236181m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3862"></path><path d="M138.934673 689.527638m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3863"></path><path d="M138.934673 694.673367m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3864"></path><path d="M144.080402 704.964824m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3865"></path><path d="M149.226131 715.256281m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3866"></path><path d="M154.371859 720.40201m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3867"></path><path d="M159.517588 730.693467m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3868"></path><path d="M164.663317 735.839196m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3869"></path><path d="M169.809045 740.984925m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3870"></path><path d="M174.954774 751.276382m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3871"></path><path d="M180.100503 756.422111m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3872"></path><path d="M185.246231 766.713568m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3873"></path><path d="M190.39196 771.859296m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3874"></path><path d="M195.537688 777.005025m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3875"></path><path d="M200.683417 787.296482m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3876"></path><path d="M205.829146 792.442211m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3877"></path><path d="M210.974874 797.58794m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3878"></path><path d="M221.266332 802.733668m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3879"></path><path d="M226.41206 813.025126m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3880"></path><path d="M231.557789 818.170854m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3881"></path><path d="M236.703518 823.316583m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3882"></path><path d="M246.994975 828.462312m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3883"></path><path d="M252.140704 833.60804m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3884"></path><path d="M257.286432 838.753769m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3885"></path><path d="M267.577889 843.899497m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3886"></path><path d="M272.723618 849.045226m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3887"></path><path d="M283.015075 854.190955m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3888"></path><path d="M288.160804 859.336683m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3889"></path><path d="M298.452261 864.482412m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3890"></path><path d="M303.59799 869.628141m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3891"></path><path d="M313.889447 874.773869m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3892"></path><path d="M319.035176 879.919598m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3893"></path><path d="M329.326633 885.065327m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3894"></path><path d="M334.472362 885.065327m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3895"></path><path d="M344.763819 890.211055m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3896"></path><path d="M349.909548 895.356784m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3897"></path><path d="M360.201005 900.502513m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3898"></path><path d="M370.492462 900.502513m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3899"></path><path d="M375.638191 905.648241m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3900"></path><path d="M385.929648 905.648241m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3901"></path><path d="M396.221106 910.79397m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3902"></path><path d="M401.366834 910.79397m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3903"></path><path d="M411.658291 915.939698m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3904"></path><path d="M421.949749 915.939698m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3905"></path><path d="M432.241206 921.085427m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3906"></path><path d="M437.386935 921.085427m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3907"></path><path d="M447.678392 921.085427m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3908"></path><path d="M457.969849 926.231156m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3909"></path><path d="M468.261307 926.231156m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3910"></path><path d="M478.552764 926.231156m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3911"></path><path d="M488.844221 926.231156m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3912"></path><path d="M493.98995 926.231156m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3913"></path><path d="M504.281407 926.231156m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3914"></path><path d="M514.572864 926.231156m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3915"></path><path d="M524.864322 926.231156m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3916"></path><path d="M535.155779 926.231156m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3917"></path><path d="M545.447236 926.231156m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3918"></path><path d="M550.592965 926.231156m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3919"></path><path d="M560.884422 926.231156m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3920"></path><path d="M571.175879 921.085427m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3921"></path><path d="M581.467337 921.085427m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3922"></path><path d="M591.758794 921.085427m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3923"></path><path d="M596.904523 921.085427m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3924"></path><path d="M607.19598 915.939698m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3925"></path><path d="M617.487437 915.939698m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3926"></path><path d="M627.778894 910.79397m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3927"></path><path d="M632.924623 910.79397m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3928"></path><path d="M643.21608 905.648241m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3929"></path><path d="M653.507538 905.648241m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3930"></path><path d="M658.653266 900.502513m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3931"></path><path d="M668.944724 895.356784m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3932"></path><path d="M679.236181 895.356784m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3933"></path><path d="M684.38191 890.211055m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3934"></path><path d="M694.673367 885.065327m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3935"></path><path d="M699.819095 885.065327m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3936"></path><path d="M710.110553 879.919598m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3937"></path><path d="M720.40201 874.773869m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3938"></path><path d="M725.547739 869.628141m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3939"></path><path d="M735.839196 864.482412m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3940"></path><path d="M740.984925 859.336683m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3941"></path><path d="M751.276382 854.190955m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3942"></path><path d="M756.422111 849.045226m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" p-id="3943"></path><path d="M761.567839 843.899497m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" p-id="3944"></path><path d="M777.005025 838.753769m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".99" p-id="3945"></path><path d="M787.296482 828.462312m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" opacity=".98" p-id="3946"></path><path d="M797.58794 818.170854m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" opacity=".97" p-id="3947"></path><path d="M807.879397 807.879397m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".96" p-id="3948"></path><path d="M818.170854 797.58794m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".95" p-id="3949"></path><path d="M828.462312 787.296482m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" opacity=".94" p-id="3950"></path><path d="M838.753769 777.005025m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".93" p-id="3951"></path><path d="M843.899497 761.567839m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" opacity=".92" p-id="3952"></path><path d="M854.190955 751.276382m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".91" p-id="3953"></path><path d="M864.482412 740.984925m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".9" p-id="3954"></path><path d="M869.628141 725.547739m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" opacity=".89" p-id="3955"></path><path d="M879.919598 715.256281m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".88" p-id="3956"></path><path d="M885.065327 699.819095m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" opacity=".87" p-id="3957"></path><path d="M890.211055 689.527638m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".86" p-id="3958"></path><path d="M900.502513 674.090452m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" opacity=".85" p-id="3959"></path><path d="M905.648241 663.798995m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".84" p-id="3960"></path><path d="M910.79397 648.361809m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".83" p-id="3961"></path><path d="M915.939698 632.924623m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".82" p-id="3962"></path><path d="M915.939698 617.487437m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".81" p-id="3963"></path><path d="M921.085427 607.19598m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".8" p-id="3964"></path><path d="M926.231156 591.758794m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".79" p-id="3965"></path><path d="M926.231156 576.321608m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".78" p-id="3966"></path><path d="M931.376884 560.884422m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".77" p-id="3967"></path><path d="M931.376884 545.447236m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".76" p-id="3968"></path><path d="M931.376884 530.01005m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".75" p-id="3969"></path><path d="M931.376884 514.572864m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".74" p-id="3970"></path><path d="M931.376884 499.135678m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".73" p-id="3971"></path><path d="M931.376884 483.698492m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".72" p-id="3972"></path><path d="M931.376884 468.261307m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".71" p-id="3973"></path><path d="M926.231156 452.824121m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".7" p-id="3974"></path><path d="M926.231156 437.386935m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".69" p-id="3975"></path><path d="M921.085427 421.949749m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".68" p-id="3976"></path><path d="M921.085427 406.512563m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".67" p-id="3977"></path><path d="M915.939698 391.075377m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".66" p-id="3978"></path><path d="M910.79397 380.78392m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".65" p-id="3979"></path><path d="M905.648241 365.346734m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".64" p-id="3980"></path><path d="M900.502513 349.909548m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".63" p-id="3981"></path><path d="M895.356784 334.472362m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".62" p-id="3982"></path><path d="M890.211055 324.180905m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".61" p-id="3983"></path><path d="M879.919598 308.743719m-92.623116 0a92.623116 92.623116 0 1 0 185.246232 0 92.623116 92.623116 0 1 0-185.246232 0Z" fill="#1790FF" opacity=".6" p-id="3984"></path><path d="M874.773869 298.452261m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".59" p-id="3985"></path><path d="M869.628141 283.015075m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".58" p-id="3986"></path><path d="M859.336683 272.723618m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".57" p-id="3987"></path><path d="M849.045226 262.432161m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".56" p-id="3988"></path><path d="M843.899497 246.994975m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".55" p-id="3989"></path><path d="M833.60804 236.703518m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".54" p-id="3990"></path><path d="M823.316583 226.41206m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".53" p-id="3991"></path><path d="M813.025126 216.120603m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".52" p-id="3992"></path><path d="M802.733668 205.829146m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".51" p-id="3993"></path><path d="M792.442211 195.537688m-92.623116 0a92.623116 92.623116 0 1 0 185.246232 0 92.623116 92.623116 0 1 0-185.246232 0Z" fill="#1790FF" opacity=".5" p-id="3994"></path><path d="M782.150754 185.246231m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".5" p-id="3995"></path><path d="M771.859296 180.100503m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".49" p-id="3996"></path><path d="M756.422111 169.809045m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".48" p-id="3997"></path><path d="M746.130653 159.517588m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".47" p-id="3998"></path><path d="M735.839196 154.371859m-92.623116 0a92.623116 92.623116 0 1 0 185.246232 0 92.623116 92.623116 0 1 0-185.246232 0Z" fill="#1790FF" opacity=".46" p-id="3999"></path><path d="M720.40201 144.080402m-92.623116 0a92.623116 92.623116 0 1 0 185.246232 0 92.623116 92.623116 0 1 0-185.246232 0Z" fill="#1790FF" opacity=".45" p-id="4000"></path><path d="M710.110553 138.934673m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".44" p-id="4001"></path><path d="M694.673367 133.788945m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".43" p-id="4002"></path><path d="M679.236181 123.497487m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".42" p-id="4003"></path><path d="M668.944724 118.351759m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".41" p-id="4004"></path><path d="M653.507538 113.20603m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".4" p-id="4005"></path><path d="M638.070352 108.060302m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".39" p-id="4006"></path><path d="M627.778894 108.060302m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".38" p-id="4007"></path><path d="M612.341709 102.914573m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".37" p-id="4008"></path><path d="M596.904523 97.768844m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".36" p-id="4009"></path><path d="M581.467337 97.768844m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".35" p-id="4010"></path><path d="M566.030151 92.623116m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".34" p-id="4011"></path><path d="M550.592965 92.623116m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".33" p-id="4012"></path><path d="M535.155779 92.623116m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".32" p-id="4013"></path><path d="M519.718593 92.623116m-92.623116 0a92.623116 92.623116 0 1 0 185.246232 0 92.623116 92.623116 0 1 0-185.246232 0Z" fill="#1790FF" opacity=".31" p-id="4014"></path><path d="M504.281407 92.623116m-92.623116 0a92.623116 92.623116 0 1 0 185.246232 0 92.623116 92.623116 0 1 0-185.246232 0Z" fill="#1790FF" opacity=".3" p-id="4015"></path><path d="M488.844221 92.623116m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".29" p-id="4016"></path><path d="M473.407035 92.623116m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".28" p-id="4017"></path><path d="M457.969849 97.768844m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".27" p-id="4018"></path><path d="M442.532663 97.768844m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".26" p-id="4019"></path><path d="M427.095477 102.914573m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".25" p-id="4020"></path><path d="M411.658291 102.914573m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".24" p-id="4021"></path><path d="M396.221106 108.060302m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".23" p-id="4022"></path><path d="M380.78392 113.20603m-92.623116 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".22" p-id="4023"></path><path d="M370.492462 118.351759m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".21" p-id="4024"></path><path d="M355.055276 123.497487m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".2" p-id="4025"></path><path d="M339.61809 128.643216m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".19" p-id="4026"></path><path d="M329.326633 133.788945m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".18" p-id="4027"></path><path d="M313.889447 144.080402m-92.623115 0a92.623116 92.623116 0 1 0 185.246231 0 92.623116 92.623116 0 1 0-185.246231 0Z" fill="#1790FF" opacity=".17" p-id="4028"></path><path d="M303.59799 149.226131m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".16" p-id="4029"></path><path d="M288.160804 154.371859m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".15" p-id="4030"></path><path d="M277.869347 164.663317m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".14" p-id="4031"></path><path d="M267.577889 174.954774m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" opacity=".13" p-id="4032"></path><path d="M252.140704 180.100503m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" opacity=".12" p-id="4033"></path><path d="M241.849246 190.39196m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".11" p-id="4034"></path><path d="M231.557789 200.683417m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".1" p-id="4035"></path><path d="M221.266332 210.974874m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" opacity=".09" p-id="4036"></path><path d="M210.974874 221.266332m-97.768844 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" opacity=".08" p-id="4037"></path><path d="M200.683417 231.557789m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".07" p-id="4038"></path><path d="M190.39196 241.849246m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".06" p-id="4039"></path><path d="M180.100503 257.286432m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" opacity=".05" p-id="4040"></path><path d="M174.954774 267.577889m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".04" p-id="4041"></path><path d="M164.663317 277.869347m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" opacity=".03" p-id="4042"></path><path d="M159.517588 293.306533m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" opacity=".02" p-id="4043"></path><path d="M149.226131 303.59799m-97.768845 0a97.768844 97.768844 0 1 0 195.537689 0 97.768844 97.768844 0 1 0-195.537689 0Z" fill="#1790FF" opacity=".01" p-id="4044"></path><path d="M144.080402 319.035176m-97.768844 0a97.768844 97.768844 0 1 0 195.537688 0 97.768844 97.768844 0 1 0-195.537688 0Z" fill="#1790FF" fill-opacity="0"></path></svg>';
d3 = document.createElement("span");
d1.className = "loading";
if (time) d1.ch_loading = true;
d1.appendChild(d2);
d1.appendChild(d3);
d3.innerHTML = text;
o.work.appendChild(d1);
d1.style.transition = "opacity 0.2s";
requestAnimationFrame(function() {requestAnimationFrame(function() {
d1.style.opacity = "1";
})});
if (typeof time === "number")
setTimeout(function() {
d1.style.opacity = "0";
setTimeout(function() {
d1.parentNode.removeChild(d1);
}, 500);
}, time);
}();
}, hideLoading: function() {
var that = this;
a = o.document.getElementsByClassName("loading");
for (var item = 0; item < a.length; item++) {
var point = a[item];
if (point.ch_loading) continue;
point.ch_loading = true;
point.style.opacity = "0";
setTimeout(function() {
if (point.parentNode) point.parentNode.removeChild(point);
}, 500);
return true;
}
return false;
},trigger: function(eventName, source) { 
for (var pitem in o.pcb) {
if (!o.pcb[pitem].iframe) continue;
var ap = o.pcb[pitem].handle;
if (typeof ap.app.onEvent === "function" && ap.callFunc("onEvent", JSON.stringify({ name: eventName, source: source, type: "order" })) === false) return;
}
return true;
},triggerAll:function(eventName, source) { 
source = source || null;
for (var pitem in o.pcb) {
if (!o.pcb[pitem].iframe) continue;
var ap = o.pcb[pitem].handle;
+function(ap, eventName, source) {
requestAnimationFrame(function() {
if(typeof ap.app.onEvent === "function")ap.callFunc("onEvent", JSON.stringify({ name: eventName, source: source, type: "all" }));
});
}(ap, eventName, source);
}
return true;
},sendMessage:function(id, source,referer) { 
for (var s in o.pcb) {
if (id && o.pcb[s].iframe && (o.pcb[s].pid == id || o.pcb[s].app == id)){
var ap = o.pcb[s].handle;
if (ap&&typeof ap.app.onMessage==="function"&&ap.callFunc("onMessage", JSON.stringify({
data: source,
referer:referer
})) === void 0) {
console.warn("WebAPPOS: id:" + id + "未发现onMessage方法！");
}
}
}
return false;
},notification: function(option,env) { 
option = option || {};
var data = option.data;
var time = option.time;
var title = option.title || env.app;
time = time || 3000;
var d1, d2, d3;
d1 = o.document.createElement("div");
d3 = o.document.createElement("div");
d3.innerText = title;
o.g("ch:app:json:" + env.app, function(v){
if(v)d3.innerText = v.title;
});
d2 = o.generateHTML(JSON.stringify(data));
d1.className = "notificationSystem";
d1.appendChild(d3);
d1.appendChild(d2);
o.work.appendChild(d1);
requestAnimationFrame(function() {
requestAnimationFrame(function() {
d1.style.transform = "translate3d(0,0,0)";
});
});
requestAnimationFrame(function() {
setTimeout(function() {
d1.style.transform = "translate3d(110%,0,0)";
setTimeout(function() {
if (d1.parentNode) d1.parentNode.removeChild(d1);
}, 300);
}, time);
});
o.core.sendMessage("59c30a4941c3faa8814fdaf6ff9303c6a4ce59ff", {"type": "notification", "data": option.data, "app": env.app },{
app:env.app,
pid:env.pid
});
},openAppMenu:function(pcb){
o.fullscreen.style.display="block";
o.fullscreen.innerHTML='<div id="appMenu"><div id="appMenuList"></div></div>';
var appMenu=document.getElementById("appMenu");
var appMenuList=document.getElementById("appMenuList");
requestAnimationFrame(function(){
appMenu.style.opacity="1";
});
appMenu.onclick=function(e){
if(e.srcElement===appMenu)
o.core.closeAppMenu();
}
var arr=[
["结束运行",function(){
o.core.closeApp(pcb.pid);
o.core.closeAppMenu();
}],
["关于小程序",function(){
o.g("ch:app:json:" + pcb.app, function(v) {
o.core.alert({
title:"小程序信息",
text:"应用标题："+pcb.title,
button:["关闭"],
});
})
o.core.closeAppMenu();
}],
["关于系统",function(){
o.core.alert({
title:"关于系统",
text:"作者：曹鸿",
button:["关闭"],
});
o.core.closeAppMenu();
}]
];
appMenuList.innerHTML="";
for(var i in arr){
var div=document.createElement("div");
div.innerText=arr[i][0];
div.onclick=arr[i][1];
appMenuList.appendChild(div);
}
},closeAppMenu:function(){
appMenu.style.opacity="0";
setTimeout(function(){
fullscreen.style.display="";
},200);
},gotoURL:function(url){
window.location.href = url;
},
};
o.soft_reboot=function(){
o.g("ch:app:html:"+OSAppId,function(h){
o.g("ch:app:js:"+OSAppId,function(j){
o.sys.innerHTML=h;
var app=function(s){s.onLoad({v:2,update:true});};
eval(j);
});
});
};
if(event.update){
}else
o.core.checkUpdate(OSAppId,function(fn){
if(fn===true){
console.log("WebAPPOS: 检测到系统内核更新！");
o.core.updateApp(OSAppId,function(fn){
console.log("WebAPPOS: 系统内核更新成功！");
o.soft_reboot();
});
}else if(fn===false){
}else{
}
});
for(var defaultApp in o.config.defaultApp)
if(typeof o.config.defaultApp[defaultApp]==="string")o.core.defaultInstall(o.config.defaultApp[defaultApp]);
var startAppid=o.config.startAppId;
o.core.openapp(startAppid,{
animation:false,
success:function(){
if(window.performance&&window.performance.now)
console.log("WebAppOS: 启动已完成！耗时："+(window.performance.now()-startTime)+"ms");
else console.log("WebAppOS: 启动已完成！");
if(o.originURLArr.app)
if(!o.core.is_AppRun(o.originURLArr.app))
o.core.openapp(o.originURLArr.app);
}
});
}
});