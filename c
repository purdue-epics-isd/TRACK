[1mdiff --git a/Anna.html b/Anna.html[m
[1mindex e75d6e6..aa1dcca 100644[m
[1m--- a/Anna.html[m
[1m+++ b/Anna.html[m
[36m@@ -3,12 +3,16 @@[m
 <style>[m
 body {[m
 	text-align: center;[m
[32m+[m	[32mbackground-color: #0e47a1;[m
[32m+[m	[32mcolor: white;[m
 }[m
 .button {[m
[31m-  background-color: #2196F3;[m
[32m+[m[32m  background-color: #3e52b5;[m
   border: 2px solid #4CAF50;[m
   border-color: black;[m
[31m-  color: black;[m
[32m+[m[32m  padding-left: 5%;[m
[32m+[m[32m  padding-right: 5%;[m
[32m+[m[32m  color: white;[m
   text-align: center;[m
   text-decoration: none;[m
   display: inline-block;[m
[36m@@ -16,14 +20,6 @@[m [mbody {[m
   transition-duration: 0.4s;[m
   cursor: pointer;[m
 }[m
[31m-.topnav a {[m
[31m-  float: left;[m
[31m-  color: #f2f2f2;[m
[31m-  text-align: center;[m
[31m-  padding: 14px 16px;[m
[31m-  text-decoration: none;[m
[31m-  font-size: 17px;[m
[31m-}[m
 </style>[m
 [m
 <body>[m
[36m@@ -32,12 +28,12 @@[m [mbody {[m
 [m
 <div class="grid-container">[m
   <a href="goalOne.html" class="button">Counting to 10</a><br><br>[m
[31m-  <a href="newpage.html" class="button">Goal Two</a><br><br>[m
[31m-  <a href="newpage.html" class="button">Goal Three</a><br><br><br>[m
[32m+[m[32m  <a href="classPage.html" class="button">Goal Two</a><br><br>[m
[32m+[m[32m  <a href="classPage.html" class="button">Goal Three</a><br><br><br>[m
   <a href="newgoal.html" class="button">Create New Goal</a><br><br><br><br>[m
 </div>[m
 [m
[31m-<a href="index.html" class="button">Start over</a>[m
[32m+[m[32m<a href="login.html" class="button">Start over</a>[m
 [m
 </body>[m
 </html>[m
\ No newline at end of file[m
[1mdiff --git a/actionpage.html b/actionpage.html[m
[1mnew file mode 100644[m
[1mindex 0000000..4609838[m
[1m--- /dev/null[m
[1m+++ b/actionpage.html[m
[36m@@ -0,0 +1,9 @@[m
[32m+[m[32m<!DOCTYPE html>[m
[32m+[m[32m<html>[m
[32m+[m[32m<body>[m
[32m+[m[32m<script>[m
[32m+[m	[32mdocument.location.replace("classPage.html")[m
[32m+[m[32m</script>[m
[32m+[m
[32m+[m[32m</body>[m
[32m+[m[32m</html>[m
\ No newline at end of file[m
[1mdiff --git a/classPage.html b/classPage.html[m
[1mindex cd7c9ff..a41606c 100644[m
[1m--- a/classPage.html[m
[1m+++ b/classPage.html[m
[36m@@ -2,20 +2,28 @@[m
 <html>[m
 <head>[m
 <style>[m
[32m+[m[32mbody {[m
[32m+[m[32mbackground-color: #0e47a1;[m
[32m+[m[32m}[m
[32m+[m
 h1 {[m
 	text-align: center;[m
[32m+[m[32m  color: white;[m
[32m+[m[32m  white-space: nowrap;[m
 }[m
 .grid-container {[m
   display: grid;[m
   grid-template-columns: auto auto auto;[m
[31m-  background-color: #2196F3;[m
[32m+[m[32m  background-color: #3e52b5;[m
   padding: 10px;[m
[32m+[m[32m  border: 2px solid #0e47a1;[m
[32m+[m[32m  border-color: black;[m
 }[m
 .button {[m
   background-color: rgba(0, 0, 0, 0);[m
[31m-  border: 2px solid #4CAF50;[m
[32m+[m[32m  border: 2px solid #0e47a1;[m
   border-color: black;[m
[31m-  color: black;[m
[32m+[m[32m  color: white;[m
   text-align: center;[m
   text-decoration: none;[m
   display: inline-block;[m
[36m@@ -27,34 +35,54 @@[m [mh1 {[m
     background-color: #008CBA;[m
     color: white;[m
 }[m
[31m-.topnav {[m
[31m-  overflow: hidden;[m
[31m-  background-color: #333;[m
[32m+[m[32m.profile {[m
[32m+[m[32m  background-color: rgba(0, 0, 0, 0);[m
[32m+[m[32m  border: 2px solid #0e47a1;[m
[32m+[m[32m  border-color: black;[m
[32m+[m[32m  color: white;[m
[32m+[m[32m  text-align: center;[m
[32m+[m[32m  text-decoration: none;[m
[32m+[m[32m  display: inline-block;[m
[32m+[m[32m  font-size: 30px;[m
[32m+[m[32m  transition-duration: 0.4s;[m
[32m+[m[32m  cursor: pointer;[m
[32m+[m[32m  border-radius: 100%;[m
[32m+[m[32m  margin-left: 85%;[m
[32m+[m[32m  padding: 30px;[m
[32m+[m[32m}[m
[32m+[m[32m.profilepic {[m
[32m+[m[32m  max-width: 40px;[m
[32m+[m[32m  max-height: 40px;[m
 }[m
 [m
 </style>[m
 </head>[m
 <body>[m
 [m
[31m-<h1>English Class</h1>[m
[32m+[m[32m<table style="width: 90%">[m
[32m+[m[32m    <th style="padding-left: 34%">[m
[32m+[m[32m      <h1>1st Period English Class</h1>[m
[32m+[m[32m    </th>[m
[32m+[m[32m    <th>[m
[32m+[m[32m      <button type="button" class="profile"><img src="img\profile_picture.png" class="profilepic"></button>[m
[32m+[m[32m    </th>[m
[32m+[m[32m  </tr>[m
[32m+[m[32m</table>[m
 [m
 <div class="grid-container">[m
   <a href="Anna.html" class="button">Anna</a></button>[m
[31m-  <a href="Anna.html" class="button">Anna</a></button>[m
[31m-  <a href="Anna.html" class="button">Anna</a></button>[m
[31m-  <a href="Anna.html" class="button">Anna</a></button>[m
[31m-  <a href="Anna.html" class="button">Anna</a></button>[m
[31m-  <a href="Anna.html" class="button">Anna</a></button>[m
[31m-  <a href="Anna.html" class="button">Anna</a></button>[m
[31m-  <a href="Anna.html" class="button">Anna</a></button>[m
[31m-  <a href="Anna.html" class="button">Anna</a></button>[m
[31m-  <a href="Anna.html" class="button">Anna</a></button>[m
[31m-  <a href="Anna.html" class="button">Anna</a></button>[m
[31m-  <a href="Anna.html" class="button">Anna</a></button>[m
[32m+[m[32m  <a href="Anna.html" class="button">Brian</a></button>[m
[32m+[m[32m  <a href="Anna.html" class="button">Claire</a></button>[m
[32m+[m[32m  <a href="Anna.html" class="button">Grace</a></button>[m
[32m+[m[32m  <a href="Anna.html" class="button">Steve</a></button>[m
[32m+[m[32m  <a href="Anna.html" class="button">Bob</a></button>[m
[32m+[m[32m  <a href="Anna.html" class="button">Mark</a></button>[m
[32m+[m[32m  <a href="Anna.html" class="button">Mary</a></button>[m
[32m+[m[32m  <a href="Anna.html" class="button">Francis</a></button>[m
 </div>[m
 [m
 [m
[31m-<button type="button"><a href="index.html" target="_self">Go back</a></button>[m
[32m+[m[32m<button type="button"><a href="login.html" target="_self">Go back</a></button>[m
 [m
 </body>[m
 </html>[m
\ No newline at end of file[m
[1mdiff --git a/goalOne.html b/goalOne.html[m
[1mindex 04e1877..7322784 100644[m
[1m--- a/goalOne.html[m
[1m+++ b/goalOne.html[m
[36m@@ -1,7 +1,10 @@[m
 <!DOCTYPE html>[m
 <html>[m
 <style>[m
[31m-[m
[32m+[m[32mbody {[m
[32m+[m	[32mbackground-color: #0e47a1;[m
[32m+[m	[32mcolor: white;[m
[32m+[m[32m}[m
 </style>[m
 [m
 <body>[m
[1mdiff --git a/img/isdclipboard2.png b/img/isdclipboard2.png[m
[1mnew file mode 100644[m
[1mindex 0000000..7de7095[m
Binary files /dev/null and b/img/isdclipboard2.png differ
[1mdiff --git a/img/profile_picture.png b/img/profile_picture.png[m
[1mnew file mode 100644[m
[1mindex 0000000..89dbc17[m
Binary files /dev/null and b/img/profile_picture.png differ
[1mdiff --git a/login.html b/login.html[m
[1mindex 33aeca3..38bac0d 100644[m
[1m--- a/login.html[m
[1m+++ b/login.html[m
[36m@@ -3,28 +3,70 @@[m
 <head>[m
 	<title>LOGIN</title>[m
 	<style >[m
[31m-[m
 		body{[m
 			background-color: #3e52b5;[m
[31m-			f[m
[31m-		}[m
[32m+[m			[32mmargin: 0px;[m
[32m+[m			[32mposition:fixed;[m
[32m+[m			[32mwidth:100%;[m
[32m+[m			[32mtop:50%;[m
[32m+[m			[32mright:0%;[m
 [m
[32m+[m		[32m}[m
 		.a{[m
             font-size:40px;[m
 			text-align: center;[m
 			color: white;[m
[31m-[m
[32m+[m			[32mbackground-color: #0e47a1;[m
[32m+[m			[32mwidth:100%;[m
[32m+[m			[32mheight:15%;[m
[32m+[m			[32mposition:fixed;[m
[32m+[m			[32mleft:0%;[m
[32m+[m			[32mtop:0%;[m
[32m+[m		[32m}[m
[32m+[m		[32m.b{[m
[32m+[m			[32mfont-size:20px;[m
[32m+[m			[32mtext-align: center;[m
[32m+[m			[32mcolor: white;[m
[32m+[m			[32mbackground-color: #0e47a1;[m
[32m+[m			[32mfont-style:italic;[m
[32m+[m			[32mheight:15%;[m
[32m+[m			[32mwidth:100%;[m
[32m+[m			[32mposition:fixed;[m
[32m+[m			[32mleft:0%;[m
[32m+[m			[32mbottom:0%;[m
[32m+[m		[32m}[m
[32m+[m		[32m.c{[m
[32m+[m			[32mwidth:4%;[m
[32m+[m			[32mposition:fixed;[m
[32m+[m			[32mtop:32.5%;[m
[32m+[m			[32mleft:50%;[m
[32m+[m			[32mmargin-left:auto;[m
[32m+[m			[32mmargin-right:auto;[m
[32m+[m			[32mleft:0;[m
[32m+[m			[32mright:0;[m
 		}[m
[31m-[m
 		h2{[m
[31m-			color: white [m
[32m+[m			[32mcolor: white;[m[41m [m
 			font-size:40px;[m
 			text-align: center;[m
[31m-	[m
[32m+[m			[32mposition:fixed;[m
[32m+[m			[32mtop:18%;[m
[32m+[m			[32mwidth:100%;[m
[32m+[m			[32mleft:0%;[m
 		}[m
 		p{[m
 			display: inline;[m
[31m-			color: white [m
[32m+[m			[32mcolor: white;[m
[32m+[m		[32m}[m
[32m+[m		[32ma{[m
[32m+[m			[32mtext-align: center;[m
[32m+[m			[32mposition:fixed;[m
[32m+[m			[32mtop: 70%;[m
[32m+[m			[32mwidth:100%;[m
[32m+[m			[32mleft:0%;[m
[32m+[m			[32mcolor: white;[m
[32m+[m			[32mfont-style:italic;[m
[32m+[m			[32mtext-decoration:none;[m
 		}[m
 	</style>[m
 [m
[36m@@ -32,25 +74,26 @@[m
 [m
 [m
 <body>[m
[31m-[m
 	<div class="a" style="background-color: #0e47a1">[m
[31m-		<h6>IEP Goal Tracker</h6>[m
 [m
 	</div>[m
[31m-[m
[31m-	<center>[m
[32m+[m	[32m<div class="a">IEP Goal Tracker</div>[m
[32m+[m		[32m<center>[m
 		<h2>LOGIN</h2>[m
[31m-	<form action="/action_page.php">[m
[31m-  <p>Login:</p>[m
[31m-  <input type="text" name="Login" >[m
[31m-  <br><br>[m
[31m-  <p>Password</p>[m
[31m-  <input type="text" name="Password" >[m
[31m-  <br><br>[m
[31m-  <input type="submit" value="Sign In">[m
[31m-  <a href="classPage.html" class="button">Next Page</a>[m
[31m-[m
[31m-</form> </center>[m
[32m+[m		[32m<img class="c" src="img/isdclipboard2.png" alt="clipboard Image Logo">[m
[32m+[m		[32m<form action="actionpage.html"><!--this will need to be changed eventually-->[m
[32m+[m[41m  [m			[32m<p>Login:</p>[m
[32m+[m[41m  [m			[32m<input type="text" name="Login">[m
[32m+[m[41m  [m				[32m<br><br>[m
[32m+[m[41m  [m			[32m<p>Password</p>[m
[32m+[m[41m  [m			[32m<input type="text" name="Password">[m
[32m+[m[41m  [m				[32m<br><br>[m
[32m+[m[41m  [m			[32m<input type="submit" value="Sign In">[m
[32m+[m[41m  [m		[32m</form>[m
[32m+[m[41m  [m		[32m<div class="b">[m
[32m+[m[41m  [m			[32m<a href="google.com">Forgot Your Password</a>[m
[32m+[m[41m  [m		[32m</div>[m
 [m
[32m+[m		[32m</center>[m
 </body>[m
[31m-</html>[m
[32m+[m[32m</html>[m
\ No newline at end of file[m
[1mdiff --git a/newgoal.html b/newgoal.html[m
[1mindex f9840f2..c927227 100644[m
[1m--- a/newgoal.html[m
[1m+++ b/newgoal.html[m
[36m@@ -1,26 +1,36 @@[m
 <!DOCTYPE html>[m
 <html>[m
[32m+[m[32m<style>[m
[32m+[m[32mbody {[m
[32m+[m	[32mbackground-color: #0e47a1;[m
[32m+[m	[32mcolor: white;[m
[32m+[m	[32mpadding-left: 30%;[m
[32m+[m[32m}[m
[32m+[m[32mh1 {[m
[32m+[m	[32mpadding-left:20%;[m
[32m+[m[32m}[m
[32m+[m[32m</style>[m
 <body>[m
[31m-[m
 <h1>Create New Goal</h1>[m
[31m-[m
[31m-<form action="">[m
[31m-Goal Title: <input type="text" name="title"><br>[m
[31m-Goal Description: <input type="text" name="description"><br>[m
[32m+[m[32m<form action="actionpage.html">[m
[32m+[m[32mGoal Title: <input type="text" name="title"><br><br>[m
[32m+[m[32mGoal Description: <input type="text" name="description"><br><br>[m
 Start Date: <input type="text" name="startdate">[m
[31m-End Date: <input type="text" name="enddate"><br>[m
[31m-Location: <input type="radio" name="location" value="classroom"> Classroom[m
[31m-<input type="radio" name="location" value="dorm"> Dorm[m
[31m-<input type="radio" name="location" value="other"> Other<br>[m
[31m-Method: <input type="checkbox" name="method" value="Checkbox"> Checkbox[m
[31m-<input type="checkbox" name="method" value="Rubric"> Rubric[m
[31m-<input type="checkbox" name="method" value="Counter"> Counter[m
[31m-<input type="checkbox" name="method" value="Comments"> Comments<br>[m
[31m-<input type="submit" name="Submit">[m
[32m+[m[32mEnd Date: <input type="text" name="enddate"><br><br>[m
[32m+[m[32mLocation: <br>[m
[32m+[m	[32m<input type="radio" name="location" value="classroom"> Classroom<br>[m
[32m+[m	[32m<input type="radio" name="location" value="dorm"> Dorm<br>[m
[32m+[m	[32m<input type="radio" name="location" value="other"> Other<br>[m
[32m+[m[32mMethod: <br>[m
[32m+[m	[32m<input type="checkbox" name="method" value="Checkbox"> Checkbox<br>[m
[32m+[m	[32m<input type="checkbox" name="method" value="Rubric"> Rubric<br>[m
[32m+[m	[32m<input type="checkbox" name="method" value="Counter"> Counter<br>[m
[32m+[m	[32m<input type="checkbox" name="method" value="Comments"> Comments<br>[m
[32m+[m	[32m<input type="submit" name="Submit">[m
 </form>[m
 [m
 [m
[31m-<button type="button"><a href="index.html" target="_self">Start over</a></button>[m
[32m+[m[32m<button type="button"><a href="login.html">Start over</a></button>[m
 [m
 </body>[m
 </html>[m
\ No newline at end of file[m
