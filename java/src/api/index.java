package api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

@Controller
@RequestMapping("/")
public class index {//管理端
    @RequestMapping(value="")
    public void doIndex(HttpServletRequest request, HttpServletResponse response) throws IOException {
//        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=utf-8");
        response.getWriter().println("<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <title>WebAppOS 项目创建成功</title>\n" +
                "    <meta charset=\"utf-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width,intial-scale=1,user-scalable=no\">\n" +
                "</head>\n" +
                "<body>\n" +
                "<h1>WebAppOS 系统启动成功！</h1><br />" +
                "<h2>确保要用域名打开！测试域名: “www.123.cn”解析到“127.0.0.1”需要手动修改hosts文件。</h2>" +
                "\n" +
                "<div>\n" +
                "    <a href=\"http://www.123.cn/static/os/\">点我去启动小程序吧！http://www.123.cn/static/os/</a>\n" +
                "</div>\n" +
                "<br />\n" +
                "<div>\n" +
                "    <a href=\"http://www.123.cn/static/manage/\">点我去管理小程序吧！http://www.123.cn/static/manage/</a>\n" +
                "</div>\n" +
                "</body>\n" +
                "</html>");
    }
}
