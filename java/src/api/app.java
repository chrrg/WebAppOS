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
@RequestMapping("/app")
public class app {//管理端
    @RequestMapping(value="/applist")
    public void applist(HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException {
        Connection conn = DBUtils.getConnection();
        PreparedStatement pre = conn.prepareStatement("select * from `app_info` where `compile_version` is not NULL");//提交审核
        ResultSet rs = pre.executeQuery();
        JSONArray arr=new JSONArray();
        while(rs.next()){
            JSONObject item=new JSONObject();
            item.put("apphash",rs.getString("publickey"));
            item.put("apptitle",rs.getString("name"));
            item.put("appdes",rs.getString("des"));

            arr.add(item);
        }
        JSONObject result=new JSONObject();
        result.put("applist",arr);
        response.getWriter().println(p(100,"",result));
        conn.close();//数据库关闭
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
