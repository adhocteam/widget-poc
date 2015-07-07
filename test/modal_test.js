var Nightmare = require('nightmare');
var expect = require('chai').expect;

var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic("./");
var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

server.listen(8357);

var url = "http://localhost:8357"

describe('opening a modal', function(){
  this.timeout(30000);

  it('should open the modal', function(done){
    new Nightmare()
      .goto(url)
      .click('.overlay.all')
      .wait('.modal-content')
      .evaluate(function(){
        return document.querySelector('.modal-content')
          .getElementsByTagName('iframe')[0]
          .contentDocument
          .getElementsByTagName('p')[0]
          .innerText
      }, function(text){
        expect(text).to.equal('Content goes here')
      }).run(done);
  });

  it('should display coverage information', function(done){
    new Nightmare()
      .goto(url)
      .wait('.planDetails')
      .screenshot('screen.jpg')
      .evaluate(function(){
        return document.querySelectorAll('.planDetails')[1]
          .getElementsByTagName('li')[0].innerText
      }, function(text){
        expect(text).to.equal('Doctors: 6 of 6')
      }).run(done)
  })
});
