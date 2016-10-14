var mysql = require('mysql');
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);


var connection = mysql.createConnection({
  host     : '140.114.71.114',
  user     : 'mashroom',
  password : 'KHf7f2vxJPAUY2jR',
  database : 'earthworm'
});

connection.connect();
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

server.listen(8080);
app.use('/static', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/socket.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});



//
// var server = http.createServer(function(request, response) {
//   console.log('Connection');
//   console.log(__dirname);
//   var path = url.parse(request.url).pathname;
//
//   switch (path) {
//     case '/':
//       response.writeHead(200, {'Content-Type': 'text/html'});
//       response.write('Hello, World.');
//       response.end();
//       break;
//     case '/socket.html':
//       fs.readFile(__dirname + path, function(error, data) {
//         if (error){
//           response.writeHead(404);
//           response.write("opps this doesn't exist - 404");
//         } else {
//           response.writeHead(200, {"Content-Type": "text/html"});
//           response.write(data, "utf8");
//         }
//         response.end();
//       });
//       break;
//     default:
//       response.writeHead(404);
//       response.write("opps this doesn't exist - 404");
//       response.end();
//       break;
//   }
// });
// server.listen(8001);
//
// var serv_io = io.listen(server);
//
// serv_io.sockets.on('connection', function(socket) {
//   // 傳送時間訊息給瀏覽器
//   setInterval(function() {
//     socket.emit('date', {'date': new Date()});
//   }, 1000);
// });
