const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const Kafka = require('no-kafka');
const fs = require('fs');

fs.writeFileSync('./client.crt', process.env.KAFKA_CLIENT_CERT);
fs.writeFileSync('./client.key', process.env.KAFKA_CLIENT_CERT_KEY);

const consumer = new Kafka.SimpleConsumer({
    connectionString: process.env.KAFKA_URL,
    ssl: {
      certFile: './client.crt',
      keyFile: './client.key',
    },
});

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use('/', (req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

function callSockets(io, message){
  io.sockets.emit('update', message);
}

const dataHandler = function(messageSet, topic, partition){
    messageSet.forEach(function(m){
        //do stuff
        console.log(topic, partition, m.offset, m.message.value.toString('utf8'));
        callSockets(io, m.message.value.toString('utf8'));
    });
};
return consumer.init().then(function(){
    return consumer.subscribe(`${process.env.KAFKA_PREFIX}caseActivity`, [0,1], dataHandler);
})
