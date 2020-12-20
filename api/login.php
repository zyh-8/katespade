<?php
    $telval= $_POST['telval'];
    $pswval = $_POST['pswval'];
    $con = mysqli_connect('localhost','root','123456','katespade');
    // 整个SQL语句用双引号，变量用单引号
    // 判断是否存在该用用户
    $sql = "SELECT * FROM `user` WHERE `tel` = '$telval'";
    $res = mysqli_query($con,$sql);
    if(!$res){
        die("数据库出错".mysqli_error($con));
    }
    // 去获取数据的结果中解析第一条数据
    $row = mysqli_fetch_assoc($res);

    if(!$row){
        //登录失败,该用户不存在
        $arr =array("code"=>0,"msg"=>"该用户不存在");
        print_r(json_encode($arr,JSON_UNESCAPED_UNICODE));  
    }else{
        // 如果存在，匹配用户名和密码
        // 判断用户名和密码是否匹配
        $res2= mysqli_query($con,"SELECT * FROM `user` WHERE `password` = '$pswval'");
        if($res2){
        $arr =array("code"=>1,"msg"=>"登录成功");
        print_r(json_encode($arr,JSON_UNESCAPED_UNICODE));  
    }else{
        $arr =array("code"=>0,"msg"=>"用户名或密码错误");
        print_r(json_encode($arr,JSON_UNESCAPED_UNICODE));  
    };
    }; 

?>