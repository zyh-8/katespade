<?php
  $id = $_GET['id'];
  // $id = 6;

  $con = mysqli_connect('localhost','root','123456','katespade');
  //模糊查询
  $sql = "SELECT * FROM `goods` WHERE `goods_id`='$id'";

  $res = mysqli_query($con,$sql);

  $arr = array();

  if (!$res) {
    die('error for mysql: ' . mysqli_error());
  }
  $row = mysqli_fetch_assoc($res);
  
  while($row){
    array_push($arr,$row);
    $row = mysqli_fetch_assoc($res);
  }
  print_r(json_encode($arr,JSON_UNESCAPED_UNICODE));

?>
