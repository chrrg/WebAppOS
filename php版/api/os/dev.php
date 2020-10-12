<?php
header("Content-Type: application/json; charset=utf-8;");
include_once "config.class.php";
set_error_handler('phperror');
function phperror($type, $message, $file, $line){p(0,'error: '.$type.':'.$message.' in '.$file . ' on ' . $line . ' line .');}
$con=WebAppOSconfig::init()->get_mysql();
$type=r("type");
(function($type){
	global $con;
	switch($type){
		case "login"://开发工具登录
			$zh=r("zh");
			$mm=r("mm");
			$user=$con->query("select * from app_username where username='$zh'")->fetch_assoc();
			if(!$user)p(80,"账号或密码错误！");
			$mm=sha1("webappos:".$mm);
			$user=$con->query("select * from app_username,app_userinfo where app_username.password='$mm' and app_username.id='$user[id]' and app_username.userid=app_userinfo.id")->fetch_assoc();
			if($user){
				$token=get_hash();
				$time=time();
				$start=date("Y-m-d H:i:s",$time);
				$end=date("Y-m-d H:i:s",$time+86400);
				$con->query("INSERT INTO app_token(`userid`,`token`,`startTime`,`endTime`)VALUES('$user[id]','$token','$start','$end')");
				j([
					"res"=>100,
					"logintime"=>$time,
					"userid"=>$user["uniquekey"],
					"hash"=>$token,
				]);
			}else{
				p(80,"账号或密码错误！");
			}
			
			return;
		case "listapp"://开发工具列应用
			$user=check_dev();
			p(100,"",list_app($user['userid']));
			return;
		case "addapp"://开发工具加应用
			$user=check_dev();
			
			
			$appname=r("appname");
			$appdes=r("appdes");
			$publickey=get_hash();
			$privatekey=get_hash();
			if($con->query("select * from app_info where name='$appname'")->fetch_array()){
				p(80,"此应用名称已被占用！");
			}
			$con->query("INSERT INTO `app_info`(`name`, `des`,`publickey`, `privatekey`,`userid`)
			VALUES ('$appname','$appdes','$publickey','$privatekey',$user[userid])");
			$appid=$con->insert_id;
			
			//在这里添加默认代码：
$defaultcode_html='<view ch-html="myText" :style="myStyle" ch></view>';

$defaultcode_js='app({
	setting:{
		title:"'.$appname.'",
		color:"#AA8800",
	},
	data:{//应用数据
		myText:"Hello World",
		myStyle:"text-align:center;",
	},
	onLoad:function(event){//启动应用
		//这里是应用启动时触发
		console.log("触发了onLoad事件！");
		
		
		
	},
	onHide:function(){//应用隐藏时
		console.log("触发了onHide事件！");
	},
	onShow:function(){//应用显示时
		console.log("触发了onShow事件！");
	},
	onBack:function(){//用户触摸返回键时
		//return false;//拦截返回键，应用内自行处理
		console.log("触发了onBack事件！");
	},
	onUnload:function(){//应用销毁时
		console.log("触发了onUnload事件！");
	},
	onEvent:function(event){//当接收到事件时触发
		console.log("触发了onEvent事件！");
	},
	onMessage:function(event){//当应用接收到其他应用发来的消息时
		console.log("触发了onMessage事件！");
	},
	onUpdate:function(event){//应用更新时
		//return false;//拦截内置更新机制，自行处理，谨慎使用，小心应用无法正常更新。
		console.log("触发了onUpdate事件！");
	},
	//其它函数为自定义函数
});';
$defaultcode_json='{
	"minify":true
}';
			$defaultcode_html=$con->real_escape_string($defaultcode_html);
			$defaultcode_js=$con->real_escape_string($defaultcode_js);
			$defaultcode_json=$con->real_escape_string($defaultcode_json);
			
			$con->query("INSERT INTO `app_code`(`version`, `code`,`appid`, `type`)
			VALUES ('0','$defaultcode_html','$appid','1')");//html
			$id1=$con->insert_id;
			$con->query("INSERT INTO `app_code`(`version`, `code`,`appid`, `type`)
			VALUES ('0','$defaultcode_js','$appid','2')");//js
			$id2=$con->insert_id;
			$con->query("INSERT INTO `app_code`(`version`, `code`,`appid`, `type`)
			VALUES ('0','$defaultcode_json','$appid','3')");//json
			$id3=$con->insert_id;
			
			$con->query("update app_info set 
			`htmlversion`='0',`htmlcode`='$id1',
			`jsversion`='0',`jscode`='$id2',
			`jsonversion`='0',`jsoncode`='$id3'
			where id=$appid and userid=$user[userid]");
			
			p(100,"",list_app($user['userid']));
			//die(json_encode(array("res"=>100,"data"=>$userarray)));
			return;
		case "editapp"://开发工具编辑应用
			$user=check_dev();
			$appid=r("prog");
			$app=app_info($appid,$user['userid']);
			
			$code_html=$app['htmlcode'];
			$code_js=$app['jscode'];
			$code_json=$app['jsoncode'];
			$code_img=$app['imgfile'];
			if($code_html)$code_html=$con->query("select code from app_code where id=$code_html and appid=$appid")->fetch_array()[0];
			if($code_js)$code_js=$con->query("select code from app_code where id=$code_js and appid=$appid")->fetch_array()[0];
			if($code_json)$code_json=$con->query("select code from app_code where id=$code_json and appid=$appid")->fetch_array()[0];
			if($code_img)$code_img=$con->query("select data from app_img where id=$code_img and appid=$appid")->fetch_array()[0];

			if(!$code_html)$code_html="";
			if(!$code_js)$code_js="";
			if(!$code_json)$code_json="";
			if(!$code_img)$code_img="";
			
			$version1="";
			$version2="";
			
			if($app["compile"])
				$version1=$con->query("select version from app_compile where id=$app[compile]")->fetch_array()[0];//发布版

			if($app["compile_version"])
				$version2=$con->query("select version from app_compile where id=$app[compile_version]")->fetch_array()[0];//体验版
			$filelist=[];
			$filelist_res=$con->query("select * from app_file where appid=$appid");
			while($row=$filelist_res->fetch_assoc()){
				$filelist[]=["name"=>$row["filename"],"code"=>$row["id"]];
			}
			
			
			p(100,"",array(
				"name"=>$app['name'],
				"des"=>$app['des'],
				"version1"=>$version1,//线上版本号
				"version2"=>$version2,//体验版本号
				"version_html"=>$app['htmlversion'],
				"version_js"=>$app['jsversion'],
				"version_json"=>$app['jsonversion'],
				"code_html"=>$code_html,
				"code_js"=>$code_js,
				"code_json"=>$code_json,
				"code_img"=>$code_img,
				"privatekey"=>md5("glutyibancaohong_".$app['publickey']."_v2"),
				"filelist"=>$filelist
			));
			return;
		case "extrafile_get"://读取额外文件
			$user=check_dev();
			$apphash=r("prog");//应用哈希
			$fileid=r("fileid");//文件id
			$app=app_info($apphash,$user['userid']);
			$row=$con->query("select * from app_file where appid = '$app[id]' and id='$fileid'")->fetch_assoc();
			if(!$row)p(0,"文件没空！");
			if(!$row["codeid"])p(100,"ok",[
				"content"=>""//没有编辑过就返回空
			]);
			$fileid=$row["codeid"];
			$version=$row["version"];
			$row=$con->query("select * from app_code where appid = '$app[id]' and id='$fileid'")->fetch_assoc();//从源码库读取代码
			if(!$row)p(0,"代码无效！");
			p(100,"文件获取成功，文件版本号：".$version,[
				"content"=>$row["code"],//内容
				"version"=>$version//文件版本号
			]);
			return;
		case "extrafile_new":
			$user=check_dev();
			$apphash=r("prog");//应用哈希
			$filename=r("filename");//文件名
			$app=app_info($apphash,$user['userid']);
			//判断是否重名
			if(preg_match("/[\',:;*?~`!@#$%^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/",$filename))p(0,"文件名不合法！");
			$row=$con->query("select * from app_file where filename='$filename' and appid='$app[id]'")->fetch_assoc();
			if($row)p(0,"你看看是不是文件名重复了？");
			$con->query("INSERT INTO `app_file`(`appid`, `filename`) VALUES ('$app[id]','$filename')");//新建文件呀
			
			$filelist=[];
			$filelist_res=$con->query("select * from app_file where appid='$app[id]'");
			while($row=$filelist_res->fetch_assoc()){
				$filelist[]=["name"=>$row["filename"],"code"=>$row["id"]];
			}
			p(100,"创建文件成功！",["filelist"=>$filelist]);
			
			return;
		case "extrafile_delete":
			$user=check_dev();
			$apphash=r("prog");//应用哈希
			$fileid=r("fileid");//文件id
			$app=app_info($apphash,$user['userid']);
			$row=$con->query("select * from app_file where id='$fileid' and appid='$app[id]'")->fetch_assoc();
			if(!$row)p(0,"文件不存在或者不是你的删不了");
			$con->query("update app_file set appid='0' where appid='$app[id]' and id='$fileid'");
			
			
			$filelist=[];
			$filelist_res=$con->query("select * from app_file where appid=$app[id]");
			while($row=$filelist_res->fetch_assoc()){
				$filelist[]=["name"=>$row["filename"],"code"=>$row["id"]];
			}
			p(100,"文件已删除！",["filelist"=>$filelist]);
			
			
			return;
		case "saveapp"://开发工具保存应用
			$user=check_dev();
			$ty=r("ty");//类型
			$appid=r("prog");//应用id
			$code=remove_bom(base64_decode($_POST["code"]??die));//代码
			$old_version=r("version");//版本
			$version_error=r("version_error");//版本号异常不允许上传
			if(trim($code)=='')p(0,"上传失败，代码不允许为空，请重新上传！");
			$app=app_info($appid,$user['userid']);
			$tyid=0;
			if($ty=="html"){
				$tyid=1;
			}elseif($ty=="js"){
				$tyid=2;
			}elseif($ty=="json"){
				$tyid=3;
			}elseif($ty=="file"){
				$tyid=4;
				$fileid=r("fileid");//文件id
				$row=$con->query("select * from app_file where appid = '$app[id]' and id='$fileid'")->fetch_assoc();
				if(!$row)p(0,"不存在这个文件！");
				if($row["version"]!=$old_version){//版本号异常
					if($version_error=="1")p(10,"不正确的版本号！");
					$version_error=true;
				}else $version_error=false;
				
				//$fileid=$row["codeid"];
				$version=intval($row["version"])+1;
				$code=$con->real_escape_string($code);
				$con->query("INSERT INTO `app_code`(`version`, `code`,`appid`, `type`) VALUES ('$version','$code','$app[id]','4')");
				$id=$con->insert_id;
				$con->query("update app_file set `version`='$version',`codeid`='$id' where id='$fileid' and appid='$app[id]'");
				//更新文件指向的源码id
				p(100,"",[
					"version"=>$version,//最新版本号
					"version_error"=>$version_error,//版本号更改提示
				]);
			}else{
				p(0,"错了！！！");
			}
			if($app[$ty."version"]!=$old_version){//版本号异常
				if($version_error=="1")p(10,"不正确的版本号！");
				$version_error=true;
			}else $version_error=false;
			
			$version=$app[$ty."version"]+1;//升级
			$appid=$app["id"];
			$code=$con->real_escape_string($code);
			$con->query("INSERT INTO `app_code`(`version`, `code`,`appid`, `type`)
			VALUES ('$version','$code','$appid','$tyid')");
			$id=$con->insert_id;
			$con->query("update app_info set `{$ty}version`='$version',`{$ty}code`='$id'
			where id=$appid and userid=$user[userid]");
			
			p(100,"",array(
				"version"=>$version,//最新版本号
				"version_error"=>$version_error,//版本号更改提示
				
			));
			return;
		case "compileapp"://编译将代码编译为体验版
			$user=check_dev();
			$version=r("version");//自己输入的版本号
			$appid=r("prog");//应用id
			$app=app_info($appid,$user['userid']);
			$code=get_hash();
			require_once '../../module/jsmin.class.php';
			$code_html=$app['htmlcode'];
			$code_js=$app['jscode'];
			$code_json=$app['jsoncode'];
			//var_dump($code_html);
			if($code_html)$code_html=$con->query("select code from app_code where id=$code_html and appid=$appid")->fetch_array()[0];
			if($code_js)    $code_js=$con->query("select code from app_code where id=$code_js and appid=$appid")  ->fetch_array()[0];
			if($code_json)$code_json=$con->query("select code from app_code where id=$code_json and appid=$appid")->fetch_array()[0];
			if(!$code_html)$code_html="";
			if(!$code_js)$code_js="";
			if(!$code_json)$code_json="";
			
			$rs=$con->query("select * from app_file where appid='$app[id]'");
			while($row=$rs->fetch_assoc()){
				if($row["codeid"]){
					$content=$con->query("select * from app_code where id='$row[codeid]' and appid='$app[id]'");
					if(!$content)p(0,"ch_include错误！");
					$content=$content->fetch_assoc()["code"];
				}else $content="";
				$code_html=str_replace("<!--ch_include $row[filename]-->",$content,$code_html);
				$code_js=str_replace("<!--ch_include $row[filename]-->",$content,$code_js);
				$code_json=str_replace("<!--ch_include $row[filename]-->",$content,$code_json);

				if($row["filename"]=="main.cs"){//开始编译C#
					// p(0,"test");
					$cscode=$con->query("select * from app_code where id='$row[codeid]' and appid='$app[id]'")->fetch_assoc();
					if(!$cscode)p(0,"main.cs 编译前错误！");
					$json_data=json_encode([
						"uuid"=>$app["publickey"],
						"code"=>$cscode["code"],
						"privatekey"=>$app["privatekey"],
						"Admin"=>$user['userid']===1
					]);
					$conn = curl_init("http://192.168.142.1:25555/");//127.0.0.1
			        curl_setopt($conn, CURLOPT_RETURNTRANSFER, 1);
			        curl_setopt($conn, CURLOPT_POST, 1);
			        curl_setopt($conn, CURLOPT_POSTFIELDS, $json_data);
			        curl_setopt($conn, CURLOPT_HTTPHEADER, array("Expect:"));
			        $result=curl_exec($conn);
			        if(!$result){
			        	p(0,"编译器无响应！");
			        }
			        $resultjson=json_decode($result);
			        if(!$resultjson)p(0,$result);//不是json
			        
			        if($resultjson->Build){
			        	//编译成功
			        }else{
			        	p(0,$resultjson->Message);
			        }

				}
			}
			//var_dump($code_html);die;
			//编译过程开始
			//p(0,JSMin::minify($code_json));
			
			$compile_option=json_decode(JSMin::minify($code_json));
			if(!$compile_option)p(0,"编译选项json语法错误！");
			//p(0,'test'.$code_json);
			if($compile_option){//是否有json编译选项
				if($compile_option->minify??false){
					$code_html=trim(compress_html($code_html));
					$code_js=trim(JSMin::minify($code_js));
				}
				$data=$compile_option->data??[];//编译选项提供的额外信息，可以被应用获取的信息
				
			}
			//编译过程结束
			
			
			w("/mnt/hgfs/static/in/cache/$code.html",$code_html);
			w("/mnt/hgfs/static/in/cache/$code.js",$code_js);
			
			
			$con->query("INSERT INTO `app_compile`(`userid`, `appid`,`version`, `use_html`, `use_js`, `use_json`,`destinationhtml`, `destinationjs`)
			VALUES ('$user[userid]','$appid','$version','$app[htmlcode]','$app[jscode]','$app[jsoncode]','$code.html','$code.js')");
			$id=$con->insert_id;
			$codehtml=$con->real_escape_string($code_html);
			$codejs=$con->real_escape_string($code_js);
			
			$con->query("INSERT INTO app_compiled(targetid,codehtml,codejs)
			values('$id','$codehtml','$codejs')");
			
			$con->query("update app_info set compile_version=$id where id=$appid");
			p(100,"",array(
				"server_time"=>time(),
				"version"=>$version,
			));
			return;
		case "submitapp"://开发工具提交审核应用
			$user=check_dev();
			$appid=r("prog");//应用id
			$app=app_info($appid,$user['userid']);
			
			$version1="";
			$version2="";
			if(!$app["compile_version"])p(0,"未提交体验版！");
			/*if($app["compile"])
				$version1=$con->query("select version from app_compile where id=$app[compile]")->fetch_array()[0];//发布版

			if($app["compile_version"])
				$version2=$con->query("select version from app_compile where id=$app[compile_version]")->fetch_array()[0];//体验版
			*/
			
			
			$con->query("INSERT INTO `app_check`(`target`, `version`,`userid`, `status`, `check_text`)
			VALUES ($appid,'$app[compile_version]','$user[userid]','100','ok')");//提交审核
			//0未审核
			//100审核通过
			
			//发布版
			if($user['userid']==1||1==1){//   1==1代表全部过审  审核机制
				$con->query("INSERT INTO `app_check`(`target`, `version`,`userid`, `status`, `check_text`)
				VALUES ($appid,'$app[compile_version]','$user[userid]','100','ok')");//提交审核
				$con->query("update app_info set compile=compile_version where id=$appid");//设置审核通过
				if($app["compile"])
					$version1=$con->query("select version from app_compile where id=$app[compile_version]")->fetch_array()[0];
			}else{
				$con->query("INSERT INTO `app_check`(`target`, `version`,`userid`, `status`, `check_text`)
				VALUES ($appid,'$app[compile_version]','$user[userid]','0','wait')");//提交审核
			}
			p(100,"",array(
				"server_time"=>time(),
				"version"=>$version1,//已完成审核
			));
			return;
		case "uploadimg"://应用上传图标
			$user=check_dev();//检查开发者是否合法
			$appid=r("prog");//应用id
			$app=app_info($appid,$user['userid']);
			$img=$_POST["img"]??die;//应用id

			$upload=zipimg($img,$app['publickey']);
			$upload2=$con->real_escape_string($upload);

			$con->query("INSERT INTO `app_img`(`appid`, `data`)
			VALUES ('$appid','$upload2')");//存储
			w("/mnt/hgfs/static/in/icon/".$app['publickey'].".png",base64_decode($upload));
			$con->query("update app_info set imgfile='$con->insert_id',imgversion=imgversion+1 where id = '$appid'");//修改图标
			p(100,"",array("code_img"=>$upload));
			
			return;
		case "test":
			//$userarray=[["id","应用id","标题","公钥"]];
			//$userarray=db::get()->arr("select * from app_info,app_img where app_info.userid=1 and app_info.imgfile=app_img.id",function($app,$i){
			//	zipimg($app['data'],$app['publickey']);
			//});
			//return $userarray;
	
			return;
		case "userlist":
			$user=check_dev();//检查开发者是否合法
			if($user["userid"]!=1)p(20,"permission refuse!");//管理员的userid为1，如果不为1就结束
			$count=$con->query("select count(*) from app_username,app_userinfo where app_username.userid=app_userinfo.id")->fetch_array()[0];
			$page=r("page");
			$limit=r("limit");
			$num1=($page-1)*$limit;
			$num2=$limit;
			$rs=$con->query("select * from app_username,app_userinfo where app_username.userid=app_userinfo.id limit $num1,$num2");
			$arr=[];
			while($row=$rs->fetch_assoc())
				$arr[]=["id"=>$row["id"],"username"=>$row["username"],"createTime"=>$row["createTime"],"userhash"=>$row["uniquekey"],"userkey"=>$row["identifykey"]];
			die(json_encode(["code"=>0,"msg"=>"","count"=>$count,"data"=>$arr]));
			return;
		case "addUser":
			$user=check_dev();//检查开发者是否合法
			if($user["userid"]!=1)p(20,"permission refuse!");
			
			$zh=r("username");//用户
			$mm=r("password");//密码
			if(strlen($zh)<2)p(81,"账号名太短！");
			if(strlen($mm)<4)p(82,"密码长度太短！");
			
			if($con->query("SELECT * from `app_username` WHERE username='$zh'")->fetch_assoc())p(80,"用户已存在！");
			$con->query("INSERT INTO `app_userinfo`(`uniquekey`,`identifykey`) VALUES ('".get_hash()."' , '".get_hash()."')");
			$con->query("INSERT INTO `app_username`(`userid`,`username`,`password`) VALUES ('".$con->insert_id."' , '$zh' , '".sha1("webappos:".$mm)."')");//映射userid到账号密码
			p(100,"",$con->affected_rows);
			return;
		case "changePwd":
			$user=check_dev();//检查开发者是否合法
			if($user["userid"]!=1)p(20,"permission refuse!");
			$uid=r("changeUserid");
			$mm=r("password");
			if(!is_numeric($uid))p(0,"number type error!");
			if(strlen($mm)<4)p(82,"密码长度太短！");
			$con->query("UPDATE app_username set password='".sha1("webappos:".$mm)."' WHERE userid='$uid'");
			p(100,"",$con->affected_rows);
			return;
		case 1://普通登录
			$rs=$con->query("select * from userinfo where uniquekey='123'")->fetch_array();
			if(!$rs){
				//login ok
				
				
			}else{
				//login fail
				
				
			}
			return;
		case 2://增加新应用
			//输入应用名称
			//应用描述
			$app=r("app");
			$des=r("des");
			$publickey=get_hash();
			$privatekey=get_hash();
			var_dump($app);
			//$con->real_escape_string();
			
			/*$rs=$con->query("INSERT INTO `app_info`(`name`, `des`, `publickey`, `privatekey`, `userid`)
			VALUES ('$app','$des','$publickey','$privatekey','$userid')");*/
			//var_dump(db::get()->get_redis());
			//var_dump(db::get()->get_redis()->get("test"));
			
			
			//var_dump(db::get()->get_mysql());
			
			/*$con->query("use glutlife;");
			$con->query("select * from app_info");
			db::get()->arr("select * from app",function($row){
				var_dump($row);
			});*/
		
		return;
	}
})($type);
function list_app($userid){//列出所有应用信息
	global $con;
	$userarray=[["id","应用id","标题","公钥","HTML代码长度","JS代码长度","体验版本号","发布版本号","私钥"]];
	$rs=$con->query("select * from app_info where userid=".$userid);
	$arr=[];
	$i=0;
	while($row=$rs->fetch_assoc()){
		$htmlcodelength=0;
		$jscodelength=0;
		if($row['htmlcode']!=0)
			$htmlcodelength=$con->query("select length(code) from app_code where id='$row[htmlcode]'")->fetch_array()[0];
		if($row['jscode']!=0)
			$jscodelength=$con->query("select length(code) from app_code where id='$row[jscode]'")->fetch_array()[0];
		
		$arr[]=[
			++$i,
			$row['id'],
			$row['name'],
			$row['publickey'],
			sprintf("%.2f",$htmlcodelength/1024)."kb",
			sprintf("%.2f",$jscodelength/1024)."kb",
			$row['compile_version'],
			$row['compile'],
			$row["privatekey"]
		];
	}
	
	$userarray=array_merge_recursive($userarray,$arr);
	return $userarray;
}
function app_info($appid,$userid){
	global $con;
	$t=$con->query("select * from app_info where id=$appid and userid=$userid")->fetch_assoc();
	if(!$t)p(0,"系统遭到攻击！请勿继续尝试！");
	return $t;
}
function check_dev(){
	global $con;
	$time=r("time");$userid=r("userid");$pwd=r("pwd");
	$result=$con->query("select * from app_userinfo,app_token where token='$pwd' and app_token.userid=app_userinfo.id and app_userinfo.uniquekey='$userid'")->fetch_assoc();
	if(!$result)j(array("res"=>"1","text"=>"登录失效了！"));
	return $result;
}
function r($key){//安全读取get和post
	global $con;
	//var_dump($_POST[$key]??$_GET[$key]??p(0,"no".$key));
	return trim($con->real_escape_string($_POST[$key]??$_GET[$key]??p(0,"no".$key)));
}
function p($res,$text,$data=null){
	die(json_encode(array("res"=>$res,"text"=>$text,"data"=>$data)));
}
function j($arr){
	die(json_encode($arr));
}
function get_hash(){//得到随机值
  $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()+-';
  $random = $chars[mt_rand(0,73)].$chars[mt_rand(0,73)].$chars[mt_rand(0,73)].$chars[mt_rand(0,73)].$chars[mt_rand(0,73)];
  $content = uniqid().$random;
  return sha1($content);
}
function len($s){
	return mb_strlen($s,"utf-8");
}
function exe($exe,$filename,$arr=null){
	ob_start('ob_gzhandler');
	include $_SERVER['DOCUMENT_ROOT']."/compile/".$exe;
	$content = ob_get_contents();
	switch(pathinfo($filename)["extension"]){
		case "html":
			$content=compress_html($content);
			break;
		case "js":
			$content = trim(JSMin::minify($content));
			break;
		case "css":
			$content=compress_html($content);
			break;
		default:
			$content=compress_html($content);
			break;
	}
	
	
	w($_SERVER['DOCUMENT_ROOT']."/../static/".$filename,$content);
	ob_end_clean();//清空关闭缓存，不直接输出到浏览器
	return $content;
}
function zipimg($img,$publickey){
	$srcImg = imagecreatefromstring(base64_decode($img));
	$srcWidth = imagesx($srcImg);
	$srcHeight = imagesy($srcImg);
	
	//创建新图
	///////////////////////////////////////64x64
	$newWidth = 64;//round($srcWidth / 2);
	$newHeight = 64;//round($srcHeight / 2);
	$newImg = imagecreatetruecolor($newWidth, $newHeight);
	//分配颜色 + alpha，将颜色填充到新图上
	$alpha = imagecolorallocatealpha($newImg, 0, 0, 0, 127);
	imagefill($newImg, 0, 0, $alpha);
	//将源图拷贝到新图上，并设置在保存 PNG 图像时保存完整的 alpha 通道信息
	imagecopyresampled($newImg, $srcImg, 0, 0, 0, 0, $newWidth, $newHeight, $srcWidth, $srcHeight);
	imagesavealpha($newImg, true);
	ob_start();
	imagepng($newImg);
	$fileContent_64 = ob_get_contents();
	ob_end_clean();
	
	$file = fopen('/mnt/hgfs/static/in/app/'.$publickey.'.64.png',"w");//打开文件准备写入
	fwrite($file,$fileContent_64);//写入64x64
	fclose($file);
	///////////////////////////////////////64x64
	///////////////////////////////////////108x108
	$newWidth = 108;
	$newHeight = 108;
	$newImg = imagecreatetruecolor($newWidth, $newHeight);
	//分配颜色 + alpha，将颜色填充到新图上
	$alpha = imagecolorallocatealpha($newImg, 0, 0, 0, 127);
	imagefill($newImg, 0, 0, $alpha);
	//将源图拷贝到新图上，并设置在保存 PNG 图像时保存完整的 alpha 通道信息
	imagecopyresampled($newImg, $srcImg, 0, 0, 0, 0, $newWidth, $newHeight, $srcWidth, $srcHeight);
	imagesavealpha($newImg, true);
	ob_start();
	imagepng($newImg);
	$fileContent_108 = ob_get_contents();
	ob_end_clean();
	$file = fopen('/mnt/hgfs/static/in/app/'.$publickey.'_108.png',"w");//打开文件准备写入
	fwrite($file,$fileContent_108);//写入108x108
	fclose($file);
	///////////////////////////////////////108x108
	return base64_encode($fileContent_108);
}
function remove_bom($code){
	if(strlen($code)>=3){
		$charset[1] = substr($code, 0, 1);
		$charset[2] = substr($code, 1, 1);
		$charset[3] = substr($code, 2, 1);
		if (ord($charset[1]) == 239 && ord($charset[2]) == 187 && ord($charset[3]) == 191) {
			$code = substr($code, 3);
		}
	}
	if(strlen($code)>=3){
		$charset[1] = substr($code, 0, 1);
		$charset[2] = substr($code, 1, 1);
		$charset[3] = substr($code, 2, 1);
		if (ord($charset[1]) == 239 && ord($charset[2]) == 187 && ord($charset[3]) == 191) {
			$code = substr($code, 3);
		}
	}
	return $code;
}
function w($url,$content){
	$myfile = fopen($url, "w") or die("Unable to open file!");
	fwrite($myfile, $content);
	fclose($myfile);
}
function compress_html($a){$b=preg_split('/(<!--<nocompress>-->.*?<!--<\\/nocompress>-->|<nocompress>.*?<\\/nocompress>|<pre.*?\\/pre>|<textarea.*?\\/textarea>|<script.*?\\/script>)/msi',$a,-1,PREG_SPLIT_DELIM_CAPTURE);$d='';foreach($b as $e){if(strtolower(substr($e,0,19))=='<!--<nocompress>-->'){$e=substr($e,19,strlen($e)-19-20);$d.=$e;continue;}elseif(strtolower(substr($e,0,12))=='<nocompress>'){$e=substr($e,12,strlen($e)-12-13);$d.=$e;continue;}elseif(strtolower(substr($e,0,4))=='<pre'||strtolower(substr($e,0,9))=='<textarea'){$d.=$e;continue;}elseif(strtolower(substr($e,0,7))=='<script'&&strpos($e,'//')!=false&&(strpos($e,"\r")!==false||strpos($e,"\n")!==false)){$f=preg_split('/(\\r|\\n)/ms',$e,-1,PREG_SPLIT_NO_EMPTY);$e='';foreach($f as $g){if(strpos($g,'//')!==false){if(substr(trim($g),0,2)=='//'){continue;}$h=preg_split('//',$g,-1,PREG_SPLIT_NO_EMPTY);$i=$j=false;foreach($h as $k=>$l){if($l=='"'&&!$j&&$k>0&&$h[$k-1]!='\\'){$i=!$i;}elseif($l=='\''&&!$i&&$k>0&&$h[$k-1]!='\\'){$j=!$j;}elseif($l=='/'&&$h[$k+1]=='/'&&!$i&&!$j){$g=substr($g,0,$k);break;}}}$e.=$g;}}$e=preg_replace('/[\\n\\r\\t]+/','',$e);$e=preg_replace('/\\s{2,}/',' ',$e);$e=preg_replace('/>\\s</','> <',$e);$e=preg_replace('/\\/\\*.*?\\*\\//i','',$e);$e=preg_replace('/<!--[^!]*-->/','',$e);$d.=$e;}return $d;}
function compress_js($a){$b=preg_split('/(.*?|<nocompress>.*?<\\/nocompress>|<pre.*?\\/pre>|<textarea.*?\\/textarea>|<script.*?\\/script>)/msi',$a,-1,PREG_SPLIT_DELIM_CAPTURE);$d='';foreach($b as $e){$f=preg_split('/(\\r|\\n)/ms',$e,-1,PREG_SPLIT_NO_EMPTY);$e='';foreach($f as $g){if(strpos($g,'//')!==false){if(substr(trim($g),0,2)=='//'){continue;}$h=preg_split('//',$g,-1,PREG_SPLIT_NO_EMPTY);$i=$j=false;foreach($h as $k=>$l){if($l=='"'&&!$j&&$k>0&&$h[$k-1]!='\\'){$i=!$i;}elseif($l=='\''&&!$i&&$k>0&&$h[$k-1]!='\\'){$j=!$j;}elseif($l=='/'&&$h[$k+1]=='/'&&!$i&&!$j){$g=substr($g,0,$k);break;}}}$e.=$g;}$e=preg_replace('/[\\n\\r\\t]+/',' ',$e);$e=preg_replace('/\\s{2,}/',' ',$e);$e=preg_replace('/>\\s</','> <',$e);$e=preg_replace('/\\/\\*.*?\\*\\//i','',$e);$e=preg_replace('//','',$e);$d.=$e;}return $d;}
