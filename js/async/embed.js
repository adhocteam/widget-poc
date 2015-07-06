window.EmbedPOC.bindBehavior = function(){
  var body = document.body;
  var forEach = Array.prototype.forEach;
  
  var preloadResource = function(path){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path);
    xhr.send('');
  };
  var iFrame;
  var buildIframe = function(){
    
    iFrame = '<iframe aria-live="polite" src="embed.html"></iframe>';
  }
  
  var clickHandler = function(attribute, modal) {
    return function(event){
      var target = event.target,
          modalData = target.getAttribute(attribute);
      if (modalData) {
        var planID = target.getAttribute('data-plan-id');
        var section = target.getAttribute('data-section');
        modal.lastFocus = target;
        modal.fill(iFrame);
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
  
  var messageHandler = function(output){
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
      } else if (payload.planData){
        for (var planID in payload.planData){
          var block = body.querySelectorAll('[data-plan-id="'+planID+'"]');
          if (block[0]){
            block[0].innerHTML = payload.planData[planID];
          }
        }
      } else if (payload.overlayContent){
        addOverlay(payload.overlayContent);
      }
    };
  };

  var buildModal = function(){
    var modalBox = document.createElement('div');

    modalBox.className = 'modal';
    modalBox.setAttribute('role','dialog');
    modalBox.setAttribute('aria-labelledby', 'iFrame');
    modalBox.innerHTML = '<div class="modal-inner"><a href="javascript:" rel="modal:close" aria-label="Close" class="close">&times;</a><div class="modal-content"></div></div>';

    var modalContainer = document.createElement('div');
    var attributes = {};
    modalContainer.id = 'iFrameWidget';
    modalContainer.style.display = 'none';
    body.appendChild(modalBox);
    body.appendChild(modalContainer);

    var vm = new VanillaModal({
      onBeforeClose: function(){
        if (this.$.modalContent.innerHTML){
          // If you just set it to null, IE gives it a null
          // child node, instead of an empty set of child nodes.
          this.$.modalContent.innerHTML = null;
        }
      },
      onClose: function(){
        if (modal.lastFocus){
          modal.lastFocus.focus();
          modal.lastFocus = null;
        }
      },
      onOpen: function(){
        var content=this.$.modalContent;
        content.innerHTML = content.getAttribute('data-content-to-load');
        content.querySelector('iframe').contentWindow.focus();
      },
      closeKey: 27
    });
    
    var modal = {
      setAttribute: function(attrName, value){
        attributes[attrName] = value;
      },
      open: function(){
        vm.open('#'+ modalContainer.id);
      },
      fill: function(content){
        vm.$.modalContent.setAttribute('data-content-to-load', content);
      }
    };
    return modal;
  };

  
  
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
  
  buildIframe();
  var modal = buildModal();
  body.addEventListener('click', clickHandler('data-modal', modal));

  
  
  var iFramebox = document.createElement('div');
  iFramebox.style.display = 'none';
  iFramebox.innerHTML = iFrame;
  body.appendChild(iFramebox);
  var messageContainer = document.createElement('div');
  body.appendChild(messageContainer);
  window.addEventListener("message", messageHandler(messageContainer), false);
  
  
};
