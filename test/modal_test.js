describe('opening a modal', function(){
  this.timeout(30000);

  var firstIframeTagText = function(tagname){
    return document.querySelector('.modal-content iframe').contentDocument
      .getElementsByTagName(tagname)[0].innerText;
  };
  
  it('should open the modal to the homepage', function(done){
    nightmare
      .click('.overlay.all')
      .wait('.modal-visible')
      .evaluate(firstIframeTagText, function(text){
        expect(text).to.equal('Content goes here')
      }, 'p')
      .run(done);
  });

  it('should display coverage information and navigate to plan on click', function(done){
    nightmare
      .wait('.planDetails')
      .evaluate(function(){
        return document.querySelectorAll('.planDetails')[1]
          .getElementsByTagName('li')[0].innerText
      }, function(text){
        expect(text).to.equal('Doctors: 4 of 6')
      })
      .click('[data-plan-id="123456"] div.planDetails a')
      .wait('.modal-visible')
      .evaluate(firstIframeTagText, function(text){
        expect(text).to.include('Plan ID: 123456')
      }, 'p')
      .run(done);
  });

  it('should display overlay rollup and provide navigate to sections on click', function(done){
    nightmare
      .wait('.overlayDetails')
      .evaluate(function(){
        return document.querySelector('.overlayDetails')
          .getElementsByTagName('li')[0].innerText
      }, function(text){
        expect(text).to.include('Doctors: 6')
      })
      .click('.overlayDetails li a')
      .wait('.modal-visible')
      .evaluate(firstIframeTagText, function(text){
        expect(text).to.include('Doctors')
      }, 'h3')
      .run(done)
  });
});
