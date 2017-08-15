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

router.use(function(req, res, next) {
    console.log('Logging request event...');
    next();
});

router.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname + '/client/index.html'));
    serverWorkerOne.receive();
    serverWorkerTwo.receive();
});

router.route('/send')
    .post(function(req, res) {
        console.log(req.body);
        res.json({message: 'Object received...'});
        serverSend.connect(req.body.message);
    });

io.on('connection', function(socket) {
   console.log('Connection established');
});

app.use('/api', router);

app.listen(port);
console.log('Delivering to port ' + port);
