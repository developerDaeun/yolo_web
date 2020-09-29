<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> 
<%@ page import="java.sql.*"%>
<%@ page import="SHA256.*"%>
<%
request.setCharacterEncoding("UTF-8");
String id = request.getParameter("id");
String pw = request.getParameter("pw");
String shaPassword = "1234";
String db = "yolo"; String uid = "root"; String pass = "root";
String sql = "insert into user values(?,?)";
try{
	shaPassword = SHA256.encrypt(pw);
	Class.forName("com.mysql.jdbc.Driver");
	Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/"+db+"?serverTimezone=Asia/Seoul", uid, pass);
	PreparedStatement pre = conn.prepareStatement(sql);
	pre.setString(1,id); pre.setString(2,shaPassword);
	pre.executeUpdate();
%>
<script>
	alert("SignUp Success!");
	location.href="index.html";
</script>
<%
}
catch(Exception e){
	out.print("Error<p>" + e.getMessage());
}
%>