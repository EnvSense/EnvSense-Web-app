var mysql = require('mysql');
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var moment = require('moment');

/* Socket Configuration */
updateInterval = 1000;
CEHCK_TIME_CNT = 10;


/* Database Configuration */
var preFetchRow = {};
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'mashroom',
    password: 'KHf7f2vxJPAUY2jR',
    database: 'earthworm'
});
connection.connect();


// Query Todat Env. Data
var todayData = null;
connection.query('SELECT * FROM `env_data` WHERE DATE(`datetime`) = "2016-10-16"', function(err, rows, fields) {
    if (err) throw err;
    console.log('row length', rows.length);
    todayData = rows;
    // console.log(todayData);
});



// Check if lastest data is equal previous one or not



// Server Routing Settings
server.listen(16888);
app.use('/static', express.static(__dirname + '/public'));
app.get('/', function(req, res) {

    res.sendFile(__dirname + '/socket.html');
    // res.type('application/json');
    // res.json(todayData);
});
app.post('/todaydata', function(req, res) {
    res.type('application/json');
    res.json(todayData);
});

/* Socket Handling */
io.on('connection', function(socket) {
    console.log('hello socket');


    var updateCount = CEHCK_TIME_CNT;
    setInterval(function() {

        // console.log('socket_id: ', socket.id);
        var emitData = {};

        // Every 60 sec check database exist a new data or not
        if (updateCount === 0) {

            // console.log('update event');
            // console.log(updateCount);
            updateCount = CEHCK_TIME_CNT;

            // Query Last Row of Env. data
            connection.query('SELECT * FROM `env_data` ORDER BY `id` DESC LIMIT 1', function(err, rows, fields) {
                if (err) throw err;

                console.log('in preFetchRow');
                if (preFetchRow.id !== rows[0].id) {
                    preFetchRow = rows[0];
                    emitData.newData = rows[0];
                    console.log('last data', rows[0]);
                } else {
                    console.log('no new data in database');
                    emitData.newData = null;
                }

            });
            emitData.updateCount = updateCount;
            emitData.lastUpdateTime = moment().format('MMMM Do YYYY, h:mm:ss a');


        // Continously increase updateCount
        } else {
            updateCount = updateCount - 1;
            emitData.updateCount = updateCount;
            // console.log('updateCount', updateCount);
        }
        socket.emit('serverTime', emitData);
    }, updateInterval);


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
