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
  $sql =<<<EOF
     INSERT INTO off (uid,uname,from,to,comment,type)
     VALUES ($_REQUEST[uid], $_REQUEST[uname],$_REQUEST[start],$_REQUEST[end],$_REQUEST[comment],$_REQUEST[type] );
EOF;

  //$ret = $db->exec($sql);
  $ret = $db->exec("INSERT INTO off (uid,uname,offfrom,offto,comment,type) VALUES (".$_REQUEST["uid"].",'". $_REQUEST["uname"]."',".$_REQUEST["start"].",".$_REQUEST["end"].",'".$_REQUEST["comment"]."','".$_REQUEST["type"]."' )");
  if(!$ret){
     echo $db->lastErrorMsg();
  } else {
    // echo "Records created successfully\n";
  }
  echo $db->lastInsertRowid();
  $db->close();
?>
