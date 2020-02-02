package api;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.util.Base64;

@Controller
@RequestMapping("/manage")
public class manage {
    @RequestMapping("/test")
    public void test(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //select CONCAT('truncate TABLE ',table_schema,'.',TABLE_NAME, ';') from INFORMATION_SCHEMA.TABLES where  table_schema in ('webappos');
        /*
truncate TABLE webappos.app_check;
truncate TABLE webappos.app_code;
truncate TABLE webappos.app_compile;
truncate TABLE webappos.app_compiled;
truncate TABLE webappos.app_error_log;
truncate TABLE webappos.app_file;
truncate TABLE webappos.app_img;
truncate TABLE webappos.app_info;
truncate TABLE webappos.app_token;
truncate TABLE webappos.app_tongji_install;
truncate TABLE webappos.app_tongji_login;
truncate TABLE webappos.app_tongji_open;
truncate TABLE webappos.app_userinfo;
truncate TABLE webappos.app_username;
        * */
//        w(this.getClass().getResource("../../../static/").getPath()+"./os/cache/",tool.get_hash()+".html","成功，1234564564\n56456456okok   asas和");
    }
    @RequestMapping(value="/api",params = {"type=login"})
    public void login(HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException {
        Connection conn = DBUtils.getConnection();
        ResultSet rs = conn.prepareStatement("select * from app_userinfo LIMIT 1").executeQuery();
        if(!rs.next()){//如果没有任何一个账号，那么初始化表有一个账号
            PreparedStatement preState = conn.prepareStatement("INSERT INTO `app_userinfo`(`uniquekey`,`identifykey`) VALUES (? , ?)");
            preState.setString(1,tool.get_hash());
            preState.setString(2,tool.get_hash());
            preState.executeUpdate();
            int insert_id=tool.last_insert_id(conn);
            preState = conn.prepareStatement("INSERT INTO `app_username`(`userid`,`username`,`password`) VALUES (? , ? , ?)");
            preState.setInt(1,insert_id);
            preState.setString(2,"admin");//初始化账号
            preState.setString(3,pwdEncrypt("admin"));//初始化密码
            preState.executeUpdate();
//            rs = conn.prepareStatement("select * from app_userinfo LIMIT 1").executeQuery();//修改了要刷新
//            rs.next();
        }
        String zh= request.getParameter("zh");
        String mm= request.getParameter("mm");
        if(invalid(zh,mm)){response.getWriter().println(p(0,"no"));return;}//如果输入非法
        PreparedStatement preState = conn.prepareStatement("SELECT * FROM `app_username`,`app_userinfo` where `username`=? and `password`=? and app_username.userid=app_userinfo.id");
        preState.setString(1,zh);
        preState.setString(2,pwdEncrypt(mm));
        ResultSet rs0=preState.executeQuery();
        if(!rs0.next()){//没有这个账号密码
            response.getWriter().println(p(1,"账号或密码错误！"));
            return;
        }
        String hash=tool.get_hash();//生成token
        //开始插入token
        Timestamp time=new Timestamp(System.currentTimeMillis());
        Timestamp endtime=new Timestamp(System.currentTimeMillis()+86400000);
        preState = conn.prepareStatement("INSERT INTO app_token(`userid`,`token`,`startTime`,`endTime`)VALUES(?,?,?,?)");
        preState.setInt(1,rs0.getInt("userid"));
        preState.setString(2,hash);
        preState.setTimestamp(3,time);
        preState.setTimestamp(4,endtime);
        preState.executeUpdate();
        //登录成功
        JSONObject result=new JSONObject();
        result.put("res",100);
        result.put("logintime",(int)(System.currentTimeMillis()/1000));
        result.put("userid",rs0.getString("uniquekey"));
        result.put("hash",hash);
        response.getWriter().println(result);
        //这里之后的都需要进行登录验证
        conn.close();
    }
    @RequestMapping(value="/api",params = {"type=listapp"})
    public void listapp(HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException {
        ResultSet check_dev=check_dev(request,response);
        if(check_dev==null)return;//不安全
        int userid=check_dev.getInt("userid");
        response.getWriter().println(ok(list_app(userid)));
    }
    @RequestMapping(value="/api",params = {"type=addapp"})
    public void addapp(HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException {
        ResultSet check_dev=check_dev(request,response);
        if(check_dev==null)return;//不安全
        int userid=check_dev.getInt("userid");

        String appname= request.getParameter("appname");
        String appdes= request.getParameter("appdes");
        if(invalid(appname,appdes)){response.getWriter().println(p(0,"no"));return;}//如果输入非法

        String publickey=tool.get_hash();
        String privatekey=tool.get_hash();
        Connection conn = DBUtils.getConnection();
        PreparedStatement pre = conn.prepareStatement("select * from app_info where name=?");
        pre.setString(1,appname);
        ResultSet rs = pre.executeQuery();
        if(rs.next()){
            response.getWriter().println(p(80,"此应用名称已被占用！"));
            return;
        }
        pre = conn.prepareStatement("INSERT INTO `app_info`(`name`, `des`,`publickey`, `privatekey`,`userid`)" +
                "VALUES (?,?,?,?,?)");
        pre.setString(1,appname);
        pre.setString(2,appdes);
        pre.setString(3,publickey);
        pre.setString(4,privatekey);
        pre.setInt(5,userid);
        pre.executeUpdate();
        int insert_id=tool.last_insert_id(conn);
        String defaultcode_html="<view></view>";
        String defaultcode_js="app({\nonLoad:function(){\n\tconsole.log(666);\n}\n})";
        String defaultcode_json="{\"minify\":true}";

        pre = conn.prepareStatement("INSERT INTO `app_code`(`version`, `code`,`appid`, `type`)VALUES (0,?,?,1)");
        pre.setString(1,defaultcode_html);
        pre.setInt(2,insert_id);
        pre.executeUpdate();
        int insert_id1=tool.last_insert_id(conn);//修改HTML

        pre = conn.prepareStatement("INSERT INTO `app_code`(`version`, `code`,`appid`, `type`)VALUES (0,?,?,2)");
        pre.setString(1,defaultcode_js);
        pre.setInt(2,insert_id);
        pre.executeUpdate();
        int insert_id2=tool.last_insert_id(conn);//修改JS

        pre = conn.prepareStatement("INSERT INTO `app_code`(`version`, `code`,`appid`, `type`)VALUES (0,?,?,3)");
        pre.setString(1,defaultcode_json);
        pre.setInt(2,insert_id);
        pre.executeUpdate();
        int insert_id3=tool.last_insert_id(conn);//修改JSON

        pre = conn.prepareStatement("update app_info set `htmlversion`='0',`htmlcode`=?,`jsversion`='0',`jscode`=?,`jsonversion`='0',`jsoncode`=? where id=? and userid=?");
        pre.setInt(1,insert_id1);
        pre.setInt(2,insert_id2);
        pre.setInt(3,insert_id3);
        pre.setInt(4,insert_id);
        pre.setInt(5,userid);
        pre.executeUpdate();//关联修改的代码

        response.getWriter().println(ok(list_app(userid)));//成功输出
        conn.close();
    }
    @RequestMapping(value="/api",params = {"type=editapp"})
    public void editapp(HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException {
        ResultSet check_dev=check_dev(request,response);
        if(check_dev==null)return;//不安全
        int userid=check_dev.getInt("userid");
        String appid= request.getParameter("prog");
        if(invalid(appid)){response.getWriter().println(p(0,"no"));return;}//如果输入非法
        ResultSet app=app_info(Integer.parseInt(appid),userid);
        if(app==null){response.getWriter().println(p(0,"no"));return;}
        int code_html=app.getInt("htmlcode");
        int code_js=app.getInt("jscode");
        int code_json=app.getInt("jsoncode");
        int code_img=app.getInt("imgfile");
        Connection conn = DBUtils.getConnection();
        String code_htmlstr="";
        String code_jsstr="";
        String code_jsonstr="";
        String code_imgstr="";

        if(code_html>0){//获取HTML
            PreparedStatement pre = conn.prepareStatement("select code from app_code where id=? and appid=?");
            pre.setInt(1,code_html);
            pre.setInt(2, Integer.parseInt(appid));
            ResultSet rs=pre.executeQuery();
            rs.next();
            code_htmlstr=rs.getString(1);
        }
        if(code_js>0){//获取js
            PreparedStatement pre = conn.prepareStatement("select code from app_code where id=? and appid=?");
            pre.setInt(1,code_js);
            pre.setInt(2, Integer.parseInt(appid));
            ResultSet rs=pre.executeQuery();
            rs.next();
            code_jsstr=rs.getString(1);
        }
        if(code_json>0){//获取json
            PreparedStatement pre = conn.prepareStatement("select code from app_code where id=? and appid=?");
            pre.setInt(1,code_json);
            pre.setInt(2, Integer.parseInt(appid));
            ResultSet rs=pre.executeQuery();
            rs.next();
            code_jsonstr=rs.getString(1);
        }
        if(code_img>0){//获取图标
            PreparedStatement pre = conn.prepareStatement("select data from app_img where id=? and appid=?");
            pre.setInt(1,code_img);
            pre.setInt(2, Integer.parseInt(appid));
            ResultSet rs=pre.executeQuery();
            rs.next();
            code_imgstr=rs.getString(1);
        }
        String version1="1.0";
        String version2="1.0";
        if(app.getInt("compile")>0) {
            PreparedStatement pre = conn.prepareStatement("select version from app_compile where id=?");
            pre.setInt(1,app.getInt("compile"));
            ResultSet rs=pre.executeQuery();
            rs.next();
            version1=rs.getString(1);
        }
        if(app.getInt("compile_version")>0) {
            PreparedStatement pre = conn.prepareStatement("select version from app_compile where id=?");
            pre.setInt(1,app.getInt("compile_version"));
            ResultSet rs=pre.executeQuery();
            rs.next();
            version2=rs.getString(1);
        }

        JSONObject result=new JSONObject();
        result.put("name",app.getString("name"));
        result.put("des",app.getString("des"));
        result.put("version1",version1);
        result.put("version2",version2);
        result.put("version_html",app.getString("htmlversion"));
        result.put("version_js",app.getString("jsversion"));
        result.put("version_json",app.getString("jsonversion"));
        result.put("code_html",code_htmlstr);
        result.put("code_js",code_jsstr);
        result.put("code_json",code_jsonstr);
        result.put("code_img",code_imgstr);
        result.put("privatekey",tool.md5("glutyibancaohong_"+app.getString("publickey")+"_v2"));
        result.put("filelist",filelist(Integer.parseInt(appid)));
        response.getWriter().println(ok(result));//成功输出
        conn.close();
    }
    @RequestMapping(value="/api",params = {"type=extrafile_get"})
    public void extrafile_get(HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException {
        ResultSet check_dev=check_dev(request,response);
        if(check_dev==null)return;//不安全
        int userid=check_dev.getInt("userid");
        String prog= request.getParameter("prog");//id
        String fileid= request.getParameter("fileid");
        if(invalid(prog,fileid)){response.getWriter().println(p(0,"no"));return;}//如果输入非法
        ResultSet app=app_info(Integer.parseInt(prog),userid);
        if(app==null){response.getWriter().println(p(0,"no"));return;}
        Connection conn = DBUtils.getConnection();

        PreparedStatement pre = conn.prepareStatement("select * from app_file where appid = ? and id=?");
        pre.setInt(1,app.getInt("id"));
        pre.setInt(2, Integer.parseInt(fileid));

        ResultSet rs=pre.executeQuery();
        if(!rs.next()){//没有这个文件
            response.getWriter().println(p(0,"没有这个文件！！"));
            return;
        }
        if(rs.getInt("codeid")<=0){
            JSONObject result=new JSONObject();
            result.put("content","");
            response.getWriter().println(ok(result));
            return;
        }

        int codeid=rs.getInt("codeid");
        int version=rs.getInt("verison");

        pre = conn.prepareStatement("select * from app_code where appid = ? and id = ?");
        pre.setInt(1,app.getInt("id"));
        pre.setInt(2,codeid);
        ResultSet rs0=pre.executeQuery();
        if(!rs0.next()){response.getWriter().println(p(0,"代码无效！"));return;}
        JSONObject result=new JSONObject();
        result.put("content",rs0.getString("code"));
        result.put("version",version);


        response.getWriter().println(p(100,"文件获取成功，文件版本号："+version,result));
        conn.close();
    }
    @RequestMapping(value="/api",params = {"type=extrafile_new"})
    public void extrafile_new(HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException {
        ResultSet check_dev=check_dev(request,response);
        if(check_dev==null)return;//不安全
        int userid=check_dev.getInt("userid");
        String prog= request.getParameter("prog");//id
        String filename= request.getParameter("filename");
        if(invalid(prog,filename)){response.getWriter().println(p(0,"no"));return;}//如果输入非法
        ResultSet app=app_info(Integer.parseInt(prog),userid);//获取应用信息
        if(app==null){response.getWriter().println(p(0,"no"));return;}
        Connection conn = DBUtils.getConnection();
        if(!tool.isValidFileName(filename)){response.getWriter().println(p(0,"文件名不合法！"));return;}
        PreparedStatement pre = conn.prepareStatement("select * from app_file where appid=? and filename=?");
        pre.setInt(1,app.getInt("id"));
        pre.setString(2,filename);
        ResultSet rs0=pre.executeQuery();
        if(rs0.next()){response.getWriter().println(p(0,"你看看是不是文件名重复了？"));return;}
        pre = conn.prepareStatement("INSERT INTO `app_file`(`appid`, `filename`) VALUES (?,?)");
        pre.setInt(1,app.getInt("id"));
        pre.setString(2,filename);
        pre.executeUpdate();


        JSONObject result=new JSONObject();
        result.put("filelist",filelist(app.getInt("id")));
        response.getWriter().println(p(100,"创建文件成功！",result));
        conn.close();
    }


    @RequestMapping(value="/api",params = {"type=extrafile_delete"})
    public void extrafile_delete(HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException {
        ResultSet check_dev = check_dev(request, response);
        if (check_dev == null) return;//不安全
        int userid = check_dev.getInt("userid");
        String prog = request.getParameter("prog");//id
        String fileid = request.getParameter("fileid");
        if (invalid(prog, fileid)) {
            response.getWriter().println(p(0, "no"));
            return;
        }//如果输入非法
        ResultSet app = app_info(Integer.parseInt(prog), userid);//获取应用信息
        if (app == null) {
            response.getWriter().println(p(0, "no"));
            return;
        }
        Connection conn = DBUtils.getConnection();
        PreparedStatement pre = conn.prepareStatement("select * from app_file where id=? and appid=?");
        pre.setInt(1,app.getInt("id"));
        pre.setString(2,fileid);
        ResultSet rs0=pre.executeQuery();
        if(!rs0.next()){response.getWriter().println(p(0,"文件不存在或者不是你的删不了？"));return;}

        pre = conn.prepareStatement("update app_file set appid='0' where appid=? and id=?");
        pre.setInt(1,app.getInt("id"));
        pre.setInt(2, Integer.parseInt(fileid));
        pre.executeUpdate();

        JSONObject result=new JSONObject();
        result.put("filelist",filelist(app.getInt("id")));
        response.getWriter().println(p(100,"文件已删除！",result));
        conn.close();
    }
    @RequestMapping(value="/api",params = {"type=saveapp"})
    public void saveapp(HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException {
        ResultSet check_dev = check_dev(request, response);
        if (check_dev == null) return;//不安全
        int userid = check_dev.getInt("userid");
        String ty = request.getParameter("ty");//id
        String prog = request.getParameter("prog");//应用id
        String code = request.getParameter("code");//代码
        int old_version = Integer.parseInt(request.getParameter("version"));//版本
        String version_error = request.getParameter("version_error");//版本号异常不允许上传
        if (invalid(ty,prog,code,version_error)) {
            response.getWriter().println(p(0, "no"));
            return;
        }//如果输入非法
        if("".equals(code.trim())){
            response.getWriter().println(p(0, "上传失败，代码不允许为空，请重新上传！"));
            return;
        }
        ResultSet app = app_info(Integer.parseInt(prog), userid);//获取应用信息
        if (app == null) {
            response.getWriter().println(p(0, "no"));
            return;
        }
        Connection conn = DBUtils.getConnection();
        code=code.replace("\n","");
        byte[] codebyte=Base64.getDecoder().decode(code);//BASE64解码
        code=new String(codebyte, StandardCharsets.UTF_8);
        code=tool.cleanBOM(tool.cleanBOM(code));
        if("".equals(code.trim())){
            response.getWriter().println(p(0, "上传失败，代码不允许为空，请重新上传！"));
            return;
        }
        int tyid;
        if("html".equals(ty)){
            tyid=1;
        }else if("js".equals(ty)){
            tyid=2;
        }else if("json".equals(ty)){
            tyid=3;
        }else if("file".equals(ty)){
            tyid=4;
            String fileid=request.getParameter("fileid");//应用id
            if (invalid(fileid)) {
                response.getWriter().println(p(0, "no"));
                return;
            }//如果输入非法
            PreparedStatement pre = conn.prepareStatement("select * from app_file where appid = ? and id=?");
            pre.setInt(1, app.getInt("id"));
            pre.setInt(2, Integer.parseInt(fileid));
            ResultSet rs0 = pre.executeQuery();
            if(!rs0.next()){response.getWriter().println(p(0,"不存在这个文件！？"));return;}
            boolean version_error_flag;
            if(rs0.getInt("version")!=old_version){//版本号异常
                if("1".equals(version_error)){response.getWriter().println(p(0,"不正确的版本号！"));return;}
                version_error_flag=true;
            }else version_error_flag=false;

            int version=rs0.getInt("version")+1;
            pre = conn.prepareStatement("INSERT INTO `app_code`(`version`, `code`,`appid`, `type`) VALUES (?,?,?,4)");
            pre.setInt(1, version);
            pre.setString(2, code);
            pre.setInt(3, app.getInt("id"));
            pre.executeUpdate();
            int insert_id=tool.last_insert_id(conn);
            pre = conn.prepareStatement("update app_file set `version`=?,`codeid`=? where id=? and appid=?");
            pre.setInt(1, version);
            pre.setInt(2, insert_id);
            pre.setInt(3, Integer.parseInt(fileid));
            pre.setInt(4, app.getInt("id"));

            pre.executeUpdate();
            //更新文件指向的源码id

            JSONObject result=new JSONObject();
            result.put("version",version);
            result.put("version_error",version_error_flag);
            response.getWriter().println(p(100,"",result));
        }else{
            response.getWriter().println(p(0,"错了！！！"));return;
        }
        boolean version_error_flag;
        if(app.getInt(ty+"version")!=old_version){//版本号异常
            if("1".equals(version_error)){response.getWriter().println(p(0,"不正确的版本号！"));return;}
            version_error_flag=true;
        }else version_error_flag=false;


        int version=app.getInt(ty+"version")+1;
        int appid=app.getInt("id");
        PreparedStatement pre = conn.prepareStatement("INSERT INTO `app_code`(`version`, `code`,`appid`, `type`) VALUES (?,?,?,?)");
        pre.setInt(1, version);
        pre.setString(2, code);
        pre.setInt(3, appid);
        pre.setInt(4, tyid);
        pre.executeUpdate();

        int insert_id=tool.last_insert_id(conn);
        pre = conn.prepareStatement(String.format("update app_info set `%sversion`=?,`%scode`=? where id=? and userid=?", ty, ty));
        pre.setInt(1, version);
        pre.setInt(2, insert_id);
        pre.setInt(3, app.getInt("id"));
        pre.setInt(4, check_dev.getInt("userid"));

        pre.executeUpdate();
        //更新文件指向的源码id

        JSONObject result=new JSONObject();
        result.put("version",version);
        result.put("version_error",version_error_flag);
        response.getWriter().println(p(100,"",result));
        conn.close();
    }
    @RequestMapping(value="/api",params = {"type=compileapp"})
    public void compileapp(HttpServletRequest request, HttpServletResponse response) throws Exception {
        ResultSet check_dev = check_dev(request, response);
        if (check_dev == null) return;//不安全
        int userid = check_dev.getInt("userid");
        String version = request.getParameter("version");//自己输入的版本号
        String prog = request.getParameter("prog");//应用id
        if (invalid(version,prog)) {
            response.getWriter().println(p(0, "no"));
            return;
        }//如果输入非法
        ResultSet app = app_info(Integer.parseInt(prog), userid);//获取应用信息
        if (app == null) {
            response.getWriter().println(p(0, "no"));
            return;
        }
        Connection conn = DBUtils.getConnection();
        String code=tool.get_hash();

        int appid=app.getInt("id");


        int code_html=app.getInt("htmlcode");
        int code_js=app.getInt("jscode");
        int code_json=app.getInt("jsoncode");
        String code_htmlstr="";
        String code_jsstr="";
        String code_jsonstr="";

        if(code_html>0){//获取HTML
            PreparedStatement pre = conn.prepareStatement("select code from app_code where id=? and appid=?");
            pre.setInt(1,code_html);
            pre.setInt(2, appid);
            ResultSet rs=pre.executeQuery();
            rs.next();
            code_htmlstr=rs.getString(1);
        }
        if(code_js>0){//获取js
            PreparedStatement pre = conn.prepareStatement("select code from app_code where id=? and appid=?");
            pre.setInt(1,code_js);
            pre.setInt(2, appid);
            ResultSet rs=pre.executeQuery();
            rs.next();
            code_jsstr=rs.getString(1);
        }
        if(code_json>0){//获取js
            PreparedStatement pre = conn.prepareStatement("select code from app_code where id=? and appid=?");
            pre.setInt(1,code_json);
            pre.setInt(2, appid);
            ResultSet rs=pre.executeQuery();
            rs.next();
            code_jsonstr=rs.getString(1);
        }
        PreparedStatement pre = conn.prepareStatement("select * from app_file where appid=?");
        pre.setInt(1, appid);
        ResultSet rs=pre.executeQuery();
        while(rs.next()){
            String content="";
            if(rs.getInt("codeid")>0){
                pre = conn.prepareStatement("select * from app_code where id=? and appid=?");
                pre.setInt(1, rs.getInt("codeid"));
                pre.setInt(2, appid);
                ResultSet rs0 = pre.executeQuery();
                if(!rs0.next()){response.getWriter().println(p(0, "ch_include错误！"));return;}
                content=rs0.getString("code");
            }
//            code_htmlstr
            code_htmlstr=code_htmlstr.replace("<!--ch_include "+rs.getString("filename")+"-->",content);
            code_jsstr=code_jsstr.replace("<!--ch_include "+rs.getString("filename")+"-->",content);
            code_jsonstr=code_jsonstr.replace("<!--ch_include "+rs.getString("filename")+"-->",content);

//            code_htmlstr=Pattern.compile(code_htmlstr).matcher("<!--ch_include "+rs.getString("filename")+"-->").replaceAll(content);
//            code_jsstr=Pattern.compile(code_jsstr).matcher("<!--ch_include "+rs.getString("filename")+"-->").replaceAll(content);
//            code_jsonstr=Pattern.compile(code_jsonstr).matcher("<!--ch_include "+rs.getString("filename")+"-->").replaceAll(content);
        }//替换完成
//        YUICompressor.main();
        code_jsonstr = Compressor.JSONCompressor(code_jsonstr);
//        compressor.compress();
//        JavaScriptCompressor.
        JSONObject json = JSONObject.parseObject(code_jsonstr);
        if(json==null){
            response.getWriter().println(p(0, "编译选项json语法错误！"));
            conn.close();
            return;
        }
        if(json.containsKey("minify")){
            if(json.getBoolean("minify")){
                code_htmlstr=Compressor.HtmlCompressor(code_htmlstr);
                code_jsstr=Compressor.JavaScriptCompressor(code_jsstr);
            }
        }
        w(this.getClass().getResource(WebAppOSConfig.static_path).getPath()+WebAppOSConfig.static_cache_path,code+".html",code_htmlstr.getBytes(StandardCharsets.UTF_8));
        w(this.getClass().getResource(WebAppOSConfig.static_path).getPath()+WebAppOSConfig.static_cache_path,code+".js",code_jsstr.getBytes(StandardCharsets.UTF_8));

        pre = conn.prepareStatement("INSERT INTO `app_compile`(`userid`, `appid`,`version`, `use_html`, `use_js`, `use_json`,`destinationhtml`, `destinationjs`)" +
                "VALUES (?,?,?,?,?,?,?,?)");
        pre.setInt(1,check_dev.getInt("userid"));
        pre.setInt(2, appid);
        pre.setString(3, version);
        pre.setInt(4, app.getInt("htmlcode"));
        pre.setInt(5, app.getInt("jscode"));
        pre.setInt(6, app.getInt("jsoncode"));
        pre.setString(7, code+".html");
        pre.setString(8, code+".js");
        pre.executeUpdate();
        int insert_id=tool.last_insert_id(conn);
        pre = conn.prepareStatement("INSERT INTO app_compiled(targetid,codehtml,codejs)values(?,?,?)");
        pre.setInt(1,insert_id);
        pre.setString(2, code_htmlstr);
        pre.setString(3, code_jsstr);
        pre.executeUpdate();
        pre = conn.prepareStatement("update app_info set compile_version=? where id=?");
        pre.setInt(1,insert_id);
        pre.setInt(2, appid);
        pre.executeUpdate();
        JSONObject result=new JSONObject();
        result.put("server_time",(int)(System.currentTimeMillis()/1000));
        result.put("version",version);
        response.getWriter().println(p(100,"",result));
        conn.close();
    }
    @RequestMapping(value="/api",params = {"type=submitapp"})
    public void submitapp(HttpServletRequest request, HttpServletResponse response) throws Exception {
        ResultSet check_dev = check_dev(request, response);
        if (check_dev == null) return;//不安全
        int userid = check_dev.getInt("userid");
        String prog = request.getParameter("prog");//应用id
        if (invalid(prog)) {
            response.getWriter().println(p(0, "no"));
            return;
        }//如果输入非法
        ResultSet app = app_info(Integer.parseInt(prog), userid);//获取应用信息
        if (app == null) {
            response.getWriter().println(p(0, "no"));
            return;
        }
        if(app.getInt("compile_version")==0){response.getWriter().println(p(0,"未提交体验版！"));return;}

        Connection conn = DBUtils.getConnection();

        /*PreparedStatement pre = conn.prepareStatement("INSERT INTO `app_check`(`target`, `version`,`userid`, `status`, `check_text`) " +
                "VALUES (?,?,?,'100','ok')");
        pre.setInt(1,app.getInt("id"));
        pre.setInt(2, app.getInt("compile_version"));
        pre.setString(3, check_dev.getInt("userid"));
        pre.executeUpdate();*/
        String version1="1.0";
        if(check_dev.getInt("userid")==1||1==1){//   1==1代表全部过审  审核机制
            PreparedStatement pre = conn.prepareStatement("INSERT INTO `app_check`(`target`, `version`,`userid`, `status`, `check_text`)" +
                    "VALUES (?,?,?,'100','ok')");//提交审核
            pre.setInt(1,app.getInt("id"));
            pre.setInt(2, app.getInt("compile_version"));
            pre.setInt(3, check_dev.getInt("userid"));
            pre.executeUpdate();
            pre = conn.prepareStatement("update app_info set compile=compile_version where id=?");//提交审核
            pre.setInt(1,app.getInt("id"));
            pre.executeUpdate();
            if(app.getInt("compile")>0){
                pre = conn.prepareStatement("select version from app_compile where id=?");//提交审核
                pre.setInt(1,app.getInt("compile_version"));
                ResultSet rs = pre.executeQuery();
                rs.next();
                version1=rs.getString(1);
            }
        }else{
            PreparedStatement pre = conn.prepareStatement("INSERT INTO `app_check`(`target`, `version`,`userid`, `status`, `check_text`)" +
                    "VALUES (?,?,?,'0','wait')");//提交审核
            pre.setInt(1,app.getInt("id"));
            pre.setInt(2, app.getInt("compile_version"));
            pre.setInt(3, check_dev.getInt("userid"));
            pre.executeUpdate();
        }
        JSONObject result=new JSONObject();
        result.put("server_time",(int)(System.currentTimeMillis()/1000));
        result.put("version",version1);
        response.getWriter().println(p(100,"",result));
        conn.close();
    }
    @RequestMapping(value="/api",params = {"type=uploadimg"})
    public void uploadimg(HttpServletRequest request, HttpServletResponse response) throws Exception {
        ResultSet check_dev = check_dev(request, response);
        if (check_dev == null) return;//不安全
        int userid = check_dev.getInt("userid");
        String prog = request.getParameter("prog");//应用id
        String img = request.getParameter("img");//图片
        if (invalid(prog, img)) {
            response.getWriter().println(p(0, "no"));
            return;
        }//如果输入非法
        ResultSet app = app_info(Integer.parseInt(prog), userid);//获取应用信息
        if (app == null) {
            response.getWriter().println(p(0, "no"));
            return;
        }
        img=img.replace("\n","");
        byte[] imgbyte = Base64.getDecoder().decode(img);
        //保留两张压缩的图 64*64 108*108
        InputStream buffin = new ByteArrayInputStream(imgbyte);
        BufferedImage img2 = ImageIO.read(buffin);
        byte[] imgbyte2=ReduceImg.reduceImg2(img2,108,108);

        w(this.getClass().getResource(WebAppOSConfig.static_path).getPath()+WebAppOSConfig.static_cache_path,app.getString("publickey")+".108.png",imgbyte2);
        byte[] imgbyte3=ReduceImg.reduceImg2(img2,64,64);
        w(this.getClass().getResource(WebAppOSConfig.static_path).getPath()+WebAppOSConfig.static_cache_path,app.getString("publickey")+".64.png",imgbyte3);
        String upload=Base64.getEncoder().encodeToString(imgbyte2);

        Connection conn = DBUtils.getConnection();
        PreparedStatement pre = conn.prepareStatement("INSERT INTO `app_img`(`appid`, `data`)\n" +
                "\t\t\tVALUES (?,?)");//提交审核
        pre.setInt(1,app.getInt("id"));
        pre.setString(2, upload);
        pre.executeUpdate();
        int insert_id=tool.last_insert_id(conn);
        w(this.getClass().getResource(WebAppOSConfig.static_path).getPath()+WebAppOSConfig.static_cache_path,app.getString("publickey")+".png",imgbyte2);

        pre = conn.prepareStatement("update app_info set imgfile=?,imgversion=imgversion+1 where id = ?");//提交审核
        pre.setInt(1, insert_id);
        pre.setInt(2,app.getInt("id"));

        pre.executeUpdate();
        JSONObject result=new JSONObject();
        result.put("code_img",upload);
        response.getWriter().println(p(100,"",result));
        conn.close();
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static ResultSet check_dev(HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException {//不安全返回false
        String time= request.getParameter("time");
        String userid= request.getParameter("userid");
        String pwd= request.getParameter("pwd");
        if(invalid(time,userid,pwd)){
            response.getWriter().println(p(1,"登录失效了！"));
            return null;
        }
        Connection conn = DBUtils.getConnection();
        PreparedStatement preState = conn.prepareStatement("select * from app_userinfo,app_token where token=? and app_token.userid=app_userinfo.id and app_userinfo.uniquekey=?");
        preState.setString(1,pwd);
        preState.setString(2,userid);
        ResultSet rs0=preState.executeQuery();
        if(!rs0.next()){
            response.getWriter().println(p(1,"登录失效了！"));
            conn.close();
            return null;
        }
        return rs0;
    }
    private static JSONArray filelist(int appid) throws SQLException {
        JSONArray filelist=new JSONArray();
        Connection conn = DBUtils.getConnection();
        PreparedStatement pre = conn.prepareStatement("select * from app_file where appid=?");
        pre.setInt(1, appid);
        ResultSet rs=pre.executeQuery();
        while(rs.next()){
            JSONObject k=new JSONObject();
            k.put("name",rs.getString("filename"));
            k.put("code",rs.getString("id"));
            filelist.add(k);
        }
        return filelist;
    }
    private static JSONArray list_app(int userid) throws SQLException {
        JSONArray result=new JSONArray();
        String[] str = {"id", "应用id", "标题", "公钥", "HTML代码长度", "JS代码长度", "体验版本号", "发布版本号", "私钥"};
        JSONArray userarray = (JSONArray) JSONArray.toJSON(str);
        result.add(userarray);
        Connection conn = DBUtils.getConnection();
        PreparedStatement preState = conn.prepareStatement("select * from app_info where userid=?");
        preState.setInt(1,userid);
        ResultSet rs = preState.executeQuery();
        int i=0;
        while(rs.next()){
            i++;
            float htmlcodelength=0;
            float jscodelength=0;
            if(rs.getInt("htmlcode")!=0){
                preState = conn.prepareStatement("select length(code) from app_code where id=?");
                preState.setInt(1,rs.getInt("htmlcode"));
                ResultSet rs0 = preState.executeQuery();
                rs0.next();
                htmlcodelength=rs0.getInt(1);
            }
            if(rs.getInt("jscode")!=0){
                preState = conn.prepareStatement("select length(code) from app_code where id=?");
                preState.setInt(1,rs.getInt("jscode"));
                ResultSet rs0 = preState.executeQuery();
                rs0.next();
                jscodelength=rs0.getInt(1);
            }
            JSONArray arr=new JSONArray();
            arr.add(i);
            arr.add(rs.getInt("id"));
            arr.add(rs.getString("name"));
            arr.add(rs.getString("publickey"));
            arr.add(String.format("%.2f",htmlcodelength/1024)+"kb");
            arr.add(String.format("%.2f",jscodelength/1024)+"kb");
            arr.add(rs.getInt("compile_version"));
            arr.add(rs.getInt("compile"));
            arr.add(rs.getString("privatekey"));
            result.add(arr);
        }
        return result;
    }
    private static ResultSet app_info(int id, int userid) throws SQLException {
        Connection conn = DBUtils.getConnection();
        PreparedStatement preState = conn.prepareStatement("select * from app_info where id=? and userid=?");
        preState.setInt(1,id);
        preState.setInt(2,userid);
        ResultSet rs = preState.executeQuery();
        if(!rs.next())return null;
        return rs;
    }
    public static String pwdEncrypt(String str) {
        return tool.sha1("webappos:"+str);
    }
    private static void w(String url,String filename,byte[] code) throws IOException {
        File file = new File(url);
        if(!file.exists()&&!file.isDirectory())
            file.mkdirs();
        file = new File(url+"./"+filename);
        file.createNewFile();
        FileOutputStream out = new FileOutputStream(file);
        out.write(code);
        out.close();
//        FileWriter fileWritter = new FileWriter(file.getName());//覆盖
//        BufferedWriter bufferWritter = new BufferedWriter(fileWritter);
//
//        bufferWritter.write(code);
//        bufferWritter.close();
//        fileWritter.close();
    }
    private static boolean invalid(String... strs) {//是否非法
        for (String str : strs)
            if (str == null||"".equals(str))return true;
        return false;
    }
    private static String p(int res,String text){
        JSONObject result=new JSONObject();
        result.put("res",res);
        result.put("text",text);
        result.put("data",null);
        return JSON.toJSONString(result, SerializerFeature.WriteMapNullValue,SerializerFeature.BrowserCompatible);
    }
    private static String p(int res,String text,JSONObject json){
        JSONObject result=new JSONObject();
        result.put("res",res);
        result.put("text",text);
        result.put("data",json);
        return JSON.toJSONString(result, SerializerFeature.WriteMapNullValue,SerializerFeature.BrowserCompatible);
    }
    private static String ok(Object json){
        JSONObject result=new JSONObject();
        result.put("res",100);
        result.put("text","ok");
        result.put("data",json);
        return JSON.toJSONString(result, SerializerFeature.WriteMapNullValue,SerializerFeature.BrowserCompatible);
    }
    private void output(HttpServletResponse response,JSONObject json){
        try {
            response.getWriter().println(JSON.toJSONString(json, SerializerFeature.WriteMapNullValue,SerializerFeature.BrowserCompatible));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
