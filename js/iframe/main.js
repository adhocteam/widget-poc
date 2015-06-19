$(document).ready(function(){
  $('input[type="text"]').parent().focus();
  var dispatchToParent = function(payload){
    window.parent.postMessage(JSON.stringify(
      payload
    ), window.location.origin);
  }
  dispatchToParent({init: "Hello from the iFrame"});
  $('form').submit(function(e){
    e.preventDefault();
    e.stopPropagation();
    dispatchToParent({message: $(this).find('input[type="text"]').val()});
  });
  window.addEventListener("message", function(event){
    // Only accept same-origin messages for now
    if (event.origin != window.location.origin) return;
    try {
      var payload = JSON.parse(event.data);
    } catch(err) {
      return;
    }
    if (payload.reply){
      $('body').append('<p>The parent replied: '+payload.reply+'</p>');
    }
  }, false);
  var params = URI(document.URL).query(true);
  $('body').append('<p>The parent said: '+params['input']+'</p>');
});
