<?php
ini_set('display_errors',1);

//###
//### Ajax以外からのアクセスを遮断
//###
$request = isset($_SERVER['HTTP_X_REQUESTED_WITH']) ? strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) : '';
if($request !== 'xmlhttprequest') exit;

//###
//### gameData から JSON を取得
//###
$json = $_POST["gameData"];
$data = json_encode($json, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
echo $data;


//###
//### $_POST["saveMain"] が true の場合には main と temp 両方に保存
//###
if($_POST["saveMain"] == true){
  $file = '.' . $_POST["datapath"];
  $err = file_put_contents($file, $data);  
  exec("sed -i -e 's/\"\"/null/g' $file");

  $file = '../js/setting/temp.json';
  $err = file_put_contents($file, $data);
  exec("sed -i -e 's/\"\"/null/g' $file");
  echo $err;
  }
//###
//### $_POST["saveMain"] が false の場合には temp のみに保存
//###
else{
  $file = '../js/setting/temp.json';
  $err = file_put_contents($file, $data);
  exec("sed -i -e 's/\"\"/null/g' $file");
  echo $err;
  }
echo "test";
?>
