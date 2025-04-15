const http = require('http');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test"
});

con.connect(function(err){
  if (err) throw err;
});

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  var marker = "SELECT lat, lon FROM point WHERE id like 1";

  let data = '';
  con.query(marker, function(result) {
    result.forEach(row => {
      const lat = row.lat;
      const lon = row.lon; 
      data += '${lat},${lon}\n';
    });
    res.end(responseData);
  });
});

const PORT = 3030;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});