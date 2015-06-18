(
  function(){
    var boogieBoard = function(){
      $('[data-modal]').click(function(){
        $('<iframe src="embed.html?input='+$(this).data('modal')+'"></iframe>').appendTo('body').modal();
      });
      window.addEventListener("message", function(event){
        var payload = JSON.parse(event.data);
        event.source.postMessage(JSON.stringify({reply: "Hello back from the parent"}), '*');
        $('body').append("<div><p>The iFrame said:</p>"+event.data+"</div>")
      }, false);
    };
    var jq = document.createElement('script');
    jq.src = 'build/app.js'
    jq.type = 'text/javascript';
    jq.async = 'true';
    jq.onload = jq.onreadystatechange = function(){
      var rs = this.readyState;
      if (rs && rs != 'complete' && rs != 'loaded') return;
      try {boogieBoard()} catch(e) {}
    };
    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(jq, first);
  }
)();
