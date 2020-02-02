package api;

import org.springframework.util.DigestUtils;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.*;

public class tool {
    public static String sha1(String inStr){
        MessageDigest sha;
        try {
            sha = MessageDigest.getInstance("SHA");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return "";
        }
        byte[] byteArray = inStr.getBytes(StandardCharsets.UTF_8);
        byte[] md5Bytes = sha.digest(byteArray);
        StringBuilder hexValue = new StringBuilder();
        for (byte md5Byte : md5Bytes) {
            int val = ((int) md5Byte) & 0xff;
            if (val < 16)hexValue.append("0");
            hexValue.append(Integer.toHexString(val));
        }
        return hexValue.toString();
    }
    public static String get_hash(){
        String key="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()+-";
        StringBuilder str= new StringBuilder();
        for(int i=0;i<5;i++)
            str.append(key.charAt((int)(Math.random()*key.length())));
        str.append(System.currentTimeMillis());
        return sha1(str.toString());
    }
    public static int last_insert_id(Connection conn) throws SQLException {
        Statement statement = (Statement) conn.createStatement();
        ResultSet rs = statement.executeQuery("SELECT last_insert_id();");
        if(!rs.next())return 0;
        return rs.getInt(1);
    }
    public static String md5(String str) {
        return DigestUtils.md5DigestAsHex(str.getBytes());
    }
    public static boolean isValidFileName(String fileName) {
        if (fileName == null || fileName.length() > 255)
            return false;
        else
            return fileName.matches("[^\\s\\\\/:\\*\\?\\\"<>\\|](\\x20|[^\\s\\\\/:\\*\\?\\\"<>\\|])*[^\\s\\\\/:\\*\\?\\\"<>\\|\\.]$");
    }
    static String cleanBOM(String str){
        if(str.length()>=1&&+str.charAt(0)==65279)return str.substring(1);
        return str;
    }
    public static void main(String[] s){
//        for(int i=0;i<1000;i++)
//            get_hash();
//        System.out.println(ClassLoader.class.getResource("/"));
//        System.out.println("aaaaaaaa".replace("a","b"));
    }

}
