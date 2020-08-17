app({
setting:{
title:"WebAppOS桌面",
color:"#01a5ed",
},
data: { 
maxPage: 2,
queueList:[],
queueStatus:false,
maxAppCount_Row:4,
maxAppCount_Column:(window.innerHeight<690?6:7),
maxPageCount:9999,
pushCache:[],
},generateHTML:function(option,pid){
var p=document.createElement("view");
var ir=function(op,l){
if(Array.isArray(op)){
(function(l){
for(var i in op){
if(!op[i].tag)continue;
var t=document.createElement(op[i].tag);
if(op[i].text)t.innerText=op[i].text;
if(pid)(function(i){
if(op[i].click)t.onclick=function(){api.sendMessage(pid,{type:"click",data:{id:op[i].click}});};
})(i);
for(var i2 in op[i].attribute||{}){t.setAttribute(i2,op[i].attribute[i2]);}
l.appendChild(t);
if(op[i].children)ir(op[i].children,t);
}
})(l);
}else{
if(!op.tag)return;
var t=document.createElement(op.tag);
if(op.text)t.innerText=op.text;
if(pid)(function(){
if(op.click)t.onclick=function(){api.sendMessage(pid,{type:"click",data:{id:op.click}});};
})();
for(var i2 in op.attribute||{}){t.setAttribute(i2,op.attribute[i2]);}
l.appendChild(t);
if(op.children)ir(op.children,t);
}
};
ir(option,p);
return p;
},is_blank:function(x,y,page,size_w,size_h,target_dom){
target_dom=target_dom||false;
if(page<1)return false;
x=x|0;
y=y|0;
size_w=size_w|0;
size_h=size_h|0;
if(x<0)return false;
if(y<0)return false;
if(x+size_w-1>=app.data.maxAppCount_Row)return false;
if(y+size_h-1>=app.data.maxAppCount_Column)return false;
for(var xx=0;xx<size_w;xx++){
for(var yy=0;yy<size_h;yy++){
var result=app.is_fill(x+xx,y+yy,page);
if(result&&result!=target_dom)return false;
}
}
return true;
},is_fill:function(x,y,page){
if(page<1)return true;
x=x|0;
y=y|0;
if(x>=app.data.maxAppCount_Row)return true;
if(y>=app.data.maxAppCount_Column)return true;
var dom=document.querySelectorAll("[data-x='"+x+"'][data-y='"+y+"'][data-page='"+page+"']");
if(dom.length)return dom[0];
block=null;
document.querySelectorAll("[data-type='widget'][data-page='"+page+"']").forEach(function(dom){
if(x>=dom.getAttribute("data-x")&&x<(dom.getAttribute("data-x")|0)+(dom.getAttribute("data-w")|0)&&y>=dom.getAttribute("data-y")&&y<(dom.getAttribute("data-y")|0)+(dom.getAttribute("data-h")|0))block=dom;
});
if(block)return block;
return false;
},get_newPosition:function(size_w,size_h){
if(size_w>app.data.maxAppCount_Row)return null;
if(size_h>app.data.maxAppCount_Column)return null;
for(var page=1;page<=100;page++){
for(var y=0;y<app.data.maxAppCount_Column;y++){
for(var x=0;x<app.data.maxAppCount_Row;x++){
if(app.is_blank(x,y,page,size_w,size_h))return [x,y,page];
}
}
}
return false;
},put_App:function(apphash,imgversion,title,x,y,page){
var newApp=document.createElement("view");
newApp.className="app";
var newApp_icon=document.createElement("view");
var newApp_text=document.createElement("text");
newApp_icon.setAttribute("ch-img","cache/"+apphash+".png?"+imgversion);
newApp_text.innerText=title;
newApp.appendChild(newApp_icon);
newApp.appendChild(newApp_text);
newApp.setAttribute("data-x",x);
newApp.setAttribute("data-y",y);
newApp.setAttribute("data-w",1);
newApp.setAttribute("data-h",1);
newApp.setAttribute("data-app",apphash);
newApp.setAttribute("data-page",page);
newApp.setAttribute("data-type","app");
newApp.style.width=app.data.appWidth+"px";
newApp.style.height=app.data.appHeight+"px";
newApp.style.left=x*app.data.appWidth;
newApp.style.top=y*app.data.appHeight;
newApp.onclick=function(e){api.app.openapp(apphash,{event:e,posX:e.clientX,posY:e.clientY});};
if(page>=document.getElementsByClassName("desktop_page").length)app.setPage(page);
document.getElementsByClassName("desktop_page")[page].appendChild(newApp);
api.bind();
},put_Widget:function(appid,id,preview,w,h,x,y,page){
var a=document.createElement("view");
a.className="widget";
a.style.width=app.data.appWidth*w+"px";
a.style.height=app.data.appHeight*h+"px";
a.appendChild(preview);
a.setAttribute("data-x",x);
a.setAttribute("data-y",y);
a.setAttribute("data-w",w);
a.setAttribute("data-h",h);
a.setAttribute("data-page",page);
a.setAttribute("data-type","widget");
a.setAttribute("data-app",appid);
a.setAttribute("data-widget",id);
page=page|0;
a.style.left=x*app.data.appWidth;
a.style.top=y*app.data.appHeight;
if(page>=document.getElementsByClassName("desktop_page").length)app.setPage(page);
document.getElementsByClassName("desktop_page")[page].appendChild(a);
},is_AppInDesktop:function(app){
return document.querySelectorAll("[data-app='"+app+"']").length;
},save_config:function(finish){
var config_app=[];
var config_widget=[];
document.querySelectorAll("[data-type='app']").forEach(function(dom){
config_app.push({
x:dom.getAttribute("data-x"),
y:dom.getAttribute("data-y"),
page:dom.getAttribute("data-page"),
app:dom.getAttribute("data-app")
});
});
document.querySelectorAll("[data-type='widget']").forEach(function(dom){
config_widget.push({
x:dom.getAttribute("data-x"),
y:dom.getAttribute("data-y"),
page:dom.getAttribute("data-page"),
appid:dom.getAttribute("data-app"),
widget:dom.getAttribute("data-widget"),
w:dom.getAttribute("data-w"),
h:dom.getAttribute("data-h"),
}); 
});
api.iniSet(function(){
finish&&finish();
},"desktop",{desktop:config_app,widget:config_widget});
},init_request:function(res){
if(!res.data)return;
if(res.data.activity){
api.template(document.getElementById("activity_list_template").innerHTML,res,function(result){
document.getElementById("activity_list").innerHTML=result;
});
}
},openurl:function(event,target){
var url=target.getAttribute("data-url");
if(url.substr(0,18)=="https://q.yiban.cn"){
url="https://openapi.yiban.cn/oauth/authorize?client_id=34456451e9f15e5e&redirect_uri=http://f.yiban.cn/iapp439084&state="+encodeURIComponent(url);
}
api.gotoURL(url);
},
onLoad: function(event) { 
api.request({
url:"/app/applist",
success:function(res){
if(res.res==100){
for(var i in res.data.applist){
console.log("默认安装："+res.data.applist[i].apphash);
api.app.defaultInstall(res.data.applist[i].apphash);
}
}
}
});
var week=['日','一','二','三','四','五','六'];
var date=new Date();
document.getElementsByClassName('now_date')[0].innerHTML=(date.getMonth()+1)+' 月 '+date.getDate()+' 日 ';
document.getElementsByClassName('week')[0].innerHTML='周'+week[date.getDay()];
api.iniGet(function(result){
for(var item in result)app.receivePushMessage(result[item]);
},"messagePush",[]);
app.data.appWidth=window.innerWidth/app.data.maxAppCount_Row;
app.data.appHeight=window.innerHeight/app.data.maxAppCount_Column;
var get_less_page=function(){
var max=0;
document.querySelectorAll("[data-type]").forEach(function(dom){
if(dom.getAttribute("data-page")>max)max=dom.getAttribute("data-page");
});
return max|0;
};
var desktop=app.desktop=document.getElementById("desktop");
var work=app.work=document.getElementById("work");
var rubish=app.rubish=document.getElementById("rubish");
var width=window.innerWidth;
var old_x,current_x;
var default_page=1;
var current_page=default_page;
var old_time=0;
var cancel_longtap=0;
var cancel_move=0;
var status_edit;
var maxAppCount_Row=app.data.maxAppCount_Row;
var maxAppCount_Column=app.data.maxAppCount_Column;
var maxPageCount=app.data.maxPageCount;
var target;
var touch_move_old_x,touch_move_old_y;
var stopPropagation=false;
desktop.style.transform="translateX("+(-width*default_page)+"px)";
app.toPage=function(page){
current_page=page;
desktop.style.transform="translateX("+(-width*current_page)+"px)";
};
app.getPage=function(){
return current_page;
};
var get_less=function(){
app.setPage(get_less_page());
if (current_page>=document.getElementsByClassName("desktop_page").length){
current_page=document.getElementsByClassName("desktop_page").length-1;
desktop.style.transform="translateX("+(-width*current_page)+"px)";
}
}
desktop.addEventListener('touchstart',function(event){
stopPropagation=false;
if(event.targetTouches.length>1||status_edit)return;
target=event.targetTouches[0];
old_x=target.clientX;
desktop.style.transition="";
old_time=new Date().getTime();
current_x=0;
var x=(target.clientX/(window.innerWidth/maxAppCount_Row))|0;
var y=(target.clientY/(window.innerHeight/maxAppCount_Column))|0;
var page=current_page;
var ap=app.is_fill(x,y,page);
if(cancel_longtap){clearTimeout(cancel_longtap);cancel_longtap=0;}
if(ap&&page>0)
cancel_longtap=setTimeout(function(){
stopPropagation=true;
rubish.style.height="40px";
desktop.style.transition="all 0.3s";
ap.style.pointerEvents="none";
ap.style.transition="transform 0.2s,opacity 0.2s";
requestAnimationFrame(function(){
ap.style.opacity="0.6";
ap.style.transform="scale(1.15)";
});
desktop.appendChild(ap);
status_edit=ap;
touch_move_old_x=target.clientX-ap.offsetLeft;
touch_move_old_y=target.clientY-ap.offsetTop;
ap.style.left=window.innerWidth*current_page+target.clientX-touch_move_old_x;
ap.style.top=target.clientY-touch_move_old_y;
app.setPage(get_less_page()+1);
api.vibrate(100);
},300);
});
desktop.addEventListener('touchmove',function(event){
if(event.targetTouches.length>1)return;
target=event.targetTouches[0];
if(stopPropagation){
console.log("桌面","stopPropagation");
event.preventDefault();
event.stopPropagation();
}
if(status_edit){
status_edit.style.left=window.innerWidth*current_page+target.clientX-touch_move_old_x;
status_edit.style.top=target.clientY-touch_move_old_y;
document.querySelector("#debug").innerText=target.clientX+"|"+window.innerWidth;
if(target.clientY>window.innerHeight-40){
rubish.className="rubish_active";
rubish.style.height="60px";
}else{
rubish.className="rubish_free";
rubish.style.height="40px";
}
if(target.clientX<30||target.clientX>window.innerWidth-30){
if(!cancel_move)
cancel_move=setTimeout(function(){
if(target.clientX<30){
if(current_page<=1)return;
current_page--;
}else if(target.clientX>window.innerWidth-30){
if(current_page>=document.getElementsByClassName("desktop_page").length-1)return;
current_page++;
}
cancel_move=0;
desktop.style.transform="translateX("+(-width*current_page)+"px)";
return;
},500);
}else{
if(cancel_move){clearTimeout(cancel_move);cancel_move=0;}
}
return;
}
if(cancel_longtap){clearTimeout(cancel_longtap);cancel_longtap=0;}
current_x=target.clientX-old_x;
if(current_page==0&&current_x>0)current_x=current_x/3;
if(current_page==app.data.maxPage-1&&current_x<0)current_x=current_x/3;
desktop.style.transform="translateX("+(-current_page*width+current_x)+"px)";
},true);
desktop.addEventListener('touchcancel',function(event){
if(cancel_move){clearTimeout(cancel_move);cancel_move=0;}
if(cancel_longtap){clearTimeout(cancel_longtap);cancel_longtap=0;}
var myEvent = document.createEvent('Event');
myEvent.initEvent('touchend', true, true);
desktop.dispatchEvent(myEvent)
});
desktop.addEventListener('touchend',function(event){
desktop.style.transition="all 0.3s";
if(cancel_move){clearTimeout(cancel_move);cancel_move=0;}
if(cancel_longtap){clearTimeout(cancel_longtap);cancel_longtap=0;}
if(status_edit){
if(rubish.style.height=="60px"){
(function(status_edit){
api.alert({
text:"您是否要将此应用从桌面上移除？",
button:["删除","取消"],
click:function(id){
if(id.id==0){
if(status_edit.getAttribute("data-type")==="app"){
api.app.uninstall(status_edit.getAttribute("data-app"),function(){
get_less();
});
}
status_edit.parentNode.removeChild(status_edit);
app.save_config();
api.toast("删除成功！");
}
},
});
})(status_edit);
}
var x=((target.clientX-touch_move_old_x+(window.innerWidth/maxAppCount_Row)/2)/(window.innerWidth/maxAppCount_Row))|0;
var y=((target.clientY-touch_move_old_y+(window.innerHeight/maxAppCount_Column)/2)/(window.innerHeight/maxAppCount_Column))|0;
var page=current_page;
status_edit.style.pointerEvents="";
status_edit.style.transition="all 0.2s";
var fini=function(page,status_edit,left){
setTimeout(function(){
page.appendChild(status_edit);
status_edit.style.transform="0s";
requestAnimationFrame(function(){
status_edit.style.left=left;
status_edit.style.transform="";
});
},200);
};
if(app.is_blank(x,y,page,status_edit.getAttribute("data-w"),status_edit.getAttribute("data-h"),status_edit)&&rubish.style.height!="60px"){
status_edit.setAttribute("data-x",x);
status_edit.setAttribute("data-y",y);
status_edit.setAttribute("data-page",page);
status_edit.style.left=window.innerWidth*current_page+x*window.innerWidth/maxAppCount_Row;
status_edit.style.top=y*window.innerHeight/maxAppCount_Column;
app.save_config();
fini(document.getElementsByClassName("desktop_page")[page],status_edit,x*window.innerWidth/maxAppCount_Row);
}else{
status_edit.style.left=window.innerWidth*current_page+status_edit.getAttribute("data-x")*window.innerWidth/maxAppCount_Row;
status_edit.style.top=status_edit.getAttribute("data-y")*window.innerHeight/maxAppCount_Column;
fini(document.getElementsByClassName("desktop_page")[status_edit.getAttribute("data-page")|0],status_edit,status_edit.getAttribute("data-x")*window.innerWidth/maxAppCount_Row);
}
rubish.className="rubish_free";
rubish.style.height="0";
requestAnimationFrame(function(){
status_edit.style.opacity="";
status_edit.style.transform="";
status_edit=null;
});
get_less();
return;
}
current_x=current_x+(current_x/(new Date().getTime()-old_time))*300;
if(current_x<-width/2&&current_page<app.data.maxPage-1){
current_page++;
}else if(current_x>width/2&&current_page>0){
current_page--;
}
desktop.style.transform="translateX("+(-width*current_page)+"px)";
});
app.loadFinish();
app.userInit();
},loadFinish:function(){
api.iniGet(function(res){
var widget=function(){
if(res.widget&&res.widget.length>0){
api.iniGet(function(widget_info){
for(var item in res.widget){
var dd=res.widget[item];
var preview="";
for(var item in widget_info){
item=widget_info[item];
if(item.id==dd.widget){
if(app.is_blank(dd.x,dd.y,dd.page,dd.w,dd.h))
app.put_Widget(dd.appid,dd.widget,app.generateHTML(item.data,item.app),dd.w,dd.h,dd.x,dd.y,dd.page);
break;
}
}
}
api.bind();
app.changeApp();
},"widget",[]);
}else app.changeApp();
};
if(res.desktop&&res.desktop.length>0){
var total_i=0;
for(var item in res.desktop){
(function(item){
api.app.getAppDetail(item.app,function(v){
total_i++;
if(v&&v.imgversion&&v.title&&!app.is_AppInDesktop(item.app)&&app.is_blank(item.x,item.y,item.page,1,1))
app.put_App(item.app,v.imgversion,v.title,item.x,item.y,item.page);
if(total_i==res.desktop.length)widget();
});
})(res.desktop[item]);
}
}else{
widget();
}
},"desktop",{});
},setThemeColor:function(color){
},changeApp:function(){
var appList=[];
var appList2=[];
api.app.getInstalledList(function(e){
appList.push(e);
},function(){
var i=0;
for(var a in appList){
(function(a){
api.app.getAppDetail(appList[a],function(e2){
i++;
appList2.push({app:appList[a],data:e2});
if(i==appList.length)finish();
});
})(a);
}
if(appList.length===0)finish();
});
var finish=function(){
for(var a in appList2){
var aa=appList2[a];
if(app.is_AppInDesktop(aa.app))continue;
if(!aa.data.imgversion)continue;
if(!aa.data.title)continue;
var pos=app.get_newPosition(1,1);
app.put_App(aa.app,aa.data.imgversion,aa.data.title,pos[0],pos[1],pos[2]);
};
api.bind();
app.save_config();
};
},
totalPage:function(){
return document.getElementsByClassName("desktop_page").length;
},
setPage: function(page) {
page=page|0;
var localpage=app.totalPage();;
if(page+1>localpage){
for(var i=0;i<page+1-localpage;i++){
var newpage=document.createElement("div");
newpage.className="desktop_page";
app.desktop.appendChild(newpage);
}
}else if(page+1<localpage){
var deln=0;
for(var i=0;i<localpage;i++){
if(i>page){
app.desktop.removeChild(document.getElementsByClassName("desktop_page")[i-deln]);
deln++;
}
}
}
app.data.maxPage=(page+1)|0;
app.desktop.style.width=(page*100+100)+"vw";
},
onHide: function() { 
},
onShow: function() { 
},onBack:function(){
if(app.getPage()!=1){
app.toPage(1);
return false;
}
if(new Date().getTime()-2000<this.data.backTime){
if(api.is_Yiban()||api.is_App()){
api.exit();
return false;
}
return;
}
this.data.backTime=new Date().getTime();
api.toast("再按一次返回键退出");
setTimeout(function(){api.history_delete();},1);
setTimeout(function(){
api.history_add();
},2000);
return false;
},
onUnload: function() { 
},
onEvent: function(event) { 
console.log("desktop",event);
if(event.name=="onChangeApp"){
app.changeApp();
}else if(event.name=="onLoginChange"){
app.userInit();
}
},userInit:function(){
api.socket({id:"user",type:"user"},function(callback){
if(callback){
document.getElementById("user_head").style.backgroundImage='url('+callback.userhead+')';
}else document.getElementById("user_head").style.backgroundImage='url("http://img02.fs.yiban.cn/100/avatar/user/200")';
});
},pushQueue:function(fn){
app.data.queueList.push(fn);
app.checkQueue();
},checkQueue:function(){
if(app.data.queueStatus)return;
if(app.data.queueList.length){
app.data.queueStatus=true;
var a=app.data.queueList.shift();
var finish=function(){
app.data.queueStatus=false;
app.checkQueue();
};
a&&a(finish);
}else app.data.queueStatus=false;
},onMessage:function(message){
if(message.referer.app=="2203cd2aca41984b6fce63cf801a1f4cf2e234c7"||message.referer.app=="system"){
if(message.data.type=="push"){
console.log("收到推送",message.data);
app.receivePushMessage(message.data.source);
}
}
api.bind();
},onUpdate: function(event) { 
},openapp:function(event,target){
api.toast("启动应用中...");
api.app.openapp(target.getAttribute("data-appid"),{event:event});
}
});