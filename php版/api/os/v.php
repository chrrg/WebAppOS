<?php
$prog=trim($_POST['prog'])??die;
$device=trim($_POST['device'])??die;
include_once "config.class.php";
$config=WebAppOSconfig::init();
$con=$config->get_mysql();
$prog=$con->real_escape_string($prog);
$device=$con->real_escape_string($device);
$row=$con->query("select * from app_compile,app_info where app_info.publickey='$prog' and app_info.compile=app_compile.id LIMIT 1")->fetch_assoc();//先拿发布版
if(!$row)die(json_encode(array("ver"=>null)));
$output=$row["compile"];
if($row["compile"]!=$row["compile_version"]){//那么可能有体验版
	$result=$con->query("select * from app_tongji_login where userid='$row[userid]' and device='$device' limit 1")->fetch_assoc();
	if($result){//说明真的有体验版
		$row=$con->query("select * from app_compile,app_info where app_info.publickey='$prog' and app_info.compile_version=app_compile.id LIMIT 1")->fetch_assoc();
		$output=$row["compile_version"];
	}
}
//拿到应用了
$con->query("INSERT INTO `app_tongji_install`(`device`,`appid`) VALUES ('$device','$row[id]')");
$icon=null;
if($row['imgfile']!=''){$icon=$con->query("select data from app_img where id='$row[imgfile]'")->fetch_array()[0];}//有图标
$jsonid=$row["use_json"];//json编译选项提供的信息
$data=null;
if($jsonid){
	$da=json_decode($con->query("select code from app_code where id='$jsonid'")->fetch_array()[0]);
	if($da)$data=$da->data??null;
}
//var_dump(WebAppOSconfig::init()->cache_path);die;
if(!file_exists($config->cache_path.$row["destinationhtml"])){
	//重建缓存
	if(!is_dir($config->cache_path)){
		mkdir($config->cache_path);
		if(!is_dir($config->cache_path))die("WebAppOS Error: ".$config->cache_path."文件夹不存在，或权限不足！");
	}
	$compiled=$con->query("select * from app_compiled where targetid='$output'")->fetch_assoc();
	if(!$compiled)die("应用缓存数据丢失，请重建应用缓存！".$config->cache_path.$row["destinationhtml"]);
	w($config->cache_path.$row["destinationhtml"],$compiled["codehtml"]);
	w($config->cache_path.$row["destinationjs"],$compiled["codejs"]);
}
if(!file_exists($config->cache_path.$row["destinationhtml"])){
	//重建图标缓存
	w("/mnt/hgfs/static/in/icon/".$app['publickey'].".png",base64_decode($upload));
}
if($row['imgfile']&&!file_exists($config->cache_path.$prog.".png")){
	$img=$con->query("select * from app_img where id='$row[imgfile]'")->fetch_assoc();
	if(!$img)die("图标缓存数据丢失，请重建图标缓存！".$config->cache_path.$prog.".png");
	w($config->cache_path.$prog.".png",base64_decode($img["data"]));
}
$ver=[
	"html"=>$config->cache_url.$row["destinationhtml"],//html文件
	"js"=>$config->cache_url.$row["destinationjs"],//js文件
	"version"=>$output,//版本
	"htmll"=>len(file_get_contents($config->cache_path.$row["destinationhtml"])),//html长度
	"jsl"=>len(file_get_contents($config->cache_path.$row["destinationjs"])),//js长度
	"data"=>["title"=>$row['name'],"version"=>$output,"imgversion"=>$row['imgfile'],"data"=>$data],//会被应用拿到的数据放上面的data，比如这里可以带上编译时提供的数据
	"key"=>sha1($prog."_CH_".$device."_webappos_".$row["privatekey"]),
	//key提供给应用的钥匙（加密方式不能相同，若加密方式泄露会导致不安全，所以这里应该修改盐值）
];
//上线版本
//调试版本
die(json_encode(array("ver"=>$ver)));
function len($s){return mb_strlen($s,"utf-8");}
function w($url,$content){
	$myfile = fopen($url, "w") or die("Unable to open file!");
	fwrite($myfile, $content);
	fclose($myfile);
}