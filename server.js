var http = require('http'),
    server = http.createServer(),
    port = process.env.PORT || 8080,
    fi = require('finalhandler'),
    send = require('serve-static')('public');

server.on('request', function(req, res){
  var done = fi(req, res);
  send(req, res, done);
})

server.listen(port, function(){
  console.log('Server running..');
});
