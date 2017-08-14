#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://miiqmbnn:roP_yX7c5aAKIaGGOEpbJnzjJVr6JjnA@swan.rmq.cloudamqp.com/miiqmbnn', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = 'task_queue';

        ch.assertQueue(q, {durable: false});
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {noAck: true});
    });
});