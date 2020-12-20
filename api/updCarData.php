<?php
    $tel= $_GET['tel'];
    $goods_id = $_GET['goods_id'];
    $goods_num = $_GET['goods_num'];

    // $username = '婧婧';
    // $goods_id = 5;
    // $goods_num = 7;
    $con = mysqli_connect('localhost','root','123456','katespade');

    $sql = "UPDATE `car` SET `goods_num` = '$goods_num' WHERE `goods_id` = '$goods_id' AND `tel` = '$tel'";

    $res = mysqli_query($con,$sql);

    if(!$res){
        $arr =array("code"=>0,"msg"=>"修改数据失败");
        print_r(json_encode($arr,JSON_UNESCAPED_UNICODE));
   
    }else{
        $arr =array("code"=>$res,"msg"=>"修改数据成功");
        print_r(json_encode($arr,JSON_UNESCAPED_UNICODE));
    }
?>