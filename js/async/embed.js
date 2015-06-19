window.EmbedPOC.bindBehavior = function(){
  var modalBox = document.createElement('div');
  modalBox.className = 'modal';
  modalBox.setAttribute('role','dialog');
  modalBox.setAttribute('aria-labelledby', 'iFrame');
  modalBox.innerHTML = '<div class="modal-inner"><a href="javascript:" rel="modal:close" aria-label="Close" class="close">&times;</a><div class="modal-content"></div></div>';
  
  var modalContainer = document.createElement('div');
  modalContainer.id = 'iFrameWidget';
  modalContainer.style.display = 'none';
  document.body.appendChild(modalBox);
  document.body.appendChild(modalContainer);

  var lastFocus;
  
  var modal = new VanillaModal({
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
      this['$'].modalContent.innerHTML = modalContainer.getAttribute('data-content-to-load');
      this['$'].modalContent.querySelector('iframe').contentWindow.focus();
    },
    closeKey: 27
  });

  var dispatchedMessage;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'build/iframe.js');
  xhr.send('');
  xhr = new XMLHttpRequest();
  xhr.open('GET', 'css/iframe.css');
  xhr.send('');
  
  document.querySelector('body').addEventListener('click', function(event) {
    if (event.target.getAttribute('data-modal')) {
      var modalData = event.target.getAttribute('data-modal');
      var iFrameSrc = "embed.html?input="+modalData;
      var iFrame = '<iframe aria-live="polite" src="'+iFrameSrc+'"></iframe>';
      lastFocus = event.target || document.activeElement;
      modalContainer.setAttribute('data-content-to-load', iFrame);
      modal.open('#' +modalContainer.id);
      dispatchedMessage = modalData;
    }
  });
  var messageContainer = document.createElement('div');
  document.body.appendChild(messageContainer);

  window.addEventListener("message", function(event){
    if (event.origin != window.location.origin) return;
    try {
      var payload = JSON.parse(event.data);
    } catch(err) {
      return;
    }
    
    if (payload.init){
      messageContainer.innerHTML = "<p>The iFrame initialized with:</p>"+payload.init;
      event.source.postMessage(JSON.stringify({reply: "Hello back from the parent. In case you forgot, the value I sent you initially was: " + dispatchedMessage}), '*');
    } else if (payload.message){
      messageContainer.innerHTML = "<p>The iFrame sent:</p>"+payload.message;
      event.source.postMessage(JSON.stringify({reply: "Thanks for sending " + payload.message}), window.location.origin);
    }
  }, false);
};
