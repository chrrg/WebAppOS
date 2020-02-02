package api;

import com.yahoo.platform.yui.compressor.JavaScriptCompressor;
import org.mozilla.javascript.ErrorReporter;
import org.mozilla.javascript.EvaluatorException;
//import com.yahoo.platform.yui.compressor.YUICompressor
import java.io.*;

public class Compressor {
    public static String JavaScriptCompressor(String str) {
        return JSCompressor.compress(str);
//        InputStreamReader in = new InputStreamReader(str, "UTF-8");
//        StringReader in=new StringReader(str);
//        com.yahoo.platform.yui.compressor.JavaScriptCompressor compressor = new JavaScriptCompressor(in,new ErrorReporter() {
//            @Override
//            public void warning(String s, String s1, int i, String s2, int i1) {
//
//            }
//            @Override
//            public void error(String s, String s1, int i, String s2, int i1) {
//
//            }
//            @Override
//            public EvaluatorException runtimeError(String s, String s1, int i, String s2, int i1) {
//                return null;
//            }
//        });
//        StringWriter out=new StringWriter();
//        compressor.compress(out, -1, false, false, false, false);
//        return out.toString();
        //if(type!=null && type.equals("yui")){
        //    compressor.compress(response.getWriter(), -1, true, false, false, false);
        //}else if(type!=null && type.equals("pack")){//普通压缩
        //    compressor.compress(response.getWriter(), 0, true, false, false, false);
        //}

    }

    public static String HtmlCompressor(String str) throws Exception {
        return HtmlCompressor.compress(str);
    }
    public static String JSONCompressor(String str){
        return JSCompressor.compress(str).replace("\n","").trim();
    }
    public static void main(String [] main){

        System.out.println(JavaScriptCompressor("a=1\r\n\r\n\r\n/*123123*/a();/*123*/b=2\r\nvar a=    1; \n \t a = 333;b=666\n  /*123123*/ \napp({  \t  });//123345\ntest()"));
        System.out.println(JavaScriptCompressor("s={\"a\":2}"));
        System.out.println(JavaScriptCompressor("test()\nhello();\nvar aasdasd=1;var ffffb=2;p(aasdasd);"));
        System.out.println(JavaScriptCompressor("a={\"a\":1,\"b\":2,\"c\":{\"d\":2}};asdassd=2;\n/*123*/\nte(5);print(asdasd);a=true;(function(){var ass=3;console.log(ass);})"));
//            JavaScriptCompressor.compress();

        System.out.println(JSCompressor.compress("{\"a\":1,\"b\":2,\"c\":{\"d\":2\n//123\n}}"));
        System.out.println("123456".length());
        System.out.println("好".length());

        System.out.println("1234哈哈".length());
        System.out.println("牛66".length());


    }
    public static int String_length(String value) {
        int valueLength = 0;
        String chinese = "[\u4e00-\u9fa5]";
        for (int i = 0; i < value.length(); i++) {
            String temp = value.substring(i, i + 1);
            if (temp.matches(chinese)) {
                valueLength += 2;
            } else {
                valueLength += 1;
            }
        }
        return valueLength;
    }
}
