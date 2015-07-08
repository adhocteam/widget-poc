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
var iFrame = '.modal-content iframe';
describe('opening a modal', function(){
  this.timeout(30000);

  it('should open the modal', function(done){
    new Nightmare()
      .goto(url)
      .click('.overlay.all')
      .wait('.modal-visible')
      .evaluate(function(iFrame){
        return document.querySelector(iFrame).contentDocument
          .getElementsByTagName('p')[0]
          .innerText
      }, function(text){
        expect(text).to.equal('Content goes here')
      }, iFrame).run(done);
  });

  it('should display coverage information', function(done){
    new Nightmare()
      .goto(url)
      .wait('.planDetails')
      .evaluate(function(){
        return document.querySelectorAll('.planDetails')[1]
          .getElementsByTagName('li')[0].innerText
      }, function(text){
        expect(text).to.equal('Doctors: 4 of 6')
      })
      .click('[data-plan-id="123456"] div.planDetails a')
      .wait('.modal-visible')
      .evaluate(function(iFrame){
        return document.querySelector(iFrame).contentDocument
          .getElementsByTagName('div')[0].innerText
      }, function(text){
        expect(text).to.include('"planID":"123456"')
      }, iFrame)
      .run(done);
  });

  it('should display overlay rollup and provide navigation instructions on click', function(done){
    new Nightmare()
      .goto(url)
      .wait('.overlayDetails')
      .evaluate(function(){
        return document.querySelector('.overlayDetails')
          .getElementsByTagName('li')[0].innerText
      }, function(text){
        expect(text).to.include('Doctors: 6')
      })
      .click('.overlayDetails li a')
      .wait('.modal-visible')
      .evaluate(function(iFrame){
        return document.querySelector(iFrame).contentDocument
          .getElementsByTagName('div')[0].innerText
      }, function(text){
        expect(text).to.include('"section":"doctors"')
      }, iFrame)
      .run(done)
  });
});
