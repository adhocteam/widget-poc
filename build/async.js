// IE polyfill
var wl = window.location;
if (!wl.origin) {
  wl.origin = wl.protocol + "//" + wl.hostname + (wl.port ? ':' + wl.port: '');
}

window.EmbedPOC.bindBehavior = function(){
  var body = document.body;
  var forEach = Array.prototype.forEach;
  
  var iFrame = '<iframe aria-live="polite" src="embed.html"></iframe>';
  
  var clickHandler = function(attribute, modal) {
    return function(event){
      var target = event.target;
      if (target.getAttribute(attribute)) {
        var planID = target.getAttribute('data-plan-id');
        var section = target.getAttribute('data-section');
        modal.lastFocus = target;
        modal.open({planID: planID, section: section});
        
      }
    }
  };

  var notifyPlans = function(sendFunc){
    var blocks = body.querySelectorAll('[data-my-coverage]');
    forEach.call(blocks, function(block){
      sendFunc.call(null, {
        planID: block.getAttribute('data-plan-id'),
        fips: block.getAttribute('data-fips-code'),
        zip: block.getAttribute('data-zip-code')
      });
    });
  }

  var updatePlans = function(data){
    for (var planID in data){
      var block = body.querySelector('[data-plan-id="'+planID+'"]');
      if (block){
        block.innerHTML = data[planID];
      }
    }
  }
  
  var messageHandler = function(modal){
    return function(event){
      if (event.origin != window.location.origin) return;
      try {
        var payload = JSON.parse(event.data);
      } catch(err) {
        return;
      }
      var replyWith = function(payload){
        event.source.postMessage(JSON.stringify(payload), window.location.origin);
      }
      
      if (payload.init){
        notifyPlans(replyWith);
        notifyModal(modal, replyWith);
      } else if (payload.planData){
        updatePlans(payload.planData);
      } else if (payload.overlayContent){
        addOverlay(payload.overlayContent);
      }
    };
  };

  var notifyModal = function(modal, replyFunc){
    modal.dispatchFunc = replyFunc
  }
  
  var buildModal = function(){

    var modal = {
      setAttribute: function(attrName, value){
        this.attributes[attrName] = value;
      },
      close: function(){
        this.container.className = 'modal-container';
        if (this.lastFocus){
          this.lastFocus.focus();
          this.lastFocus = null;
        }
      },
      open: function(params){
        this.container.querySelector('iframe').contentWindow.focus();
        this.container.className = 'modal-container modal-visible';
        this.send({routeTo: params});
      },
      send: function(payload){
        if (this.dispatchFunc){
          this.dispatchFunc.call(null, payload);
        }
      }
    };
    
    modal.attributes = {};
    modal.container = document.createElement('div');
    modal.container.className = 'modal-container';
    
    var buildModalBox = function(){
      var modalBox = document.createElement('div');
      modalBox.className = 'modal';
      modalBox.setAttribute('role','dialog');
      modalBox.setAttribute('aria-labelledby', 'iFrame');
      modalBox.innerHTML = '<div class="modal-inner"><a href="javascript:" rel="modal:close" aria-label="Close" class="close">&times;</a><div class="modal-content"></div></div>';
      modalBox.querySelector('.modal-content').innerHTML = iFrame;
      return modalBox;
    };

    modal.container.appendChild(buildModalBox());
    
    var bindBehaviors = function(modal){
      var modalBox = modal.container.querySelector('.modal');
      var inner = modalBox.querySelector('.modal-inner');
      inner.tabIndex = '0';
      
      inner.addEventListener('keyup', function(event){
        if (event.keyCode == 27){
          modal.close();
        }
      }, false);
      
      modalBox.addEventListener("click", function(){
        modal.close();
      }, false);
      
      inner.addEventListener("click", function(event){
        if (event.target.getAttribute('rel') == 'modal:close') return;
        event.stopPropagation();
        event.preventDefault();
      }, false);
    };
    
    bindBehaviors(modal);
    return modal;
  };

  // Only build this sucker once we have content for it.
  // After that, reuse the node.
  var addOverlay = function(content){
    var overlay = document.getElementsByClassName('widgetOverlay')[0];
    if (!overlay){
      var box = document.createElement('div');
      box.className = 'widgetOverlay';
      body.appendChild(box);
      overlay = box;
    }
    overlay.innerHTML = content;
  }
  
  var modal = buildModal();
  body.appendChild(modal.container);
  body.addEventListener('click', clickHandler('data-modal', modal));

  window.addEventListener("message", messageHandler(modal), false);
  
};
