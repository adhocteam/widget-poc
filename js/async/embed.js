window.EmbedPOC.bindBehavior = function(){
  var lastFocus;
  var dispatchedMessage;

  var modalContainer = document.createElement('div');
  var messageContainer = document.createElement('div');

  var preloadResource = function(path){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path);
    xhr.send('');
  };

  var clickHandler = function(attribute, modal) {
    return function(event){
      if (event.target.getAttribute(attribute)) {
        var modalData = event.target.getAttribute(attribute);
        var iFrameSrc = "embed.html?input="+modalData;
        var iFrame = '<iframe aria-live="polite" src="'+iFrameSrc+'"></iframe>';
        lastFocus = event.target || document.activeElement;
        modal.$.modalContent.setAttribute('data-content-to-load', iFrame);
        dispatchedMessage = modalData;
        modal.open('#' +modalContainer.id);
      }
    }
  };

  var messageHandler = function(event){
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
      messageContainer.innerHTML = "<p>The iFrame initialized with:</p>"+payload.init;
      replyWith("Hello back from the parent. In case you forgot, the value I sent you initially was: " + dispatchedMessage);
    } else if (payload.message){
      messageContainer.innerHTML = "<p>The iFrame sent:</p>"+payload.message;
      replyWith("Thanks for sending " + payload.message);
    }
  };

  var buildModal = function(){
    var modalBox = document.createElement('div');

    modalBox.className = 'modal';
    modalBox.setAttribute('role','dialog');
    modalBox.setAttribute('aria-labelledby', 'iFrame');
    modalBox.innerHTML = '<div class="modal-inner"><a href="javascript:" rel="modal:close" aria-label="Close" class="close">&times;</a><div class="modal-content"></div></div>';
    
    modalContainer.id = 'iFrameWidget';
    modalContainer.style.display = 'none';
    document.body.appendChild(modalBox);
    document.body.appendChild(modalContainer);
    
    
    return new VanillaModal({
      onBeforeClose: function(){
        if (this.$.modalContent.innerHTML){
          // If you just set it to null, IE gives it a null
          // child node, instead of an empty set of child nodes.
          this.$.modalContent.innerHTML = null;
        }
      },
      onClose: function(){
        if (lastFocus){
          lastFocus.focus();
          lastFocus = null;
        }
      },
      onOpen: function(){
        var content=this.$.modalContent;
        content.innerHTML = content.getAttribute('data-content-to-load');
        content.querySelector('iframe').contentWindow.focus();
      },
      closeKey: 27
    });
  };

  var modal = buildModal();
  document.querySelector('body').addEventListener('click', clickHandler('data-modal', modal));

  document.body.appendChild(messageContainer);
  window.addEventListener("message", messageHandler, false);
  
  preloadResource('build/iframe.js');
  preloadResource('css/iframe.css');
  
};
