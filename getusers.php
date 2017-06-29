<?php
$db_loc = "db.db";

  error_reporting(E_ALL);
  class MyDB extends SQLite3
  {
    function __construct($db_loc)
    {
       $this->open($db_loc);
    }
  }
  $db = new MyDB($db_loc);
  if(!$db){
    echo $db->lastErrorMsg();
  } else {
    //echo "Opened database successfully\n";
  }

  $ret = $db->query("SELECT * FROM users");
  //var_dump($ret);
  $all = [];
  while($row = $ret->fetchArray(SQLITE3_ASSOC) ){
    $one = array();
    //var_dump($row);
     //$one = Array($row["type"],$row["comment"],$row["offfrom"],$row["offto"]);
     array_push($one,$row["id"],$row["name"]);
    // print_r($one);
     array_push($all,$one);

  }
  //print_r($all);
  echo json_encode($all);
  //echo "Operation done successfully\n";
  $db->close();
?>
