<?php
class WebAppOSconfig{
	public $cache_path;
	public $cache_url;
	private $mysql;
	private static $_instance;//本类实例
		
	private function __construct(){
		$this->mysql=@new mysqli("127.0.0.1","root","root","webappos");
		if($this->mysql->connect_error)die($this->mysql->connect_error);
		$this->cache_path = $_SERVER['DOCUMENT_ROOT']."/webappos/static/os/cache/";//缓存文件夹物理路径
		$this->cache_url = "/webappos/static/os/cache/";//缓存文件夹相对网站根目录路径
	}
	public static function init(){
		if (FALSE == (self::$_instance instanceof self))self::$_instance = new self();
		return self::$_instance;
	}
	public function get_mysql(){
		return $this->mysql;//数据库账号密码，数据库名
	}
	
}
?>