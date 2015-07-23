if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                               ? this
                               : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

// IE polyfill
var wl = window.location;
if (!wl.origin) {
  wl.origin = wl.protocol + "//" + wl.hostname + (wl.port ? ':' + wl.port: '');
}

var extractPayload= function(event){
    // Only accept same-origin messages for now
  if (event.origin != window.location.origin) return {};
  try {
    var payload = JSON.parse(event.data);
    return payload;
  } catch(err) {
    return {};
  }
    
}

if (!window.PlanCompareWidget) window.PlanCompareWidget = {};

window.PlanCompareWidget.init = function(){
  var scriptBase, iFrame;
  var body = document.body;
  var forEach = Array.prototype.forEach;
  var planIdAttr = 'data-plan-id';
  
  var getScriptBase = function(){
    if (scriptBase) return scriptBase;
    var scriptLoc = document.getElementById('planCompareWidgetScript').src;
    return scriptBase = scriptLoc.slice(0,scriptLoc.lastIndexOf('/') + 1);;
  };

  var injectStyles = function(){
    var styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.type = 'text/css';
    styles.href = getScriptBase()+'widget.css';
    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(styles, first);
  }

  var generateIframeElement = function(){
    var iFrameElem = document.createElement('iframe');
    iFrameElem.src = getScriptBase()+'iframe.html#list';
    iFrameElem.setAttribute('aria-live', 'polite');
    return iFrameElem;
  }

  var getIframe = function() {
    if (iFrame) return iFrame;
    return iFrame = generateIframeElement();
  };
    
  var buildClickHandler = function(attribute, modal) {
    return function(event){
      var target = event.target;
      if (target.getAttribute(attribute)) {
        modal.open(target);
      }
    }
  };

  var notifyPlans = function(sendFunc){
    var blocks = body.querySelectorAll('['+planIdAttr+'][data-zip-code]');
    console.log('Plan blocks found:');
    console.dir(blocks)
    forEach.call(blocks, function(block){
      sendFunc({
        planID: block.getAttribute(planIdAttr),
        zip: block.getAttribute('data-zip-code')
      });
    });
  }

  var updatePlans = function(data){
    for (var planID in data){
      var block = body.querySelector('['+planIdAttr+'="'+planID+'"]');
      console.log('Updating plan block:');
      console.dir(block);
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
      overlay = document.createElement('div');
      overlay.className = 'widgetOverlay';
      body.appendChild(overlay);
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
        console.log('Notify the iFrame of plans');
        notifyPlans(modal.dispatchFunc)
      } else if (payload.planData){
        console.log('Plan data received');
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
    modalWrapper.className = 'coverage-modal';
    modalWrapper.setAttribute('role','dialog');
    modalWrapper.setAttribute('aria-labelledby', 'iFrame');
    modalWrapper.innerHTML = '<div class="modal-inner"><a href="javascript:" rel="modal:close" aria-label="Close" class="close">&times;</a><div class="modal-content"></div></div>';
    modalWrapper.querySelector('.modal-content').appendChild(getIframe());
    return modalWrapper;
  };

  var buildModalMarkup = function(modal){
    modal.container = document.createElement('div');
    modal.container.className = 'coverage-modal-container';
    modal.wrapper = buildModalContent();
    modal.container.appendChild(modal.wrapper);
  }
  
  var buildModal = function(){

    var modal = {
      openChannel: function(dispatchFunc){
        this.dispatchFunc = dispatchFunc;
      },
      close: function(){
        this.container.className = 'coverage-modal-container';
        if (this.lastFocus){
          this.lastFocus.focus();
          this.lastFocus = null;
        }
      },
      open: function(clickTarget){
        this.lastFocus = clickTarget;
        getIframe().contentWindow.focus();
        var params = {
          planID: clickTarget.getAttribute(planIdAttr),
          section: clickTarget.getAttribute('data-section')
        };
        this.container.className = 'coverage-modal-container modal-visible';
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

  (function(){
    injectStyles();
    var modal = buildModal();
    body.appendChild(modal.container);
    body.addEventListener('click', buildClickHandler('data-modal', modal));
    window.addEventListener("message", buildMessageHandler(modal), false);
  })();
};
