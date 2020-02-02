package api;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;


@Controller
@RequestMapping("/admin")
public class admin {//管理端
    @RequestMapping(value="/api",params = {"type=userlist"})
    public void userlist(HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException {
        //主要功能：列出用户列表
        ResultSet check_dev=manage.check_dev(request,response);
        if(check_dev==null)return;//不安全
        Connection conn = DBUtils.getConnection();
        if(!isAdmin(response,conn,check_dev.getInt("userid")))return;//不是管理员
        PreparedStatement pre = conn.prepareStatement("select * from app_username,app_userinfo where app_username.userid=app_userinfo.id");//提交审核
        ResultSet rs = pre.executeQuery();
        rs.next();
        int count=rs.getInt(1);

        int page= Integer.parseInt(request.getParameter("page"));//用户
        int limit= Integer.parseInt(request.getParameter("limit"));//密码
        String num1= String.valueOf((page-1)*limit);
        String num2= String.valueOf(limit);
        JSONArray arr=new JSONArray();
        if(count>0) {
            pre = conn.prepareStatement("select * from app_username,app_userinfo where app_username.userid=app_userinfo.id limit "+num1+","+num2);//提交审核
            rs = pre.executeQuery();
            while (rs.next()) {
                JSONObject item = new JSONObject();
                item.put("id", rs.getInt("id"));
                item.put("username", rs.getString("username"));
                item.put("createTime", rs.getString("createTime"));
                item.put("userhash", rs.getString("createTime"));
                item.put("userkey", rs.getString("createTime"));

                arr.add(item);
            }
        }
        JSONObject result=new JSONObject();
        result.put("code",0);
        result.put("msg","");
        result.put("count",count);
        result.put("data",arr);
//        response.getWriter().println(p(100,"",result));
        response.getWriter().println(JSON.toJSONString(result, SerializerFeature.WriteMapNullValue,SerializerFeature.BrowserCompatible));
        conn.close();//数据库关闭
    }
    @RequestMapping(value="/api",params = {"type=addUser"})
    public void addUser(HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException {
        ResultSet check_dev=manage.check_dev(request,response);
        if(check_dev==null)return;//不安全
        Connection conn = DBUtils.getConnection();
        if(!isAdmin(response,conn,check_dev.getInt("userid")))return;//不是管理员

        String user=request.getParameter("username");//用户
        String pwd=request.getParameter("password");//密码
        if(user.length()<2){
            response.getWriter().println(p(81,"用户名太短！"));conn.close();return;
        }
        if(pwd.length()<4){
            response.getWriter().println(p(81,"密码太短！"));conn.close();return;
        }
        if(invalid(user,pwd)){response.getWriter().println(p(0,"no"));conn.close();return;}//如果输入非法
        PreparedStatement preState = conn.prepareStatement("SELECT * from `app_username` WHERE username= ?");
        preState.setString(1,user);
        ResultSet rs=preState.executeQuery();
        if(rs.next()){response.getWriter().println(p(80,"用户已存在！"));conn.close();return;}//如果输入非法


        preState = conn.prepareStatement("INSERT INTO `app_userinfo`(`uniquekey`,`identifykey`) VALUES (? , ?)");
        preState.setString(1,tool.get_hash());
        preState.setString(2,tool.get_hash());
        preState.executeUpdate();//新增用户
        int insert_id=tool.last_insert_id(conn);//获取userid
        preState = conn.prepareStatement("INSERT INTO `app_username`(`userid`,`username`,`password`) VALUES (? , ? , ?)");//映射userid到账号密码
        preState.setInt(1,insert_id);
        preState.setString(2,user);//初始化账号
        preState.setString(3,manage.pwdEncrypt(pwd));//初始化密码
        JSONObject result=new JSONObject();
        result.put("result",preState.executeUpdate());

        response.getWriter().println(p(100,"",result));
        conn.close();//数据库关闭
    }
    @RequestMapping(value="/api",params = {"type=changePwd"})
    public void changePwd(HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException {
        ResultSet check_dev=manage.check_dev(request,response);
        if(check_dev==null)return;//不安全
        Connection conn = DBUtils.getConnection();
        if(!isAdmin(response,conn,check_dev.getInt("userid")))return;//不是管理员
        int userid2 = Integer.parseInt(request.getParameter("changeUserid"));
        String pwd=request.getParameter("password");
        if(pwd.length()<4){//密码太短
            response.getWriter().println(p(81,"密码太短！"));conn.close();return;
        }
        if(invalid(pwd)){//如果输入非法
            response.getWriter().println(p(0,"no"));conn.close();return;
        }

        PreparedStatement preState = conn.prepareStatement("UPDATE app_username set password=? WHERE userid=?");
        preState.setString(1,manage.pwdEncrypt(pwd));
        preState.setInt(2,userid2);

        JSONObject result=new JSONObject();
        result.put("result",preState.executeUpdate());
        response.getWriter().println(p(100,"",result));
        conn.close();//数据库关闭
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private boolean isAdmin(HttpServletResponse response,Connection conn,int userid) throws IOException, SQLException {
        PreparedStatement pre = conn.prepareStatement("select * from app_username where userid = ? and username='admin'");//提交审核
        pre.setInt(1,userid);
        ResultSet rs = pre.executeQuery();
        if(!rs.next()){
            response.getWriter().println(p(1,"您无权限进行此操作！"));
            conn.close();//数据库关闭
            return false;
        }
        return true;
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
}
