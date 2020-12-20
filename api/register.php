<?php
    // 接收传过来的电话号码和密码 
    $telval = $_POST['telval'];
    $pswval = $_POST['pswval'];

    $con = mysqli_connect('localhost','root','123456','katespade');
    // 先查询该user数据表中是否存在该用户
    $sql = "SELECT * FROM `user` WHERE `tel`='$telval'";

    $res = mysqli_query($con,$sql);
    
    if(!$res){
        die("数据库出错".mysqli_error($con));
    }

    $row = mysqli_fetch_assoc($res);

     // 如果user表中存在该用户
     if($row){

        $arr =array("code"=>0,"msg"=>"该用户已经存在");

        print_r(json_encode($arr,JSON_UNESCAPED_UNICODE));  

     }else{
        # 如果不存在，就往user表中 添加 用户
        // 整个SQL语句用双引号，变量用单引号
        $res2= mysqli_query($con,"INSERT INTO `user` (`tel`, `password`) VALUES ('$telval', '$pswval')");
     };
     if($res2){
         $arr =array("code"=>1,"msg"=>"注册成功");
         print_r(json_encode($arr,JSON_UNESCAPED_UNICODE));  
        // // 跳转登录页面
        // header("Location:../html/login.html");
     };
?>