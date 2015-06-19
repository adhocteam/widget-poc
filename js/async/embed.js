window.EmbedPOC.bindBehavior = function(){
  var dispatchedMessage;
  var body = document.body;
  
  var preloadResource = function(path){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path);
    xhr.send('');
  };

  var clickHandler = function(attribute, modal) {
    return function(event){
      var target = event.target,
          modalData = target.getAttribute(attribute);
      if (modalData) {
        
        var iFrameSrc = "embed.html?input="+modalData;
        var iFrame = '<iframe aria-live="polite" src="'+iFrameSrc+'"></iframe>';
        modal.lastFocus = target;
        modal.fill(iFrame);
        dispatchedMessage = modalData;
        modal.open();
        
      }
    }
  };

  var messageHandler = function(output){
    return function(event){
      if (event.origin != window.location.origin) return;
      try {
        var payload = JSON.parse(event.data);
      } catch(err) {
        return;
      }

      var replyWith = function(message){
        event.source.postMessage(JSON.stringify({reply: message}), window.location.origin);
      }
      
      if (payload.init){
        output.innerHTML = "<p>The iFrame initialized with:</p>"+payload.init;
        replyWith("Hello back from the parent. In case you forgot, the value I sent you initially was: " + dispatchedMessage);
      } else if (payload.message){
        output.innerHTML = "<p>The iFrame sent:</p>"+payload.message;
        replyWith("Thanks for sending " + payload.message);
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
      open: function(){
        vm.open('#'+ modalContainer.id);
      },
      fill: function(content){
        vm.$.modalContent.setAttribute('data-content-to-load', content);
      }
    };
    return modal;
  };

  var modal = buildModal();
  body.addEventListener('click', clickHandler('data-modal', modal));

  var messageContainer = document.createElement('div');
  body.appendChild(messageContainer);
  window.addEventListener("message", messageHandler(messageContainer), false);
  
  preloadResource('build/iframe.js');
  preloadResource('css/iframe.css');
  
};
