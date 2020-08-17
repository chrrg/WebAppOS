<?php
//error_reporting(E_ALL);

// ============================================================================================================================================
$pos=$_SERVER['DOCUMENT_ROOT']."/webappos/static/os/";//编译输出路径 (index.html所在目录 启动入口)
// ============================================================================================================================================

if(!is_dir($pos))die("<h2>Error: ".$pos."文件夹不存在，请检查！</h2>");
$start = microtime(true);
define('DD_MEMORY_LIMIT_ON',function_exists('memory_get_usage'));// 记录内存初始使用
if(DD_MEMORY_LIMIT_ON) $GLOBALS['_startUseMems'] = memory_get_usage();
echo "<pre>";
// ============================================================================================================================================

if(file_exists($pos."main.js")){
	$myfile=fopen($pos."main.js", "r") or die("Unable to open file!");
	$old_content=fread($myfile,filesize($pos."main.js"));
	fclose($myfile);
}else $old_content="";

require_once 'jsmin.class.php';

$len=tryexe("main.js.php","main.js",array("lenmain"=>0));//尝试，但没有文件写入
$nochange=false;
if($old_content==$len||$old_content==$len.";"){//没有发生变化
	//没变化就不用写入了！
	$nochange=true;
	print("<h2 style='color:green;'>main.js没有发生变化！</h2>");
}else
	if(len($old_content)==len($len) && len($len)!=0 && substr($len,-1)!=";"){
		print("加分号！！！");
		$len=exe("main.js.php","main.js",array("lenmain"=>0),";");
	}else
		$len=exe("main.js.php","main.js",array("lenmain"=>0));

$newlen=len($len);
if(!$nochange)exe("index.html.php","index.html",array("length"=>$newlen),"<!--CH WebAppOS 网页版小程序框架 2.0 2019-12-01始-->");//框架启动文件


print("<h1>编译完成！时间：".date("Y-m-d H:i:s",time())."</h1>");
print("<h2>旧长度：".len($old_content)."<br />新长度：".$newlen."</h2>");
if($old_content==$len)
	print("<h1 style='color:green;'>编译后的main.js未发生任何更改，无需更新</h1>");
else print("<h1 style='color:green;'>编译已完成！！！</h1>");
w($pos."none.html","");

print("<h2>输出路径：".dirname($pos."/index.html")."</h2>");

// ============================================================================================================================================
$end = microtime(true);
$use_time = (number_format($end-$start, 8))*1000;
echo "\n<h2>耗时：<span style='color:red;'>".$use_time."ms</span></h2>";
echo "\n内存：";
echo DD_MEMORY_LIMIT_ON ? number_format((memory_get_usage() - $GLOBALS['_startUseMems'])/1024,2).' KB':'不支持';
echo "\n内存峰值：";
echo DD_MEMORY_LIMIT_ON ? number_format(memory_get_peak_usage()/1024,2).' KB':'不支持';
// ============================================================================================================================================



function len($s){
	return mb_strlen($s,"utf-8");
}
function exe($exe,$filename,$arr=null,$append=""){
	global $pos;
	ob_start('ob_gzhandler');
	include "./".$exe;
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
	$content.=$append;	
	w($pos.$filename,$content);
	ob_end_clean();//清空关闭缓存，不直接输出到浏览器
	return $content;
}
function tryexe($exe,$filename,$arr=null){
	global $pos;
	ob_start('ob_gzhandler');
	include "./".$exe;
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
	ob_end_clean();//清空关闭缓存，不直接输出到浏览器
	return $content;
}
function w($url,$content){
	$myfile = fopen($url, "w") or die("Unable to open file!");
	fwrite($myfile, $content);
	fclose($myfile);
}
function compress_html($a){$b=preg_split('/(<!--<nocompress>-->.*?<!--<\\/nocompress>-->|<nocompress>.*?<\\/nocompress>|<pre.*?\\/pre>|<textarea.*?\\/textarea>|<script.*?\\/script>)/msi',$a,-1,PREG_SPLIT_DELIM_CAPTURE);$d='';foreach($b as $e){if(strtolower(substr($e,0,19))=='<!--<nocompress>-->'){$e=substr($e,19,strlen($e)-19-20);$d.=$e;continue;}elseif(strtolower(substr($e,0,12))=='<nocompress>'){$e=substr($e,12,strlen($e)-12-13);$d.=$e;continue;}elseif(strtolower(substr($e,0,4))=='<pre'||strtolower(substr($e,0,9))=='<textarea'){$d.=$e;continue;}elseif(strtolower(substr($e,0,7))=='<script'&&strpos($e,'//')!=false&&(strpos($e,"\r")!==false||strpos($e,"\n")!==false)){$f=preg_split('/(\\r|\\n)/ms',$e,-1,PREG_SPLIT_NO_EMPTY);$e='';foreach($f as $g){if(strpos($g,'//')!==false){if(substr(trim($g),0,2)=='//'){continue;}$h=preg_split('//',$g,-1,PREG_SPLIT_NO_EMPTY);$i=$j=false;foreach($h as $k=>$l){if($l=='"'&&!$j&&$k>0&&$h[$k-1]!='\\'){$i=!$i;}elseif($l=='\''&&!$i&&$k>0&&$h[$k-1]!='\\'){$j=!$j;}elseif($l=='/'&&$h[$k+1]=='/'&&!$i&&!$j){$g=substr($g,0,$k);break;}}}$e.=$g;}}$e=preg_replace('/[\\n\\r\\t]+/','',$e);$e=preg_replace('/\\s{2,}/',' ',$e);$e=preg_replace('/>\\s</','> <',$e);$e=preg_replace('/\\/\\*.*?\\*\\//i','',$e);$e=preg_replace('/<!--[^!]*-->/','',$e);$d.=$e;}return $d;}
function compress_js($a){$b=preg_split('/(.*?|<nocompress>.*?<\\/nocompress>|<pre.*?\\/pre>|<textarea.*?\\/textarea>|<script.*?\\/script>)/msi',$a,-1,PREG_SPLIT_DELIM_CAPTURE);$d='';foreach($b as $e){$f=preg_split('/(\\r|\\n)/ms',$e,-1,PREG_SPLIT_NO_EMPTY);$e='';foreach($f as $g){if(strpos($g,'//')!==false){if(substr(trim($g),0,2)=='//'){continue;}$h=preg_split('//',$g,-1,PREG_SPLIT_NO_EMPTY);$i=$j=false;foreach($h as $k=>$l){if($l=='"'&&!$j&&$k>0&&$h[$k-1]!='\\'){$i=!$i;}elseif($l=='\''&&!$i&&$k>0&&$h[$k-1]!='\\'){$j=!$j;}elseif($l=='/'&&$h[$k+1]=='/'&&!$i&&!$j){$g=substr($g,0,$k);break;}}}$e.=$g;}$e=preg_replace('/[\\n\\r\\t]+/',' ',$e);$e=preg_replace('/\\s{2,}/',' ',$e);$e=preg_replace('/>\\s</','> <',$e);$e=preg_replace('/\\/\\*.*?\\*\\//i','',$e);$e=preg_replace('//','',$e);$d.=$e;}return $d;}
?>