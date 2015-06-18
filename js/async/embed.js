var bindBehavior = function(){
  (function(){

    var modalBox = document.createElement('div');
    modalBox.className = 'modal'
    modalBox.innerHTML = '<div class="modal-inner"><a rel="modal:close">Close</a><div class="modal-content"></div></div>';
    
    var modalContainer = document.createElement('div');
    modalContainer.id = 'iFrameWidget';
    modalContainer.style.display = 'none';
    document.body.appendChild(modalBox);
    document.body.appendChild(modalContainer);
    
    var modal = new VanillaModal({
      onBeforeClose: function(){
        this['$'].modalContent.innerHTML = null;
      },
      onOpen: function(){
        this['$'].modalContent.innerHTML = modalContainer.getAttribute('contentToLoad');
      }
    });

    document.querySelector('body').addEventListener('click', function(event) {
      if (event.target.attributes['data-modal']) {
        var modalData = event.target.getAttribute('data-modal');
        var iFrameSrc = "embed.html?input="+modalData;
        var iFrame = '<iframe src="'+iFrameSrc+'"></iframe>';
        modalContainer.setAttribute('contentToLoad', iFrame);
        modal.open('#' +modalContainer.id);
      }
    });
    
    window.addEventListener("message", function(event){
      var payload;
      try {
        payload = JSON.parse(event.data);
      } catch(err) {
        payload = {};
      }
      event.source.postMessage(JSON.stringify({reply: "Hello back from the parent"}), '*');
      var messageContainer = document.createElement('div');
      messageContainer.innerHTML = "<p>The iFrame said:</p>"+payload.init+"</div>";
      document.body.appendChild(messageContainer);
    }, false);
  })();
};
