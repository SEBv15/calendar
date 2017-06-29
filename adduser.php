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
  $ret = $db->exec("INSERT INTO users (name) VALUES ('".$_REQUEST["name"]."')");
  if(!$ret){
     echo $db->lastErrorMsg();
  } else {
    // echo "Records created successfully\n";
  }
  echo $db->lastInsertRowid();
  $db->close();
?>
