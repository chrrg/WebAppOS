package api;
import java.sql.Connection;
import org.apache.commons.dbcp2.BasicDataSource;

public class DBUtils {
	private static String driver;
	private static String url;
	private static String username;
	private static String password;
	private static int initSize;
	private static int maxTotal;
	private static BasicDataSource ds;
	static { 
		ds = new BasicDataSource();
		try {
			driver=WebAppOSConfig.DatabaseDriver;
			url=WebAppOSConfig.Database_URL;
			username=WebAppOSConfig.Database_UserName;
			password=WebAppOSConfig.Database_PassWord;
			initSize=WebAppOSConfig.DatabaseConnection_initSize;
			maxTotal=WebAppOSConfig.DatabaseConnection_maxTotal;
			ds.setDriverClassName(driver);
			ds.setUrl(url);
			ds.setUsername(username);
			ds.setPassword(password);
			ds.setInitialSize(initSize);
//			ds.setMinIdle(5);//最小空闲数
			ds.setMaxTotal(maxTotal);
			ds.setPoolPreparedStatements(true);
			ds.setValidationQuery("SELECT 1");
			ds.setMaxWaitMillis(9000);//9000ms
			ds.setRemoveAbandonedTimeout(90);//如果超过90秒自动释放这个数据库连接
			ds.setRemoveAbandonedOnBorrow(true);
			ds.setRemoveAbandonedOnMaintenance(true);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}
	static Connection getConnection() {
		try {
			return ds.getConnection();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);		
		}
	}
	public static void close(Connection conn) {
		if(conn!=null) {
			try {
				conn.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
}