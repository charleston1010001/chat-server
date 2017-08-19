var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var path = require('path');
var helmet = require('helmet');
var serverSend = require('./serverSend');
var serverWorkerOne = require('./serverWorkerOne');
var serverWorkerTwo = require('./serverWorkerTwo');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(helmet());
app.disable('x-powered-by');

var port = process.env.PORT || 8080;

var router = express.Router();

var rooms = {};
var queues = {};

router.use(function(req, res, next) {
    console.log('Logging request event...');
    res.setHeader('Access-Control-Allow-Origin', 'http://charleston001.ddns.net:6850');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-COntrol-Allow-Credentials', true);
    next();
});

router.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

router.route('/send')
    .post(function(req, res) {
        console.log(req.body);
        res.json({message: 'Object received...'});
        serverSend.connect(req.body.message, req.body.receiver);
    });

io.on('connection', function(socket) {
   console.log('Socket connection established');

  socket.on('disconnect', function() {
    console.log('Socket disconnected');
  });

  socket.on('setPersonalRoom', function(data) {
      console.log('connecting to room');
      rooms[data.room] = data.room;
      queues[data.queue] = data.queue;
      socket.join(rooms[data.room]);
      io.sockets.in(rooms[data.room])
          .emit('sendToPersonalRoom', true);
      // io.sockets.in(rooms[data.room])
          // .emit('sendToPersonalRoom', 'Connected to personal room ' + data.room + ' and created queue ' + data.queue + '...');
      serverWorkerOne.receive(rooms[data.room], io);
      serverWorkerTwo.receive(rooms[data.room], io);
  })
});

app.use('/api', router);

http.listen(port);
console.log('Delivering to port ' + port);
