var amqp = require('amqplib/callback_api');

exports.connect = function(msg, queue) {
    amqp.connect('amqp://miiqmbnn:roP_yX7c5aAKIaGGOEpbJnzjJVr6JjnA@swan.rmq.cloudamqp.com/miiqmbnn', function(err, conn) {
        conn.createChannel(function(err, ch) {
            ch.assertQueue(queue, {durable: true});
            // Note: on Node 6 Buffer.from(msg) should be used
            ch.sendToQueue(queue, new Buffer(msg), {persistent: true});
            console.log(" [x] Sent %s", msg);
        });
        // setTimeout(function() { conn.close(); process.exit(0) }, 500);
    });
};
