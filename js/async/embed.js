if (!window.PlanCompareWidget) window.PlanCompareWidget = {};

window.PlanCompareWidget.init = function(){
  var body = document.body;
  var forEach = Array.prototype.forEach;
  var planIdAttr = 'data-plan-id';
  var iFrame = document.createElement('iframe');
  iFrame.src = 'embed.html';
  iFrame.setAttribute('aria-live', 'polite');

  var modalMarkup = '<div class="modal-inner"><a href="javascript:" rel="modal:close" aria-label="Close" class="close">&times;</a><div class="modal-content"></div></div>';
  
  var buildClickHandler = function(attribute, modal) {
    return function(event){
      var target = event.target;
      if (target.getAttribute(attribute)) {
        modal.open(target);
      }
    }
  };

  var notifyPlans = function(sendFunc){
    var blocks = body.querySelectorAll('['+planIdAttr+']');
    forEach.call(blocks, function(block){
      sendFunc({
        planID: block.getAttribute(planIdAttr)
      });
    });
  }

  var updatePlans = function(data){
    for (var planID in data){
      var block = body.querySelector('['+planIdAttr+'="'+planID+'"]');
      if (block){
        block.innerHTML = data[planID];
      }
    }
  }

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
  
  var buildMessageHandler = function(modal){
    return function(event){
      var payload = extractPayload(event);
      
      if (payload.init){
        var replyWith = function(payload){
          event.source.postMessage(JSON.stringify(payload), window.location.origin);
        };
        notifyPlans(replyWith);
        modal.openChannel(replyWith);
      } else if (payload.dataChanged){
        notifyPlans(modal.dispatchFunc)
      } else if (payload.planData){
        updatePlans(payload.planData);
      } else if (payload.overlayContent){
        addOverlay(payload.overlayContent);
      }
    };
  };

  var bindBehaviors = function(modal){
    var modalBox = modal.wrapper;
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

  var buildModalContent = function(){
    var modalWrapper = document.createElement('div');
    modalWrapper.className = 'modal';
    modalWrapper.setAttribute('role','dialog');
    modalWrapper.setAttribute('aria-labelledby', 'iFrame');
    modalWrapper.innerHTML = modalMarkup;
    modalWrapper.querySelector('.modal-content').appendChild(iFrame);
    return modalWrapper;
  };

  var buildModalMarkup = function(modal){
    modal.container = document.createElement('div');
    modal.container.className = 'modal-container';
    modal.wrapper = buildModalContent();
    modal.container.appendChild(modal.wrapper);
  }
  
  var buildModal = function(){

    var modal = {
      openChannel: function(dispatchFunc){
        this.dispatchFunc = dispatchFunc;
      },
      close: function(){
        this.container.className = 'modal-container';
        if (this.lastFocus){
          this.lastFocus.focus();
          this.lastFocus = null;
        }
      },
      open: function(clickTarget){
        this.lastFocus = clickTarget;
        iFrame.contentWindow.focus();
        var params = {
          planID: clickTarget.getAttribute(planIdAttr),
          section: clickTarget.getAttribute('data-section')
        };
        this.container.className = 'modal-container modal-visible';
        this.send({routeTo: params});
      },
      send: function(payload){
        if (this.dispatchFunc){
          this.dispatchFunc(payload);
        }
      }
    };
    
    buildModalMarkup(modal);
    bindBehaviors(modal);
    return modal;
  };

 

  var init = function(){
    var modal = buildModal();
    body.appendChild(modal.container);
    body.addEventListener('click', buildClickHandler('data-modal', modal));
    window.addEventListener("message", buildMessageHandler(modal), false);
  };

  init();
};
