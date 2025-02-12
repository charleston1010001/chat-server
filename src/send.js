#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://miiqmbnn:roP_yX7c5aAKIaGGOEpbJnzjJVr6JjnA@swan.rmq.cloudamqp.com/miiqmbnn', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = 'task_queue';
        var msg = process.argv.slice(2).join(' ') || "Hello World!";

        ch.assertQueue(q, {durable: true});
        // Note: on Node 6 Buffer.from(msg) should be used
        ch.sendToQueue(q, new Buffer(msg), {persistent: true});
        console.log(" [x] Sent %s", msg);
    });
    setTimeout(function() { conn.close(); process.exit(0) }, 500);
});