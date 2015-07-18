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
    expect(horseman.count('coverage-set li')).to.equal(13)
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
      horseman.waitForSelector('.overlayDetails')
        .click('.overlayDetails a')
        .waitForSelector('.modal-visible')
        .switchToChildFrame(0)
    })
    
    it('should show doctors', function(done){
      expect(horseman.text('h3')).to.include('Doctors')
      done();
    })

    it('should remove a facilitity', function(done){
      horseman.click('.facilities-list li a')
      expect(horseman.text('facilities-page')).to.include('No facilities added')
      done();
    })

    describe('having removed a facility', function(){
      beforeEach(function(){
        horseman.click('.facilities-list li a')
        horseman.click('a[rel="modal:close"]')
        horseman.page.switchToParentFrame()
      })

      it('should no longer be in the rollup', function(done){
        var text = horseman.evaluate(function(){
          return $('.planDetails')[1].getElementsByTagName('li')[2].innerText
        })
        expect(text).to.include('0 of 0')
        done();
      })

      it('should not have a facility block in the plan details', function(done){
        horseman.click('[data-plan-id="123456"] div.planDetails a')
        horseman.waitForSelector('.modal-visible')
          .switchToChildFrame(0)
        expect(horseman.count('h4')).to.equal(2)
        done();
      })
    })

    describe('Searching for stuff', function(){
      beforeEach(function(){
        horseman.page.onConsoleMessage = function(msg, lineNum, sourceId) {
          console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
        };
        horseman.injectJs('fixtures/inject.js');
      });
      it('should search and find a drug', function(done){
        horseman.click(".nav a")
          .type('input[name="query"]', 'flutic')
          .click("button").waitForSelector('search-panel').screenshot('screen.png')
        expect(horseman.count('.drugs li')).to.equal(1)
        done();
      });

      describe('having searched', function(){
        beforeEach(function(){
          horseman.click(".nav a")
            .type('input[name="query"]', 'flutic')
            .click("button").waitForSelector('search-panel')
        });

        it('should add a drug', function(done){
          horseman.click(".drugs a")
            .click('a[rel="modal:close"]');
          horseman.page.switchToParentFrame();
          var text = horseman.evaluate(function(){
            return $('.planDetails')[1].getElementsByTagName('li')[1].innerText
          })
          expect(text).to.equal('Prescriptions: 3 of 4')
          done();
        });
        
      });

    });
    
  })
});
