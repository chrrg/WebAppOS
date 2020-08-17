/*CH单页面引擎 桂林理工大学CH制作*/
/*开始绑定数据*/
var app,api;
(function(){
var o={
	document:document,
	work:document.body,
	eval:function(code,data,that){return eval('('+code+')')},
	history:{
		refresh:function(){window.history.replaceState(null,null,null);},
		replace:function(path){window.history.replaceState(null,null,path);},
		root:function(){window.history.replaceState(null,null,"./");},
		push:function(app){
			this.his=app;
			window.history.pushState({app:app},'',"#"+app);
		},delete:function(){
			window.history.go(-1);
		},forward:function(){
			this.push(o.pcbApp.env.name);
		}
	},
};

window.onpopstate=function(e){//返回
	if(typeof app.onBack==="function"){
		if(app.onBack()===false)o.history.push(o.history.his);//屏蔽返回键
	}
};
app=function(json){
	app=json;
	if(typeof app.onLoad==="function")app.onLoad();//触发启动事件
	api.bind();
	document.body.addEventListener('touchmove',function(e){e.preventDefault();},{passive:false});
};
if(!NodeList.prototype.forEach)NodeList.prototype.forEach=Array.prototype.forEach;//让轻应用兼容ES5
api={
	startHistory:function(){
		if(o.startHistory)return;
		o.history.push("ch");
		//o.history.root();
		o.startHistory=true;
	},
	loadJS:function(code){
		var s=document.createElement("script");
		s.type="text/javascript";
		try{s.appendChild(document.createTextNode(code))}catch(ex){s.text=code};
		document.body.appendChild(s);
	},
	loadCSS:function(code){
		var s=document.createElement("style");
		s.type="text/css";
		try{s.appendChild(document.createTextNode(code))}catch(ex){s.text=code};
		document.body.appendChild(s);
	},
	checkCDN:function(file){//输入字符串，输出CDN路径，没则有输出null
		switch(file){
			case "jq":
			case "jQuery":
			case "jquery.min.js":
				return "https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js";
			case "bootstrap.min.css":
				return "https://cdn.bootcss.com/twitter-bootstrap/4.3.1/css/bootstrap.min.css";
			case "bootstrap.min.js":
				return "https://cdn.bootcss.com/twitter-bootstrap/4.3.1/js/bootstrap.min.js";
			case "template"://渲染
				return "https://aui.github.io/art-template/js/template-engines/template-web.js";
			default:
				return file;
		}
	},
	import:function(source,fn,step){//导入项目中，不存入文件系统
		if(!fn)fn=function(){};
		var that=this;
		var download=function(url,fn){
			var a=new XMLHttpRequest();
			a.open('GET',url,true);
			a.onreadystatechange=function(){
				if (a.readyState==4&&a.status==200||a.status==304)fn(a.responseText);//加载下一个
			};
			a.send();
		};
		if(typeof source === "object"){//数组使用同步加载
			var index=0;
			var next=function(){
				if(index>=source.length){fn();return;}//完成了
				var url=that.checkCDN(source[index]);
				download(url,function(res){
					if(step)step(index);
					var r=url.split(/\./);
					var type=r[r.length-1];
					if(type=='js')that.loadJS(res);else if(type=='css')that.loadCSS(res);
					index++;
					next();
				});
			};
			next();
		}else if(typeof source === "string"){//提交
			var url=that.checkCDN(source);
			download(url,function(res){
				var r=url.split(/\./);
				var type=r[r.length-1];
				if(type=='js')that.loadJS(res);else if(type=='css')that.loadCSS(res);
				fn();
			});
		}
		return "asyn";
	},
	template:function(code,data,fn){
		if(!code)return false;
		var s=data;//JSON.parse(handle.stringify(data));
		requestAnimationFrame(function(){
			var aa=template.compile(code);
			fn&&fn(aa(s));
		});
	},
	request:function(options){//请求
		var formatParams=function(data){
			var arr = [];
			for(var name in data)arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
			return arr.join("&");
		};
		options=options||{};
		options.type=(options.type||"GET").toUpperCase();
		options.dataType = options.dataType||"text";
		options.header = options.header||{};
		var params="";
		if(typeof options.data==="object")params = formatParams(options.data);else params=options.data;
		if (window.XMLHttpRequest)var xhr = new XMLHttpRequest();else var xhr = new ActiveXObject('Microsoft.XMLHTTP');//IE6及其以下版本浏览器
		xhr.onreadystatechange = function(){
			if (xhr.readyState==4) {
				var ajaxtext=xhr.responseText;
				var type=xhr.getResponseHeader("Content-Type");
				var status = xhr.status;
				if (status >= 200 && status < 304){
					if(options.dataType=="json"||type&&type.indexOf("json")!=-1){//is json
						try{
							ajaxtext=JSON.parse(ajaxtext);//auto json
						}catch(e){

							console.log("Request出错："+e);
							options.fail && options.fail(0);
							options.complete&&options.complete();
							throw e;
							return;
						}
					}
					options.success && options.success(ajaxtext,status,xhr.getAllResponseHeaders());
				}else options.fail && options.fail(status);
				options.complete&&options.complete();
			}
		};
		if (options.type=="GET"){
			if(params)xhr.open("GET", options.url+"?"+params,true);
			else xhr.open("GET", options.url,true);
			for(var op in options.header)xhr.setRequestHeader(op, options.header[op]);
			xhr.send(null);
		}else if (options.type == "POST"){
			xhr.open("POST", options.url, true);
			xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
			for(var op in options.header)xhr.setRequestHeader(op, options.header[op]);
			xhr.send(params);
		}
		return xhr;
	},alert:function(text,title,button,fn,content){
		if(typeof text==="object"){
			var option=text;
			text=option.text||"";
			title=option.title||"";
			button=option.button||["确认"];
			fn=option.click||null;
			content=option.content||[];
			//return;
		}
		text=text||"";
		title=title||"";
		button=button||["确认"];
		fn=fn||null;
		content=content||[];
		var d1=o.document.createElement("div");//遮罩
		d1.className="alert-hover";
		var d2=o.document.createElement("div");//对话框
		d2.className="alert";
		var closeAlert=function(){
			d2.style.transform="scale(0.01)";
			d1.style.opacity="0";
			setTimeout(function(){
				if(d1.parentNode)d1.parentNode.removeChild(d1);
			},200);
		};
		
		var titleDiv=o.document.createElement("div");
		var contentDiv=o.document.createElement("div");
		var buttonDiv=o.document.createElement("div");
		titleDiv.className="alert-title";
		contentDiv.className="alert-content";
		buttonDiv.className="alert-button";
		titleDiv.innerText=title;
		contentDiv.innerText=text;
		for(var i in content){
			(function(i){
				var cont=content[i]; 
				if(typeof cont !=="object")return;
				if(cont.type=="br"){
					var textContent=o.document.createElement("br");
					contentDiv.appendChild(textContent);
				}if(cont.type=="span"){
					var textContent=o.document.createElement("span");
					textContent.setAttribute("style",cont.style);
					textContent.innerText=cont.text;
					contentDiv.appendChild(textContent);
				}else if(cont.type=="text"){
					var textContent=o.document.createElement("view");
					textContent.setAttribute("style",cont.style);
					textContent.innerText=cont.text;
					contentDiv.appendChild(textContent);
				}else if(cont.type=="radio"){//单选框组
					var radioList=cont.list||[];
					for(var i2 in radioList){
						var cont2=radioList[i2];
						var textContent=o.document.createElement("div");
						textContent.className="alert-radio";
						textContent.innerText=cont2;
						contentDiv.appendChild(textContent);
						(function(i2){
							textContent.onclick=function(){
								if(o.eval(function(){return data.fn({id:data.id});}.toString()+'()',{fn:cont.click,id:i2})!==false){
									//不返回false默认关闭
									closeAlert();
								}
							};
						})(i2);
					}
				}else if(cont.type=="checkbox"){//复选框
					var radioList=cont.list||[];
					for(var i2 in radioList){
						var cont2=radioList[i2];
						var textContent=o.document.createElement("div");
						textContent.className="alert-checkbox";
						textContent.innerText=cont2;
						contentDiv.appendChild(textContent);
						(function(i2){
							textContent.onclick=function(){
								if(o.eval(function(){return data.fn({id:data.id});}.toString()+'()',{fn:cont.click,id:i2})!==false){
									//不返回false默认关闭
									closeAlert();
								}
							};
						})(i2);
					}
				}else if(cont.type=="input"){//输入框
					var textContent=o.document.createElement("input");
					textContent.className="alert-input";
					textContent.setAttribute("type",cont.inputType||"text");
					textContent.setAttribute("value",cont.value||"");
					textContent.setAttribute("placeholder",cont.placeholder||"");
					contentDiv.appendChild(textContent);
				}
			})(i);
		};
		d2.appendChild(titleDiv);
		d2.appendChild(contentDiv);
		if(button){
			for(var bitem in button){
				var bi=o.document.createElement("div");
				bi.innerText=button[bitem];
				bi.className="alert-button-item";
				(function(bitem){
					bi.onclick=function(){
						requestAnimationFrame(function(){
							if(typeof fn==="function"){
								o.eval(function(){
									data.fn({id:data.bitem});
								}.toString()+'()',{fn:fn,bitem:bitem});
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
		requestAnimationFrame(function(){
			requestAnimationFrame(function(){
				d1.style.opacity="1";
				d2.style.transform="translate3d(0,-50%,0)";
			});
		});
	},
	showLoading:function(text,time){
		if(typeof text==="undefined")text='加载中...';
		//if(typeof time==="undefined")time=2000;
		!function(){
			var d1,d2,d3;
			d1=o.document.createElement("div");
			d2=o.document.createElement("div");
			d3=o.document.createElement("span");
			//d.style.display="none";
			d1.className="loading";
			if(time)d1.ch_loading=true;
			/*d1.style.position="fixed";
			d1.style.left="0";
			d1.style.right="0";
			d1.style.width="33vw";
			d1.style.height="33vw";
			d1.style.top="40vh";
			d1.style.margin="0 auto";
			d1.style.textAlign="center";
			d1.style.zIndex="99999";
			d1.style.backgroundColor="rgba(0,0,0,0.6)";
			d1.style.borderRadius="5px";
			d1.style.color="white";
			d1.style.padding="4px";
			d2.style.backgroundImage="";//缓存
			d2.style.backgroundRepeat="no-repeat";
			d2.style.position="relative";
			d2.style.top="20%";
			d2.style.width="30%";
			d2.style.height="30%";
			d2.style.margin="0 auto";
			d2.style.backgroundSize="100% 100%";
			d3.style.position="absolute";
			d3.style.bottom="20%";
			d3.style.left="0";
			d3.style.right="0";
			d3.style.fontSize="14px";
			d3.style.lineHeight="14px";*/
			d1.appendChild(d2);
			d1.appendChild(d3);
			d3.innerHTML=text;
			o.work.appendChild(d1);
			d1.style.transition="opacity 0.2s";//动画时长
			requestAnimationFrame(function(){
				d1.style.opacity="1";//渐显动画
			});
			//o.eval(function(){
				/*setTimeout(function(){
					data.d1.style.opacity="1";//渐显动画
				},1);*/
			//}.toString()+'()',{d1:d1}); 
			if(typeof time==="number")
				o.eval(function(){
					requestAnimationFrame(function(){
						setTimeout(function(){
							data.d1.style.opacity="0";//渐隐动画
							setTimeout(function(){
								data.d1.parentNode.removeChild(data.d1);
							},500);
						},data.time);
					});
				}.toString()+'()',{d1:d1,time:time});
		}(); 
		//$newelement=$('<div class="glut-loading"><div class="img"></div><span></span></div>');
		//$newelement.find("span").text(text);
		//$("body").append($newelement);
		//$newelement.fadeIn(100);
		//if(typeof time!=="undefined")$newelement.delay(time).fadeOut(100,function(){$(this).remove()});
	},hideLoading:function(){
		var that=this;
		a=o.document.getElementsByClassName("loading");
		for(var item=0;item<a.length;item++){
			var point=a[item];
			//console.log(point);
			//console.log("ch_loading",point.ch_loading);
			if(point.ch_loading){continue;}
			point.ch_loading=true;
			o.eval(function(){
				data.d1.style.opacity="0";
				requestAnimationFrame(function(){
					setTimeout(function(){
						if(data.d1.parentNode)data.d1.parentNode.removeChild(data.d1);
					},500);
				});
			}.toString()+'()',{d1:point});
			//a[0].parentNode.removeChild(a[0]);
			return true;
		}
		return false;
		//$(".glut-loading").fadeOut(100,function(){$(this).remove()}); 
	},toast:function(text,time){
		//var t; 
		if(typeof time !== "number")time=2000;
		var d1,d2;
		d1=o.document.createElement("div");
		d2=o.document.createElement("span");
		d1.className="toast";
		/*d1.style.position="absolute";
		
		//d.style.display="none";
		d1.style.color="white";
		d1.style.zIndex="99999";
		d1.style.height="auto";
		d1.style.lineHeight="14px";
		d1.style.textAlign="center";
		d1.style.bottom="8%";
		d1.style.padding="10px";
		d1.style.maxWidth="90%";
		d1.style.overflow="hidden";
		d1.style.backgroundColor="rgba(0,0,0,0.5)";
		d1.style.borderRadius="10px";
		d1.style.minWidth="30%";
		d1.style.minHeight="14px";//toast样式设置
		*/
		d1.appendChild(d2);
		d2.innerText=text;
		o.work.appendChild(d1);
		//d1.style.marginLeft=(window.innerWidth-d1.offsetWidth)/2+"px";
		d1.style.transition="transform 0.5s,opacity 0.5s";//动画时长
		requestAnimationFrame(function(){
			requestAnimationFrame(function(){
				d1.style.transform="translate3d(-50%,-40px,0)";//上浮动画
				d1.style.opacity="1";//渐显动画
			});
		});
		
		o.eval(function(){
			var d1=data.d1;
			requestAnimationFrame(function(){
				setTimeout(function(){
					d1.style.opacity="0";
					setTimeout(function(){
						if(d1.parentNode)d1.parentNode.removeChild(d1);
					},500);
				},data.time);
			}); 
		}.toString()+'()',{d1:d1,time:time});
	},bind:function(){
		var watcher=[];
		var addWatcher=function(att,fn,source){//添加绑定
			var ed=false;
			for(var i in watcher){if(i.att==att){ed=true;break;}}
			if(!ed)(function(){
				var v=app.data[att];//临时变量
				Object.defineProperty(app.data,att,{
					get:function(){return v},  // 返回监听到的value值
					set:function(n){
						for(var i in watcher){if(watcher[i].att==att)watcher[i].fn(n,source);}
						v=n;
					}
				});
			})();
			watcher.push({
				att:att,fn:fn
			});
			app.data[att]=app.data[att];
		};
		document.querySelectorAll("[ch]").forEach(function(dom){
			var d;
			dom.removeAttribute("ch");
			var comm=dom.attributes;
			for(var i in comm){
				if(isNaN(i))continue;
				var s = comm[i];
				if(s.name.substr(0,1)==":"){
					var att=s.name.substr(1);
					if(!att)continue;
					addWatcher(s.value,function(n){
						dom.setAttribute(att,n);
					});
				}
			}
		});
		document.querySelectorAll("[ch-html]").forEach(function(dom){
			var d;
			dom.setAttribute("ch-htmled",d=dom.getAttribute("ch-html"));
			dom.removeAttribute("ch-html");
			addWatcher(d,function(n){
				dom.innerHTML=n;
			});
		});
		document.querySelectorAll("[ch-val]").forEach(function(dom){
			var d=dom.getAttribute("ch-val");
			dom.setAttribute("ch-valed",d);
			dom.removeAttribute("ch-val");
			addWatcher(d,function(n){
				dom.value=n;
			});
			dom.addEventListener("input",function(e){
				app.data[d]=e.target.value;
			});
		});
		document.querySelectorAll("[ch-watch]").forEach(function(dom){
			var d=dom.getAttribute("ch-watch");
			
			dom.setAttribute("ch-watched",d);
			dom.removeAttribute("ch-watch");
			dom.addEventListener("input",function(e){
				if(app.data)app.data[d]=e.target.value;
				if(typeof app[d]==="function")app[d](e.target.value);
			});
		});
		document.querySelectorAll("[ch-text]").forEach(function(dom){
			var d;
			dom.setAttribute("ch-texted",d=dom.getAttribute("ch-text"));
			dom.removeAttribute("ch-text");
			addWatcher(d,function(n){
				dom.innerText=n;
			});
		});
		document.querySelectorAll("[ch-display]").forEach(function(dom){
			var d;
			dom.setAttribute("ch-displayed",d=dom.getAttribute("ch-display"));
			dom.removeAttribute("ch-display");
			var v=dom.getAttribute("ch-display-value");
			addWatcher(d,function(n,source){
				var v=dom.getAttribute("ch-display-value");
				if(!v||n==v)dom.style.display="block";
				else dom.style.display="none";
			});
		});
		document.querySelectorAll("iscroll").forEach(function(scroll_view){/*滚动*/
			if(scroll_view.iscroll)return;
			scroll_view.iscroll=true
			var touchBeginTime=0;
			var oldY=0;
			var desktopY=0;
			var desktopOldY=0;
			var dis=0;
			var cacheHeight=0;
			var speed;
			var totalheight=0;
			scroll_view.style.transition="transform 0.5s";
			scroll_view.ch_toScroll=function(x,y){
				dis=-y;
				totalheight=0;
				scroll_view.childNodes.forEach(function(elem){
					if(!elem.offsetHeight)return;
					var ele=getComputedStyle(elem);
					totalheight+=elem.offsetHeight+parseInt(ele.marginTop)+parseInt(ele.marginBottom);
				});
				cacheHeight=-totalheight+scroll_view.offsetHeight;
				if(cacheHeight>0)cacheHeight=0;
				if(dis>0)dis=0;//上面出来了
				else if(dis<cacheHeight)dis=cacheHeight;//下面出来了
				desktopY=dis;
				scroll_view.style.transform="translate3d(0,"+desktopY+"px,0)";
				return true;
			};
			scroll_view.ch_getScroll=function(){
				return [0,-dis];//x,y
			};
			scroll_view.onmousewheel=function(event){
				if(event.wheelDelta>0)
					dis=dis+200;//向上滑
				else
					dis=dis-200;//往下滑
				totalheight=0;
				scroll_view.childNodes.forEach(function(elem){
					if(!elem.offsetHeight)return;
					var ele=getComputedStyle(elem);
					totalheight+=elem.offsetHeight+parseInt(ele.marginTop)+parseInt(ele.marginBottom);
				});
				cacheHeight=-totalheight+scroll_view.offsetHeight;
				if(cacheHeight>0)cacheHeight=0;
				if(dis>0)dis=0;//上面出来了
				else if(dis<cacheHeight)dis=cacheHeight;//下面出来了
				desktopY=dis;
				scroll_view.style.transform="translate3d(0,"+desktopY+"px,0)";
			};
			scroll_view.addEventListener('touchstart',function(event){
				scroll_view.style.transition="transform 0s";
				oldY=event.touches[0].clientY;
				totalheight=0;
				scroll_view.childNodes.forEach(function(elem){
					if(!elem.offsetHeight)return;
					var ele=getComputedStyle(elem);
					totalheight+=elem.offsetHeight+parseInt(ele.marginTop)+parseInt(ele.marginBottom);
				});
				cacheHeight=-totalheight+scroll_view.offsetHeight;
				if(cacheHeight>0)cacheHeight=0;
				touchBeginTime=new Date().getTime();
				desktopOldY=0;
			});
			scroll_view.addEventListener('touchmove',function(event){
				desktopOldY=(oldY-event.touches[0].clientY)|0;
				dis=((desktopY-desktopOldY)|0);
				if(dis>0)//上面出来了
					dis=dis*0.3;//((desktopX-desktopOldX*((400-dis)/400))|0);
				else if(dis<cacheHeight)//右边出来了
					dis=cacheHeight-(cacheHeight-dis)*0.3;
				 
				scroll_view.style.transform="translate3d(0,"+dis+"px,0)";
			});
			scroll_view.addEventListener('touchend',function(event){
				scroll_view.style.transform="scale(1)";
				scroll_view.style.transition="transform 0.5s";
				var onPull=scroll_view.getAttribute("ch-pull");
				if(onPull&&typeof app[onPull] === "function")
					if(dis>0)//下拉刷新
						app[onPull]({posX:0,posY:dis,pos:dis+0});//pos大于0
					else if(dis<cacheHeight)//上拉加载
						app[onPull]({posX:0,posY:dis-cacheHeight,pos:dis+0});//pos小于0
				speed=desktopOldY/(new Date().getTime()-touchBeginTime)*1000|0;
				if(Math.abs(speed)>500&&Math.abs(desktopOldY)>10)dis=dis-speed*0.2;
				if(dis>0)dis=0;//上面出来了
				else if(dis<cacheHeight)dis=cacheHeight;//下面出来了
				desktopY=dis;
				scroll_view.style.transform="translate3d(0,"+desktopY+"px,0)";
			});
		});
		document.querySelectorAll("iscroll-y").forEach(function(scroll_view){/*滚动*/
			if(scroll_view.iscroll)return;
			scroll_view.iscroll=true
			var touchBeginTime=0;
			var oldY=0;
			var desktopY=0;
			var desktopOldY=0;
			var dis=0;
			var cacheHeight=0;
			var speed;
			var totalheight=0;
			scroll_view.style.transition="transform 0.5s";
			scroll_view.ch_toScroll=function(y){
				dis=-y;
				totalheight=0;
				scroll_view.childNodes.forEach(function(elem){
					if(!elem.offsetHeight)return;
					var ele=getComputedStyle(elem);
					totalheight+=elem.offsetHeight+parseInt(ele.marginTop)+parseInt(ele.marginBottom);
				});
				cacheHeight=-totalheight+scroll_view.offsetHeight;
				if(cacheHeight>0)cacheHeight=0;
				if(dis>0)dis=0;//上面出来了
				else if(dis<cacheHeight)dis=cacheHeight;//下面出来了
				desktopY=dis;
				scroll_view.style.transform="translate3d(0,"+desktopY+"px,0)";
				return true;
			};
			scroll_view.ch_getScroll=function(){
				return -dis;//x,y
			};
			scroll_view.onmousewheel=function(event){
				if(event.wheelDelta>0)
					dis=dis+200;//向上滑
				else
					dis=dis-200;//往下滑
				totalheight=0;
				scroll_view.childNodes.forEach(function(elem){
					if(!elem.offsetHeight)return;
					var ele=getComputedStyle(elem);
					totalheight+=elem.offsetHeight+parseInt(ele.marginTop)+parseInt(ele.marginBottom);
				});
				cacheHeight=-totalheight+scroll_view.offsetHeight;
				if(cacheHeight>0)cacheHeight=0;
				if(dis>0)dis=0;//上面出来了
				else if(dis<cacheHeight)dis=cacheHeight;//下面出来了
				desktopY=dis;
				scroll_view.style.transform="translate3d(0,"+desktopY+"px,0)";
			};
			scroll_view.addEventListener('touchstart',function(event){
				scroll_view.style.transition="transform 0s";
				oldY=event.touches[0].clientY;
				totalheight=0;
				scroll_view.childNodes.forEach(function(elem){
					if(!elem.offsetHeight)return;
					var ele=getComputedStyle(elem);
					totalheight+=elem.offsetHeight+parseInt(ele.marginTop)+parseInt(ele.marginBottom);
				});
				cacheHeight=-totalheight+scroll_view.offsetHeight;
				if(cacheHeight>0)cacheHeight=0;
				touchBeginTime=new Date().getTime();
				desktopOldY=0;
			});
			scroll_view.addEventListener('touchmove',function(event){
				desktopOldY=(oldY-event.touches[0].clientY)|0;
				dis=((desktopY-desktopOldY)|0);
				if(dis>0)//上面出来了
					dis=dis*0.3;//((desktopX-desktopOldX*((400-dis)/400))|0);
				else if(dis<cacheHeight)//右边出来了
					dis=cacheHeight-(cacheHeight-dis)*0.3;
				 
				scroll_view.style.transform="translate3d(0,"+dis+"px,0)";
			});
			scroll_view.addEventListener('touchend',function(event){
				scroll_view.style.transform="scale(1)";
				scroll_view.style.transition="transform 0.5s";
				var onPull=scroll_view.getAttribute("ch-pull");
				if(onPull&&typeof app[onPull] === "function")
					if(dis>0)//下拉刷新
						app[onPull]({pos:dis});//pos大于0
					else if(dis<cacheHeight)//上拉加载
						app[onPull]({pos:dis-cacheHeight});//pos小于0
				speed=desktopOldY/(new Date().getTime()-touchBeginTime)*1000|0;
				if(Math.abs(speed)>500&&Math.abs(desktopOldY)>10)dis=dis-speed*0.2;
				if(dis>0)dis=0;//上面出来了
				else if(dis<cacheHeight)dis=cacheHeight;//下面出来了
				
				desktopY=dis;
				scroll_view.style.transform="translate3d(0,"+desktopY+"px,0)";
			}); 
		});
		document.querySelectorAll("iscroll-x").forEach(function(scroll_view){/*滚动*/
			if(scroll_view.iscroll)return;
			scroll_view.iscroll=true
			var touchBeginTime=0;
			var oldX=0;
			var desktopX=0;
			var desktopOldX=0;
			var dis=0;
			var cacheWidth=0;
			var speed;
			var totalwidth=0;
			scroll_view.style.transition="transform 0.5s";
			scroll_view.ch_toScroll=function(x){
				dis=-x;
				totalwidth=0;
				scroll_view.childNodes.forEach(function(elem){
					if(!elem.offsetWidth)return; 
					var ele=getComputedStyle(elem);
					totalwidth+=elem.offsetWidth+parseInt(ele.marginLeft)+parseInt(ele.marginRight);
				});
				cacheWidth=-totalwidth+scroll_view.offsetWidth;
				if(cacheWidth>0)cacheWidth=0;
				if(dis>0)dis=0;//上面出来了
				else if(dis<cacheWidth)dis=cacheWidth;//下面出来了
				desktopX=dis;
				scroll_view.style.transform="translate3d("+desktopX+"px,0px,0px)";
				return true;
			};
			scroll_view.ch_getScroll=function(){
				return -dis;//x,y
			};
			scroll_view.onmousewheel=function(event){
				if(event.wheelDelta>0)
					dis=dis+200;//向上滑
				else
					dis=dis-200;//往下滑
				totalwidth=0;
				scroll_view.childNodes.forEach(function(elem){
					if(!elem.offsetWidth)return; 
					var ele=getComputedStyle(elem);
					totalwidth+=elem.offsetWidth+parseInt(ele.marginLeft)+parseInt(ele.marginRight);
				});
				cacheWidth=-totalwidth+scroll_view.offsetWidth;
				if(cacheWidth>0)cacheWidth=0;
				if(dis>0)dis=0;//上面出来了
				else if(dis<cacheWidth)dis=cacheWidth;//下面出来了
				desktopX=dis;
				scroll_view.style.transform="translate3d("+desktopX+"px,0px,0px)";
				//console.log("transform:",scroll_view.style.transform);
			};
			scroll_view.addEventListener('touchstart',function(event){
				scroll_view.style.transition="transform 0s";
				oldX=event.touches[0].clientX;
				totalwidth=0;
				scroll_view.childNodes.forEach(function(elem){
					if(!elem.offsetWidth)return;
					var ele=getComputedStyle(elem);
					totalwidth+=elem.offsetWidth+parseInt(ele.marginLeft)+parseInt(ele.marginRight);
				});
				console.log("cacheWidth:",totalwidth);
				cacheWidth=scroll_view.offsetWidth-totalwidth;
				console.log(scroll_view.offsetWidth,cacheWidth);
				if(cacheWidth>0)cacheWidth=0;
				touchBeginTime=new Date().getTime();
				desktopOldX=0;
			});
			scroll_view.addEventListener('touchmove',function(event){
				desktopOldX=(oldX-event.touches[0].clientX)|0;
				dis=((desktopX-desktopOldX)|0);
				if(dis>0)//上面出来了
					dis=dis*0.3;
				else if(dis<cacheWidth)//右边出来了
					dis=cacheWidth-(cacheWidth-dis)*0.3;
				 
				scroll_view.style.transform="translate3d("+dis+"px,0px,0px)";
			});
			scroll_view.addEventListener('touchend',function(event){
				scroll_view.style.transform="scale(1)";
				scroll_view.style.transition="transform 0.5s";
				var onPull=scroll_view.getAttribute("ch-pull");
				if(onPull&&typeof app[onPull] === "function")
					if(dis>0)//右拉刷新
						app[onPull]({pos:dis});//pos大于0
					else if(dis<cacheWidth)//左拉加载
						app[onPull]({pos:dis-cacheWidth});//pos小于0
				speed=desktopOldX/(new Date().getTime()-touchBeginTime)*1000|0;
				if(Math.abs(speed)>500&&Math.abs(desktopOldX)>10)dis=dis-speed*0.2;
				if(dis>0)dis=0;//上面出来了
				else if(dis<cacheWidth)dis=cacheWidth;//下面出来了
				desktopX=dis;
				scroll_view.style.transform="translate3d("+desktopX+"px,0px,0)";
			}); 
		});
		document.querySelectorAll(".ch-ripple").forEach(function(elem){/*ripple模块 CH制作 支持鼠标、多点触屏*/
			if(elem.ch_ripple)return;
			elem.ch_ripple=true;
			var start=function(x,y,id){
				var el=document.createElement("view");
				el.ch_rippleId=id;
				el.style.position="absolute";
				var pos=elem.getBoundingClientRect();
				var el_left=x-pos.left;
				var el_top=y-pos.top;
				var n=Math.sqrt(Math.max(
					el_left*el_left+el_top*el_top,
					Math.pow(el_left-pos.width,2)+el_top*el_top,
					Math.pow(el_left-pos.width,2)+Math.pow(el_top-pos.height,2),
					el_left*el_left+Math.pow(el_top-pos.height,2)
				))*2;
				el.style.backfaceVisibility="hidden";  
				el.style.perspective="1000";
				el.style.left=(el_left-n/2)+"px";
				el.style.top=(el_top-n/2)+"px";
				el.style.width=n+"px";
				el.style.height=n+"px";
				//el.style.zIndex="1";
				el.style.padding="0";
				el.style.margin="0";
				el.style.fontSize="0";
				el.style.pointerEvents="none";
				el.style.backgroundColor="rgba(0,0,0,.15)";
				el.style.borderRadius="50%";
				el.style.opacity=".35";
				el.style.transform="scale(0)";
				el.style.transitionDuration="2s";
				el.style.transitionTimingFunction="cubic-bezier(0.22, 0.61, 0.36, 1)";
				elem.appendChild(el);
				setTimeout(function(){
					el.style.transform="scale(1.01)";
				});
			};
			var end=function(id){
				var childs=elem.childNodes;
				for(var i=0;i<childs.length;i++){
					if(childs[i].nodeName!="VIEW")continue;
					var el=childs[i];
					if(el.ch_rippleId!=id)continue;
					(function(el){
						el.style.transitionDuration=".5s";
						requestAnimationFrame(function(){
							el.style.transform="scale(1)";
							el.style.opacity="0";
						});
						setTimeout(function(){
							if(el.parentElement)el.parentElement.removeChild(el);
						},500);
					})(el);
				} 
			};
			elem.addEventListener("touchstart",function(event){
				start(event.changedTouches[0].clientX,event.changedTouches[0].clientY,event.changedTouches[0].identifier);
			});
			elem.addEventListener("mousedown",function(event){
				start(event.clientX,event.clientY,-1);
			});
			elem.addEventListener("touchend",function(event){
				end(event.changedTouches[0].identifier);
			});
			elem.addEventListener("mouseup",function(event){
				end(-1);
			});
			elem.addEventListener("mouseleave",function(event){
				end(-1);
			});
		});
		document.querySelectorAll("[bindtap]").forEach(function(dom){//点击事件
			var d=dom.getAttribute("bindtap");
			dom.setAttribute("bindtaped",d);
			dom.removeAttribute("bindtap");
			dom.onclick=function(event){
				if(typeof app[d]==="function"){
					app[d](event,this);
				}else{
					console.warn("bindtap:未找到方法："+d);
				}
			}
		});
		document.querySelectorAll("[bindlongtap]").forEach(function(dom){//点击事件
			var d=dom.getAttribute("bindlongtap");
			dom.setAttribute("bindlongtaped",d);
			dom.removeAttribute("bindlongtap");
			var time;
			var begin=function(){
				time=setTimeout(function(){
					if(typeof app[d]==="function"){
						app[d]({target:dom,event:e,touch:e});
					}else{
						console.warn("bindlongtap:未找到方法："+d);
					}
				},600);
			};
			dom.addEventListener("touchstart",function(e){begin();});//触屏按下
			dom.addEventListener("mousedown",function(e){begin();});//鼠标按下
			['touchmove','touchend','mouseleave','mouseup','touchcancel'].forEach(function(item,index){
				dom.addEventListener(item,function(e){
					clearTimeout(time);
				});
			});
		});
		document.querySelectorAll("[catchtap]").forEach(function(dom){//防止冒泡的点击事件
			var d=dom.getAttribute("catchtap");
			dom.setAttribute("catchtaped",d);
			dom.removeAttribute("catchtap");
			dom.onclick=function(event){
				event.stopPropagation();//阻止冒泡
				if(typeof app[d]==="function"){
					app[d]({target:dom});
				}else{
					console.warn("catchtap:未找到方法："+d);
				}
			};
		});
	}
};//接口
})();//闭包
