<?php
set_error_handler('phperror');//报错就自定义输出！！！这个很实用。
function phperror($type, $message, $file, $line){p(0,'error: '.$type.':'.$message.' in '.$file . ' on ' . $line . ' line .');}
include_once "config.class.php";
$con=WebAppOSconfig::init()->get_mysql();
function r($key){//安全读取post
	global $con;
	return trim($con->real_escape_string($_POST[$key]??p(0,"no".$key)));
}
function p($res,$text,$data=null){die(json_encode(array("res"=>$res,"text"=>$text,"data"=>$data)));}//输出json
function j($arr){die(json_encode($arr));}//输出json后的字符串
function ok($data){p(100,"ok",$data);}
function get_hash(){//得到随机值
  $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()+-';
  $random = $chars[mt_rand(0,73)].$chars[mt_rand(0,73)].$chars[mt_rand(0,73)].$chars[mt_rand(0,73)].$chars[mt_rand(0,73)];
  $content = uniqid().$random;
  return sha1($content);
}
function len($s){return mb_strlen($s,"utf-8");}//获取长度的函数

/*********************************************************************************/
$type=r("type");

$ua=$con->real_escape_string($_SERVER['HTTP_USER_AGENT']??"");
$ip=$con->real_escape_string($_SERVER["REMOTE_ADDR"]??$_SERVER['HTTP_X_REAL_IP']??"");

$device=r("device");
if(!$device)p(0,"device Illegal!");
if($type=="verify"){//验证登录是否失效，这里需要实现自己的登录逻辑
	$verify=r("verify");
	$user=r("user");
	$key=r("key");
	include_once "../module/auth.class.php";
	$auth=new auth();
	$userid=$auth->verify_accesstoken($key);
	if(!$userid){
		$userid=$auth->verify_accesstoken_iscan_autoLogin($key);
		if($userid){//可以续登录
			
		}
		p(98,"登录验证失败！");
	}
	if($auth->userid_to_user($userid)!=$user)p(98,"账号验证失败了！");//用户名不对
	$con->query("INSERT INTO `app_tongji_login`(`device`,`userid`,`userAgent`,`userIP`) VALUES ('$device','$userid','$ua','$ip')");
	ok(["type"=>$verify]);
}else if($type=="login"){//登录，这里是实现自己的登录逻辑
	$key=r("key");
	include_once "../module/auth.class.php";
	$auth=new auth();
	$userid=$auth->verify_accesstoken($key);
	if(!$userid)p(99,"登录验证失败！");
	$user=$auth->userid_to_user($userid);
	$con->query("INSERT INTO `app_tongji_login`(`device`,`userid`,`userAgent`,`userIP`) VALUES ('$device','$userid','$ua','$ip')");
	ok(["type"=>"login","user"=>$user,"key"=>$key,"tokenexpires"=>$auth->get_accesstoken_tokenexpires($key),
		"info"=>$auth->output_userinfo($userid)
	]);
}
?>