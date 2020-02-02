package api;

import org.springframework.core.io.support.PropertiesLoaderUtils;

import java.io.IOException;
import java.util.Properties;

/**
 * WebAppOS全局配置文件
 * 作者：CH
 * 时间：2020年1月4日*/
public class WebAppOSConfig {
    /**
     * 前端配置信息需要在/web/static/os/main.js中配置
     * 修改完重新不熟生效
     *
     * */

    static String static_path;//静态文件夹目录
    static String static_index_path;//首页路径，这个路径下面要有index.html、main.js、none.html
    static String static_cache_path;//静态缓存目录，这里的路径是相对static_path目录开始的
    static String http_cache_path;//外网访问时的路径

    static String DatabaseDriver;
    static String Database_URL;
    static String Database_UserName;//数据库账号
    static String Database_PassWord;//数据库密码
    static int DatabaseConnection_initSize;//数据库连接池初始化大小
    static int DatabaseConnection_maxTotal;//数据库连接池并发最大连接数，超过就会堵塞

//    public static boolean isUseLoginApi=false;//是否启用自定义登录，默认false
//    public boolean LoginApi(String username,String password){//isUseLoginApi为true时生效
//        return true;
//    }
    static void reload(){
        Properties pro;
        try {
            pro = PropertiesLoaderUtils.loadAllProperties("WebAppOSConfig.properties");
            static_path=pro.getProperty("static_path");
            static_index_path=pro.getProperty("static_index_path");
            static_cache_path=pro.getProperty("static_cache_path");
            http_cache_path=pro.getProperty("http_cache_path");
            DatabaseDriver=pro.getProperty("DatabaseDriver");
            Database_URL=pro.getProperty("Database_URL");
            Database_UserName=pro.getProperty("Database_UserName");
            Database_PassWord=pro.getProperty("Database_PassWord");
            DatabaseConnection_initSize= Integer.parseInt(pro.getProperty("DatabaseConnection_initSize"));
            DatabaseConnection_maxTotal= Integer.parseInt(pro.getProperty("DatabaseConnection_maxTotal"));
        } catch (IOException e) {
            System.out.println("WebAppOSConfig.properties配置文件读取失败!");
            e.printStackTrace();
        }

    }
}
