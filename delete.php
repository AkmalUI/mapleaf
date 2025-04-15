<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test";

$conn = new mysqli($servername, $username, $password, $dbname);
$nama = $_POST["nama"];

$sql = "DELETE FROM aws WHERE nama like '$nama'";
$conn->query($sql);
$conn->close();
