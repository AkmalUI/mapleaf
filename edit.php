<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test";

$conn = new mysqli($servername, $username, $password, $dbname);
$lat = $_POST["lat"];
$lon = $_POST["lon"];
$nama = $_POST["nama"];
$newname = $_POST["namabaru"];

$sql = "UPDATE aws SET nama = '$newname', lat = '$lat', lon = '$lon' WHERE nama LIKE '$nama'";
$conn->query($sql);
$conn->close();
