window.EmbedPOC.bindBehavior = function(){
  var modalBox = document.createElement('div');
  modalBox.className = 'modal';
  modalBox.innerHTML = '<div class="modal-inner"><a href="javascript:" rel="modal:close" aria-label="Close" class="close">&times;</a><div class="modal-content"></div></div>';
  
  var modalContainer = document.createElement('div');
  modalContainer.id = 'iFrameWidget';
  modalContainer.style.display = 'none';
  document.body.appendChild(modalBox);
  document.body.appendChild(modalContainer);
  
  var modal = new VanillaModal({
    onBeforeClose: function(){
      if (this.$.modalContent.innerHTML){
        // If you just set it to null, IE gives it a null
        // child node, instead of an empty set of child nodes.
        this.$.modalContent.innerHTML = null;
      }
    },
    onOpen: function(){
      this['$'].modalContent.innerHTML = modalContainer.getAttribute('data-content-to-load');
    }
  });

  var dispatchedMessage;
  
  document.querySelector('body').addEventListener('click', function(event) {
    if (event.target.getAttribute('data-modal')) {
      var modalData = event.target.getAttribute('data-modal');
      var iFrameSrc = "embed.html?input="+modalData;
      var iFrame = '<iframe src="'+iFrameSrc+'"></iframe>';
      modalContainer.setAttribute('data-content-to-load', iFrame);
      modal.open('#' +modalContainer.id);
      dispatchedMessage = modalData;
    }
  });
  
  window.addEventListener("message", function(event){
    var payload;
    try {
      payload = JSON.parse(event.data);
    } catch(err) {
      payload = {};
    }
    event.source.postMessage(JSON.stringify({reply: "Hello back from the parent. In case you forgot, the thing I sent you earlier was: " + dispatchedMessage}), '*');
    if (payload.init){
      var messageContainer = document.createElement('div');
      messageContainer.innerHTML = "<p>The iFrame said:</p>"+payload.init+"</div>";
      document.body.appendChild(messageContainer);
    }
  }, false);
};
