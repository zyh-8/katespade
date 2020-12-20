<?php
    // 获取传递过来的用名 和 商品id
    $tel = $_GET['tel'];
    $goods_id = $_GET['goods_id'];


    $con = mysqli_connect('localhost','root','123456','katespade');

    $sql = "DELETE FROM `car` WHERE `car`.`goods_id` = '$goods_id' AND `tel` = '$tel'";

    $res = mysqli_query($con,$sql);

    if(!$res){
        $arr =array("code"=>false,"msg"=>"删除数据失败");
        print_r(json_encode($arr,JSON_UNESCAPED_UNICODE));  
    }else{
        $arr =array("code"=>$res,"msg"=>"删除数据成功");
        print_r(json_encode($arr,JSON_UNESCAPED_UNICODE));  
    }
?>