const events = require('events');
const net = require('net');
const channel = new events.EventEmitter();

channel.clients = {};
channel.subscriptions = {};
channel.on('join', function(id, client) {
  this.clients[id] = client;
  this.subscriptions[id] = (senderId, message) => {
    if (id != senderId) {
      this.clients[id].write(message);
    }
  };
  this.on('broadcast', this.subscriptions[id]);
});

const server = net.createServer( client => {
  const id = `${client.remoteAddress}:${client.remotePort}`;
  greetings(client);
  client.write('Choose your username: ');
  client.on('data', data => {
    if(client.username === undefined){
      client.username = data.toString().replace(/(\r\n|\n|\r)/gm,"");
      channel.emit('join', id, client);
    }else{
      data = client.username + ": " + data.toString();
      channel.emit('broadcast', id, data);
    }
  });
});

server.listen(8888);

const greetings = (client) => {
  client.write('Hi!\n');
  client.write('Welcome to guess who chat!\n');
}