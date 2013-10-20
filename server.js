var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000
  , mongoose = require("mongoose");

app.use(express.static(__dirname + '/'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var mongourl = process.env.MONGOHQ_URL;
mongoose.connect(mongourl, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + mongourl + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + mongourl);
  }
});

var beerSchema = new mongoose.Schema({
  date: Date
});
var Beer = mongoose.model('beers', beerSchema);


var beercount = 0;

var wss = new WebSocketServer({server: server});
console.log('websocket server created');

var clients = [];

wss.on('connection', function(ws) {

  console.log(ws);
  clients.push(ws);

  console.log('websocket connection open');

  Beer.count(function(err, count) {
    if (err) {
      console.log ('Error on count!');
      return ;
    }
    ws.send(JSON.stringify(count), function() {  });
  });

    ws.on('close', function() {
      console.log('websocket connection close');
      for (i in clients) {
        if (clients[i] == ws) {
          clients.splice(i, 1);
          return ;
        }
      }
    });
});

app.get("/newbeer", function(req, resp) {

  console.log("one new beer !");

  var newBeer = new Beer({ date: new Date()});
  newBeer.save(function (err) {
    if (err) console.log ('Error on save!')
  });
  Beer.count(function(err, count) {
    if (err) {
      console.log ('Error on count!');
      return ;
    }
    console.log("count from db: ", count);
    for (i in clients) {
      ws = clients[i];
      ws.send(JSON.stringify(count+1), function() {  });
    }
  });
  resp.send("" + beercount);
});
