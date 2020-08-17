app({
data: {
	login: "display:none;",
	path: "/webappos/api/os/dev.php", //配置后端访问的路径
	adminPath:"/webappos/api/os/dev.php",//管理后端路径
	logininfo: null,
	applist:null,
	appinfo:[],
	admin:false,//是否管理员
},login:function(res) {
	app.data.logininfo = res;
	app.data.admin = (res.zh === "admin");
	if (app.data.admin)
		$(".adminOption").show();//打开管理员能看到的界面
	else
		$(".adminOption").hide();

	// $("[page='login']").fadeOut();
	$("[page='login']").hide();
	$("[page='control']").show();
	// $("[page='control']").fadeIn();
	app.refresh();
	app.refreshController();
},manageUser:function(){//管理用户 管理员模块
	app.toggleHeaderFocus(2);
	document.getElementById("content").innerHTML = template("template_manageUser", app.data.applist);
	layui.use('table', function(){
		var table = layui.table;
		table.render({
			elem:"#manageUserTable",
			url:app.data.adminPath,
			title: '用户管理',
			cols: [
				[
					{field: "id", title:"用户id", sort: true},
					{field: "username", title: "账号", sort: true},
					{field: "userhash", title: "用户hash", sort: true},
					{field: "userkey", title: "用户私钥", sort: true},
					{field:"createTime", title: "注册时间", sort: true},
					{fixed: 'right', title:'操作', toolbar: '#manageUserTool'}
				]
			],
			defaultToolbar: ['filter', 'exports', 'print'],
			page: true,
			limit: 20,
			where:{
				type:"userlist",
				time: app.data.logininfo.logintime,
				userid: app.data.logininfo.userid,
				pwd: app.data.logininfo.hash
			},done:function(){
				app.refresh();
			}
		});
		table.on('tool(manageUserTable)', function(obj){
			var data = obj.data;
			console.log(data);
			if(obj.event === 'changePwd'){
				app.changePwd(obj.data.id);
			}
		});
	});
	app.refresh();
},createUser:function() {//创建用户
	layer.open({
		id: 1,
		type: 1,
		title: '创建用户',
		skin: 'layui-layer-rim',
		area: ['450px', 'auto'],
		content: ' <div class="row" style="width: 420px;  margin-left:7px; margin-top:10px;">'
			+ '<div class="layui-form-item">'
			+ '<label class="layui-form-label">新用户名   :</label>'
			+ '<div class="layui-input-block">'
			+ '<input id="layerValue1" type="text" class="layui-input" placeholder="请输入用户名">'
			+ '</div>'
			+ '</div>'
			+ '<div class="layui-form-item">'
			+ '<label class="layui-form-label">确认密码   :</label>'
			+ '<div class="layui-input-block">'
			+ '<input id="layerValue2" type="password" class="layui-input" placeholder="请输入密码">'
			+ '</div>'
			+ '</div>'
			+ '</div>'
		,
		btn: ['保存', '取消'],
		btn1: function (index, layero) {
			var username = $("#layerValue1").val();
			var password = $("#layerValue2").val();
			api.request({
				url: app.data.adminPath,
				type: "POST",
				dataType: "json",
				data: {
					type: "addUser",
					username: username,
					password: password,
					time: app.data.logininfo.logintime,
					userid: app.data.logininfo.userid,
					pwd: app.data.logininfo.hash
				},
				success: function (res) {
					if (res.res === 100) {
						if (res.text) api.toast(res.text);
					} else
						api.alert(res.text);
				}, fail: function () {
					api.alert("失败，请检查网络或配置是否正确！");
				}, complete: function () {
					$(".layui-laypage-btn").click();//刷新表格
					layer.close(index);
				}
			})
			console.log(index, layero);

		},
		btn2: function (index, layero) {
			layer.close(index);
		}
	});
},logout:function(){//注销
	window.location.reload();
},changePwd:function(userid2){
	layer.open({
		id: 1,
		type: 1,
		title: '修改密码',
		skin: 'layui-layer-rim',
		area: ['450px', 'auto'],
		content: ' <div class="row" style="width: 420px;  margin-left:7px; margin-top:10px;">'
			+ '<div class="layui-form-item">'
			+ '<label class="layui-form-label">新密码   :</label>'
			+ '<div class="layui-input-block">'
			+ '<input id="layerValue1" type="password" class="layui-input" placeholder="请输入密码">'
			+ '</div>'
			+ '</div>'
			+ '<div class="layui-form-item">'
			+ '<label class="layui-form-label">确认密码 :</label>'
			+ '<div class="layui-input-block">'
			+ '<input id="layerValue2" type="password" class="layui-input" placeholder="请再输入一遍密码">'
			+ '</div>'
			+ '</div>'
			+ '</div>'
		,
		btn: ['确认修改', '取消'],
		btn1: function (index, layero) {
			var value1=$("#layerValue1").val();
			var value2=$("#layerValue2").val();
			if(value1!==value2){
				api.toast("请确保两次输入是否一致！");
				return;
			}
			api.request({//登录接口
				url: app.data.adminPath,
				type: "POST",
				dataType: "json",
				data: {
					type: "changePwd",
					changeUserid: userid2,
					password:value1,
					time: app.data.logininfo.logintime,
					userid: app.data.logininfo.userid,
					pwd: app.data.logininfo.hash
				},
				success: function (res) {
					if (res.res === 100) {
						if (res.text) api.toast(res.text);
					} else
						api.alert(res.text);
				}, fail: function () {
					api.alert("失败，请检查网络或配置是否正确！");
				},complete:function(){
					layer.close(index);
				}
			})
		},
		btn2: function (index, layero) {
			layer.close(index);
		}
	});
},apptable:function() {//主区域显示应用表格
	//输入数据 app.data.applist

	var tableBody=[].concat(app.data.applist.data);//复制对象
	var tableHead=tableBody.splice(0,1)[0];
	var cols=[];
	var data=[];
	for(var i in tableHead)
		cols.push({field: tableHead[i], title: tableHead[i], sort: true});
	cols.push({fixed: 'right', title:'操作', toolbar: '#template_toolbar'});
	for(var i1 in tableBody){
		var item = {};
		var i=0;
		for(var i2 in tableHead)
			item[tableHead[i2]]=tableBody[i1][i++];
		data.push(item);
	}
	// console.log(data);

	document.getElementById("content").innerHTML = template("template_apptable", app.data.applist);
	layui.use('table', function(){
		var table = layui.table;
		table.render({
			elem:"#applistTable",
			title: '创建的小程序',
			cols: [
				cols
			],
			defaultToolbar: ['filter', 'exports', 'print'],
			data:data,
			page: true,
			limit: 20
		});
		table.on('tool(applistTable)', function(obj){
			var data = obj.data;
			if(obj.event === 'edit'){
				console.log(obj.data.id);
				app.chooseApp(obj.data["应用id"]);
			}
		});
	});
	app.refresh();
},createApp:function() {//创建小程序
	app.toggleHeaderFocus(1);
	document.getElementById("content").innerHTML = template("template_createApp", {});
	app.refresh();
	$("#addapp_formdata").submit(function (e) {//创建小程序
		e.preventDefault();
		api.request({//登录接口
			url: app.data.path,
			type: "POST",
			dataType: "json",
			data: $(this).serialize()+"&time="+app.data.logininfo.logintime+"&userid="+app.data.logininfo.userid+"&pwd="+app.data.logininfo.hash,
			success: function (res) {
				if (res.res === 100) {
					if (res.text) api.toast(res.text);
					app.refreshController();
				} else
					api.alert(res.text);
			}, fail: function () {
				api.alert("失败，请检查网络或配置是否正确！");
			}
		})
	});
},chooseApp:function(event,target) {//选中了一个应用，这里要查看某一个应用的详情
	api.showLoading("加载中...");
	var appid;
	if(typeof event==="number")
		appid = event;
	else
		appid = target.getAttribute("data-appid");
	var apphash="--";
	for(var i in app.data.applist.data){
		if(appid==app.data.applist.data[i][1]){
			apphash=app.data.applist.data[i][3];
		}
	}

	api.request({//登录接口
		url: app.data.path,
		type: "POST",
		dataType: "json",
		data: {
			type: "editapp",
			prog: appid,
			time: app.data.logininfo.logintime,
			userid: app.data.logininfo.userid,
			pwd: app.data.logininfo.hash
		},
		success: function (res) {
			console.log(res);
			if (res.res === 100) {
				app.data.appinfo[appid] = res;
				document.getElementById("content").innerHTML = template("template_appinfo", {
					data: res.data,
					appid: appid,
					apphash:apphash,
				});
				app.refresh();
			} else
				api.alert(res.text);//失败
		}, fail: function () {
			api.alert("失败，请检查网络或配置是否正确！");
		}, complete: function () {
			api.hideLoading();
		}
	});
},uploadCode:function(event,target){
	var appid=target.getAttribute("data-appid")|0;
	var type=target.getAttribute("data-type")|0;
	var ty;
	var version;
	var version_error=1;//1时版本冲突时会回退。
	if(type===0) {
		ty = "html";
		version=app.data.appinfo[appid].data.version_html;
	}else if(type===1) {
		ty = "js";
		version=app.data.appinfo[appid].data.version_js;
	}else if(type===2) {
		ty = "json";
		version=app.data.appinfo[appid].data.version_json;
	}

	api.showLoading("正在上传中...")
	var code=app.data.editor.getValue();
	api.request({//登录接口
		url: app.data.path,
		type: "POST",
		dataType: "json",
		data: {
			type: "saveapp",
			prog: appid,
			time: app.data.logininfo.logintime,
			userid: app.data.logininfo.userid,
			pwd: app.data.logininfo.hash,
			ty:ty,
			version:version,
			version_error:version_error,
			code:Base64.encode(code),
			fileid:type,
		},
		success: function (res) {
			// console.log(res);
			if (res.res === 100) {

				if(type===0) {
					app.data.appinfo[appid].data.code_html=code;
					app.data.appinfo[appid].data.version_html=res.data.version;
				}else if(type===1) {
					app.data.appinfo[appid].data.code_js=code;
					app.data.appinfo[appid].data.version_js=res.data.version;
				}else if(type===2) {
					app.data.appinfo[appid].data.code_json=code;
					app.data.appinfo[appid].data.version_json=res.data.version;
				}
				api.toast("上传成功！");
				app.refresh();
			} else
				api.alert(res.text);//失败
		}, fail: function () {
			api.alert("失败，请检查网络或配置是否正确！");
		}, complete: function () {
			api.hideLoading();
		}
	});
	layui.element.render();
	api.bind();
},refresh:function(){
	layui.element.render();
	api.bind();
},editFile:function(event,target) {//编辑HTML、JS、JSON文件
	var appid = target.getAttribute("data-appid");
	var type = target.getAttribute("data-type")|0;
	if (!app.data.appinfo[appid]) {
		api.toast("先选中一个小程序吧！");
		return;
	}
	var appinfo = app.data.appinfo[appid].data;
	var code;
	if (type === 0) code = appinfo.code_html;
	if (type === 1) code = appinfo.code_js;
	if (type === 2) code = appinfo.code_json;

	document.getElementById("content").innerHTML = template("template_editCode", {
		title: appinfo.name,
		appid: appid,
		type: type
	});
	app.refresh();
	var editor = ace.edit("code");
	app.data.editor=editor;
	//设置风格和语言（更多风格和语言，请到github上相应目录查看）
	var theme = "clouds";
	var language;
	if (type === 0) language = "html";
	if (type === 1) language = "javascript";
	if (type === 2) language = "json";
	editor.setValue(code);
	editor.setTheme("ace/theme/" + theme);
	editor.session.setMode("ace/mode/" + language);
	editor.setFontSize(18);//字体大小
	editor.setReadOnly(false);//设置只读（true时只读，用于展示代码）
	editor.setOption("wrap", "free");//自动换行,设置为off关闭
	ace.require("ace/ext/language_tools");//启用提示菜单
	editor.setOptions({
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: true
	});
},compileApp:function(event,target){//编译APP
	var appid=target.getAttribute("data-appid");
	var version=app.data.appinfo[appid].data.version1;
	if(version.indexOf(".")>=0){//1.0改成1.1
		var versionArr=version.split(".");
		console.log((versionArr[versionArr.length-1]|0)+1);
		versionArr[versionArr.length-1]=""+((versionArr[versionArr.length-1]|0)+1);
		version=versionArr.join(".");
	}
	version=prompt("版本号",version);
	if(!version)return;
	api.showLoading("正在编译中...");
	api.request({//登录接口
		url: app.data.path,
		type: "POST",
		dataType: "json",
		data: {
			type: "compileapp",
			prog: appid,
			version:version,
			time: app.data.logininfo.logintime,
			userid: app.data.logininfo.userid,
			pwd: app.data.logininfo.hash
		},
		success: function (res) {
			if (res.res === 100) {
				api.toast("编译成功！");
				app.data.appinfo[appid].data.version1=version;
			} else
				api.alert(res.text);//失败
		}, fail: function () {
			api.alert("失败，请检查网络或配置是否正确！");
		}, complete: function () {
			api.hideLoading();
		}
	})
},submitApp:function(event,target){//提交APP
	var appid=target.getAttribute("data-appid");
	api.showLoading("正在提交中...");
	api.request({//登录接口
		url: app.data.path,
		type: "POST",
		dataType: "json",
		data: {
			type: "submitapp",
			prog: appid,
			time: app.data.logininfo.logintime,
			userid: app.data.logininfo.userid,
			pwd: app.data.logininfo.hash
		},
		success: function (res) {
			console.log(res);
			if (res.res === 100) {
				api.toast("提交成功！");
			} else
				api.alert(res.text);//失败
		}, fail: function () {
			api.alert("失败，请检查网络或配置是否正确！");
		}, complete: function () {
			api.hideLoading();
		}
	})
},applist:function() {
        var data = [].concat(app.data.applist.data);//复制对象
        data.splice(0, 1);
        document.getElementById("applist").innerHTML = template("template_applist", {data: data});
        app.refresh();
},uploadImg:function(event,target){
    var appid=target.getAttribute("data-appid")|0;
    var inputObj=document.createElement('input')
    inputObj.setAttribute('id','_ef');
    inputObj.setAttribute('type','file');
    inputObj.setAttribute("style",'visibility:hidden');
    document.body.appendChild(inputObj);
    inputObj.onchange=function(event){
        var file=this.files[0];
        var reader=new FileReader();
        reader.readAsDataURL(file)
        reader.onload=function(e){
            var base64=e.target.result;
            base64=base64.substring(base64.indexOf(",")+1);
            var fd=new FormData();
            fd.append("type", "uploadimg");
            fd.append("prog", appid);
            fd.append("img", base64);
            fd.append("time", app.data.logininfo.logintime);
            fd.append("userid", app.data.logininfo.userid);
            fd.append("pwd", app.data.logininfo.hash);

            var xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {
                xhr.open("POST", app.data.path, true);
            }else if (typeof XDomainRequest != "undefined") {
                xhr = new XDomainRequest();
                xhr.open("POST", app.data.path);
            }else{
                xhr = null;
            }
            xhr.addEventListener("load", function(e) {// 完成
                console.log(e);
                api.toast("上传图标成功！");
            }, false);
            xhr.addEventListener("error", function(e){
                self.onFailure(file, xhr.responseText);
                api.toast("出错了，请检查网络，或上传大小超过限制！");
            }, false);
            xhr.send(fd);
            this.value="";
        };
    };
    inputObj.click();
},onLoad:function(){
	$("[page='login']").show();
  	// api.toast("启动成功！");
	// this.login({"zh":"admin","res":100,"logintime":1578199291,"userid":"f4cbc43321e81e9afb978cd7b7ed4f9dafe22507","hash":"c73d99ed06874538d855abbe7875d72a9c728679"});
  	//$("[page='login']").fadeIn();
  	$("#login_formdata").submit(function(e){//登录控制台
		e.preventDefault();
		var zh=$("#login_formdata input[name='zh']").val();
		api.request({//登录接口
			url:app.data.path,
			type:"POST",
			dataType:"json",
			data:$(this).serialize(),
			success:function(res){
				console.log(res);
				if(res.res===100){
					res.zh=zh;
					app.login(res);
					//登录成功！
				}else
					api.alert(res.text);//登录失败
			},fail:function(){
				api.alert("登录失败，请检查网络或配置是否正确！");
			}
		})
	});
  },refreshController:function(){
		//刷新首页
		app.toggleHeaderFocus(0);
		api.request({//登录接口
			url:app.data.path,
			type:"POST",
			dataType:"json",
			data:{
				type:"listapp",
				time:app.data.logininfo.logintime,
				userid:app.data.logininfo.userid,
				pwd:app.data.logininfo.hash
			},
			success:function(res){
				app.data.applist=res;
				app.applist();
				app.apptable();
			},fail:function(){
				api.alert("刷新首页失败，请检查网络！");
			}
		});
		app.refresh();
  },toggleHeaderFocus:function(index) {
		var i = 0;
		index++;
		document.querySelectorAll("#header>li").forEach(function (dom) {
			if (i === index)
				dom.className = "layui-nav-item layui-this";
			else dom.className = "layui-nav-item";
			i++;
		});
  }
});