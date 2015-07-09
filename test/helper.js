var startServer = function(){
  var http = require('http');

  var finalhandler = require('finalhandler');
  var serveStatic = require('serve-static');

  var serve = serveStatic("./");
  var server = http.createServer(function(req, res) {
    var done = finalhandler(req, res);
    serve(req, res, done);
  });

  server.listen(8357);

}

before(function(){

  Nightmare = require('nightmare');
  expect = require('chai').expect;

  startServer();
  
});
var url = "http://localhost:8357?fixtures=true";
beforeEach(function(){
  nightmare = new Nightmare;
  nightmare.goto(url);
})


