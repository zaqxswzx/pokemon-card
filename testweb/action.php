資料呈現：06_05_form.php [code]
<?php 
	//因為要使用 session，所以需要先讓 php 進行起始的動作。
	session_start();

?>
<html>

<head>
    <title>表單練習</title>
</head>

<body>
    <?php 
		if (isset($_SESSION["login"] )){
			
			echo "歡迎登入, ".$_SESSION["login"]." ！";
			echo "<a href='06_05_logout.php'>登出</a>";

		}else{ ?>
    <form method="POST" action="06_05_login.php">
        <!-- 指定處理對象 -->
        <p>請輸入帳號 <input type="text" name="account" /> </p>
        <p>請輸入密碼 <input type="password" name="password" /> </p>

        <p><input type="submit" value="送出" /></p>
    </form>
    <?php } ?>
</body>

</html>
[/code] 登入邏輯處理：06_05_login.php [code]
<?php 
	//因為要使用 session，所以需要先讓 php 進行起始的動作。
	session_start();
	if(isset($_POST["account"])){
		if(
			$_POST["account"] == "test" 
			&& $_POST["password"] =="1234"
		){
			echo "歡迎登入, test ！";
			echo "<a href='06_04_logout.php'>登出</a>";
			$_SESSION["login"] = "test";
			header( 'Location: 06_05_form.php' ) ;//導向回表單畫面
		}else{
			echo "帳號或密碼輸入錯誤";
		}

	}
?> [/code] 登出處理：06_05_logout.php [code]
<?php 
	//因為要使用 session，所以需要先讓 php 進行起始的動作。
	session_start();

?>
<html>

<head>
    <title>表單練習</title>
</head>

<body>
    <?php 
			session_destroy();
		 ?> 您已登出完成
    <a href="06_05_form.php">重新登入</a>
</body>

</html>
[/code]