package api;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Controller
@RequestMapping("/api")
public class api {
//    @RequestMapping("/test")
//    public void test(HttpServletRequest request, HttpServletResponse response){
//        System.out.println(ClassLoader.class.getResource(WebAppOSConfig.static_path));
//        System.out.println(ClassLoader.class.getResource("/"));
//        System.out.println(this.getClass().getResource(WebAppOSConfig.static_path).getPath());///D:/IdeaProjects/webappos/webAppOS/out/artifacts/web_war_exploded/static/
//        File file = new File(this.getClass().getResource("../../../static/index.html").getPath());
//        System.out.println(file);
//        System.out.println(this.getClass().getResource("../../../static/index2.html"));
////        file = new File(this.getClass().getResource("../../../static/index2.html").getPath());
////        System.out.println(file);
//
//    }
    @RequestMapping("/v")
    public void v(HttpServletRequest request, HttpServletResponse response) throws SQLException {
        String prog= request.getParameter("prog");
        String device= request.getParameter("device");
        Connection conn = DBUtils.getConnection();
        String sql="select * from app_compile,app_info where app_info.publickey=? and app_info.compile=app_compile.id LIMIT 1";
        PreparedStatement preState = conn.prepareStatement(sql);
        preState.setString(1, prog);
        ResultSet rs = preState.executeQuery();
        if(!rs.next() || rs.getString("compile")==null){
            JSONObject result = new JSONObject();
            result.put("ver",null);
            p(response,result);
            return;
        }
        int output=rs.getInt("compile");
        if(output!=rs.getInt("compile_version")){
            preState = conn.prepareStatement("select * from app_tongji_login where userid = ? and device = ? limit 1");
            preState.setInt(1, rs.getInt("userid"));
            preState.setString(2, device);
            ResultSet rs2 = preState.executeQuery();
            if(rs2.next()){//说明有体验版
                output=rs.getInt("compile_version");
            }
        }
        preState = conn.prepareStatement("INSERT INTO `app_tongji_install`(`device`,`appid`) VALUES (? , ?)");
        preState.setString(1, device);
        preState.setInt(2, rs.getInt("id"));
        preState.executeUpdate();
        JSONObject appdata=null;
        if(rs.getInt("use_json")>0){
            preState = conn.prepareStatement("select code from app_code where id=?");
            preState.setInt(1, rs.getInt("use_json"));
            ResultSet rs1=preState.executeQuery();
            rs1.next();
            String code_jsonstr = Compressor.JSONCompressor(rs1.getString(1));
            JSONObject json = JSONObject.parseObject(code_jsonstr);
            if(json!=null)
                if(json.containsKey("data"))
                    appdata=json.getJSONObject("data");
        }
        JSONObject result=new JSONObject();
        result.put("html",WebAppOSConfig.http_cache_path+rs.getString("destinationhtml"));
        result.put("js",WebAppOSConfig.http_cache_path+rs.getString("destinationjs"));
        result.put("version",output);
        result.put("htmll",new File(this.getClass().getResource(WebAppOSConfig.static_path).getPath()+WebAppOSConfig.static_cache_path+rs.getString("destinationhtml")).length());
        result.put("jsl",new File(this.getClass().getResource(WebAppOSConfig.static_path).getPath()+WebAppOSConfig.static_cache_path+rs.getString("destinationjs")).length());
        JSONObject data=new JSONObject();
        data.put("title",rs.getString("name"));
        data.put("version",output);
        data.put("imgversion",rs.getInt("imgfile"));
        data.put("data",appdata);
        result.put("data",data);
        result.put("key",tool.sha1(prog+"_CH_"+device+"_inGlut_"+rs.getString("privatekey")));
        JSONObject out=new JSONObject();
        out.put("ver",result);
        p(response,out);
        conn.close();
        //response.getWriter().println(prog);
    }
    @RequestMapping("/c")
    public void c(HttpServletRequest request, HttpServletResponse response) throws SQLException {
        String app=request.getParameter("app");
        String v=request.getParameter("v");
        String device=request.getParameter("device");
        Connection conn = DBUtils.getConnection();
        PreparedStatement preState = conn.prepareStatement("select * from app_info where publickey=?");
        preState.setString(1, app);
        ResultSet rs = preState.executeQuery();
        if(!rs.next()){
            JSONObject result = new JSONObject();
            result.put("res",10);
            result.put("text","no app!");
            result.put("data",null);
            p(response,result);
            return;
        }
        int output=rs.getInt("compile");
        if(output!=rs.getInt("compile_version")){//那么可能有体验版
            preState = conn.prepareStatement("select * from app_tongji_login where userid = ? and device = ? limit 1");
            preState.setString(1, rs.getString("userid"));
            preState.setString(2, device);
            ResultSet rs2 = preState.executeQuery();
            if(rs2.next()){//说明有体验版
                output=rs.getInt("compile_version");
            }
        }
        preState = conn.prepareStatement("INSERT INTO `app_tongji_open`(`device`,`appid`) VALUES (? , ?)");
        preState.setString(1, device);
        preState.setInt(2, rs.getInt("id"));
        preState.executeUpdate();
        JSONObject result=new JSONObject();
        JSONObject ver=new JSONObject();
        ver.put("version",output);
        result.put("res",100);
        result.put("text","");
        result.put("data",ver);
        p(response,result);
        conn.close();
    }
    @RequestMapping("/a")
    public void a(HttpServletRequest request, HttpServletResponse response) throws SQLException {
        String type=request.getParameter("type");
        String device=request.getParameter("device");
        Connection conn = DBUtils.getConnection();
        if("yblogin".equals(type)){

        }else if("verify".equals(type)){

        }
        conn.close();
    }
    private void p(HttpServletResponse response,JSONObject json){
        try {
            response.getWriter().println(JSON.toJSONString(json, SerializerFeature.WriteMapNullValue,SerializerFeature.BrowserCompatible));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
/*
import java.sql.Connection;
import java.sql.Statement;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

public class api implements Controller{

    @Override
    public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
        // TOD O Auto-generated method stub
        String a= request.getParameter("type");//类型
        Connection conn = DBUtils.getConnection();
        Statement st = conn.createStatement();


        response.getWriter().println(a);
        return null;
    }

}
*/
