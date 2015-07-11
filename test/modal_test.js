describe('opening a modal', function(){
  this.timeout(30000);

  var firstIframeTagText = function(tagname){
    return document.querySelector('.modal-content iframe').contentDocument
      .getElementsByTagName(tagname)[0].innerText;
  };
  
  it('should display coverage information and navigate to plan on click', function(done){
    horseman.waitForSelector('.planDetails');
    var text = horseman.evaluate(function(){
      return $('.planDetails')[1].getElementsByTagName('li')[0].innerText
    })
    expect(text).to.equal('Doctors: 4 of 6')
    horseman.click('[data-plan-id="123456"] div.planDetails a')
    horseman.waitForSelector('.modal-visible')
      .switchToChildFrame(0)
    expect(horseman.text('h3')).to.include('Plan ID: 123456')
    
    done();
  });

  it('should display overlay rollup', function(done){
    horseman.waitForSelector('.overlayDetails')
    var text = horseman.evaluate(function(){
      return $('.overlayDetails li')[0].innerText
    })
    expect(text).to.include('Doctors: 6')
    done();
  });

  describe('having opened management list', function(){
    beforeEach(function(){
      nightmare.wait('.overlayDetails')
        .click('.overlayDetails a')
        .wait('.modal-visible')
    })

    it('should show doctors', function(done){
      nightmare
        .evaluate(firstIframeTagText, function(text){
          expect(text).to.include('Doctors')
        }, 'h3')
        .run(done)
    })

    xit('should remove a facilitity', function(done){
      nightmare
        .evaluate(function(){
          this.page.switchToChildFrame(0);
        })
        .click('.facilities-list li a')
        .evaluate(function(){
          return document.querySelector('facilities-page').innerText
        
        }, function(text){
          expect(text).to.include('No facilities added')
        })
        .screenshot('screen.png')
        .run(done)
    })
    
  })
});
