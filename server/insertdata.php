<?php
    require('./db_connect.php');
    
    $E_Name = $_POST["E_Name"];
    $E_Type = $_POST["E_Type"];
    $E_Diff = $_POST["E_Diff"];

    $sql = "INSERT INTO numer (E_Name,E_Type,E_Diff) VALUES ('$E_Name','$E_Type','$E_Diff');";
    echo $sql;

  if($connect->query($sql) === TRUE){
        $check = array(1 => "success");
        echo json_encode($check);
  }
  else {
        $check = array(1 => "fail");
        echo json_encode($check);
  }

  $connect->close();

 ?>