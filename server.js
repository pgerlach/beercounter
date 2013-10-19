var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var beercount = 0;

var wss = new WebSocketServer({server: server});
console.log('websocket server created');

var clients = [];

wss.on('connection', function(ws) {

  console.log(ws);
    clients.push(ws);

    // var id = setInterval(function() {
    //     ws.send(JSON.stringify(new Date()), function() {  });
    // }, 1000);

    console.log('websocket connection open');

    ws.on('close', function() {
        console.log('websocket connection close');
        clearInterval(id);
        // TODO remove from clients
    });
});

app.get("/newbeer", function(req, resp) {
  beercount++;
  for (i in clients) {
    ws = clients[i];
    console.log(ws);
    ws.send(JSON.stringify(beercount), function() {  });
  }
  resp.send("" + beercount);
});
