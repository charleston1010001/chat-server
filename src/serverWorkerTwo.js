var amqp = require('amqplib/callback_api');

exports.receive = function(queue, io) {
    amqp.connect('amqp://miiqmbnn:roP_yX7c5aAKIaGGOEpbJnzjJVr6JjnA@swan.rmq.cloudamqp.com/miiqmbnn', function(err, conn) {
        conn.createChannel(function(err, ch) {
            ch.assertQueue(queue, {durable: true});
            ch.prefetch(1);
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
            ch.consume(queue, function(msg) {
                var secs = msg.content.toString().split('.').length - 1;

                console.log(" [x] Received %s", msg.content.toString());
                io.sockets.in(queue)
                    .emit('receiveUserMessage', msg.content.toString());
                setTimeout(function() {
                    console.log(" [x] Done on Worker 2");
                    ch.ack(msg);
                }, secs * 1000);
            }, {noAck: false});
        });
    });
};
