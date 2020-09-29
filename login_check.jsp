<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> 
<%@ page import="java.sql.*"%>
<%@ page import="SHA256.*"%>
<%
request.setCharacterEncoding("UTF-8");
String id = request.getParameter("id");
String pw = request.getParameter("pw");
String shaPassword = "1234";
String db = "yolo"; String uid = "root"; String pass = "root";
String sql = "select * from user where id=?";
try{
	shaPassword = SHA256.encrypt(pw);
	Class.forName("com.mysql.jdbc.Driver");
	Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/"+db+"?serverTimezone=Asia/Seoul", uid, pass);
	PreparedStatement pre = conn.prepareStatement(sql);
	pre.setString(1,id);
	ResultSet rs = pre.executeQuery();
	if(rs.next()){
		if(id!=null && id.equals(rs.getString("id"))){
			if(shaPassword!=null && shaPassword.equals(rs.getString("pw"))){
				response.sendRedirect("splash.html");
			}
		}
	}
%>
<script>
	alert("Please check your ID or PASSWORD!");
	location.href="index.html";
</script>
<%
}
catch(Exception e){
	out.print("Error<p>" + e.getMessage());
}
%>