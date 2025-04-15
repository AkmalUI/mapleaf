<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test";

$conn = new mysqli($servername, $username, $password, $dbname);
$lat = $_POST["latadd"];
$lon = $_POST["lonadd"];
$nama = $_POST["nama"];
$suhu = $_POST["suhu"];
$kelembapan = $_POST["kelembapan"];
$keterangan = $_POST["keterangan"];

$sql = "INSERT INTO aws (nama, lat, lon, suhu, kelembapan, keterangan) VALUES ('$nama', '$lat', '$lon', '$suhu', '$kelembapan', '$keterangan')";
$conn->query($sql);
$conn->close();
