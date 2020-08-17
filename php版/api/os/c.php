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
//功能，统计应用打开和判断更新
$app=r('app')??die;//应用公钥
$v=r('v')??die;//当前版本
$device=r('device')??die;//当前版本
$row=$con->query("select * from app_info where publickey='$app'")->fetch_assoc();
if(!$row)p(10,"no app!");
$output=$row["compile"];
if($row["compile"]!=$row["compile_version"]){//那么可能有体验版
	$result=$con->query("select * from app_tongji_login where userid='$row[userid]' and device='$device' limit 1")->fetch_assoc();
	if($result)$output=$row["compile_version"];//说明真的有体验版
}
$con->query("INSERT INTO `app_tongji_open`(`device`,`appid`) VALUES ('$device','$row[id]')");
ok(["version"=>$output]);
?>