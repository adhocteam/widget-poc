$(document).ready(function(){
  window.parent.postMessage(JSON.stringify({init: "Hello from the iFrame"}), '*');
  window.addEventListener("message", function(event){
    var payload = JSON.parse(event.data);
    if (payload.reply){
      $('body img').before('<p>The parent replied:'+payload.reply+'</p>');
    }
  }, false);
  var params = URI(document.URL).query(true);
  $('body img').before('<p>The parent said: '+params['input']+'</p>');
});
