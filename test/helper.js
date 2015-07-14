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

  Horseman = require('node-horseman');
  expect = require('chai').expect;
  
  startServer();
  
});
url = "http://localhost:8357?fixtures=true";
beforeEach(function(){
  horseman = new Horseman();
  horseman.viewport(1000,1000);
  horseman.open(url);
})
afterEach(function(){
  horseman.close();
});


