<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test";

$conn = new mysqli($servername, $username, $password, $dbname);
$sql = "SELECT * FROM aws";
$result = $conn->query($sql);

$rows = array();
while ($row = $result->fetch_assoc()) {
    $rows[] = array(
        'id' => $row['id'],
        'nama' => $row['nama'],
        'lat' => $row['lat'],
        'lon' => $row['lon'],
        'suhu' => $row['suhu'],
        'kelembapan' => $row['kelembapan'],
        'keterangan' => $row['Keterangan']
    );
}
header('Content-Type: application/json');
echo json_encode($rows);

$result->close();
$conn->close();