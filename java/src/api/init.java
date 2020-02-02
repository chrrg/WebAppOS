package api;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class init implements ServletContextListener {
    /*
    * WebAppOS初始化
    * 作者：CH*/
    public void contextInitialized(ServletContextEvent arg0){
        try {
            WebAppOSConfig.reload();//刷新配置信息
            //获取目标
            String path=this.getClass().getResource(WebAppOSConfig.static_path).getPath();
            String index=getFileContent(path+WebAppOSConfig.static_index_path+"index.html");
            String main=getFileContent(path+WebAppOSConfig.static_index_path+"main.js");
            main=Compressor.JavaScriptCompressor(main);
            index=index.replaceAll("(s&&)(\\d*?)(==)","$1"+String.valueOf(main.length()+"$3"));
            index=Compressor.HtmlCompressor(index);
            w(path+WebAppOSConfig.static_index_path,"index.html",index.getBytes());
            w(path+WebAppOSConfig.static_index_path,"main.js",main.getBytes());
            System.out.println("WebAppOS系统初始化完成！欢迎使用！");
//            try {
//                File file = new File("D:\\1.txt");
//                file.createNewFile();
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//            System.out.println(this.getClass().getResource("/").getPath());
//            System.out.println(this.getClass().getResource("/"));
//            System.out.println(this.getClass().getResource("").getPath());
//            System.out.println(this.getClass().getResource("../../../static/").getPath());
        } catch (Exception e) {
            System.out.println("系统初始化失败，请排查问题：");
            e.printStackTrace();
        }
    }
    public static String getFileContent(String path) throws IOException {
        File file = new File(path);
        int filelength= (int) file.length();
        byte[] filecontent = new byte[filelength];
        FileInputStream in = new FileInputStream(file);
        in.read(filecontent);
        in.close();
        return new String(filecontent, StandardCharsets.UTF_8);
    }
    private static void w(String url,String filename,byte[] code) throws IOException {
        File file = new File(url);
        if (!file.exists() && !file.isDirectory())
            file.mkdirs();
        file = new File(url + "./" + filename);
        file.createNewFile();
        FileOutputStream out = new FileOutputStream(file);
        out.write(code);
        out.close();
    }
}
