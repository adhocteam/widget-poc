(
  function(){
    var styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.type = 'text/css';
    styles.href = 'css/widget.css';
    var jq = document.createElement('script');
    jq.src = 'build/async.js'
    jq.type = 'text/javascript';
    jq.async = 'true';
    // Shout out to IE9 for firing _both_ events
    var callbackFired = false;
    jq.onload = jq.onreadystatechange = function(){
      var rs = this.readyState;
      if (callbackFired || rs && rs != 'complete' && rs != 'loaded') return;
      try {
        callbackFired = true;
        PlanCompareWidget.init();
      } catch(e) {}
    };
    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(styles, first);
    first.parentNode.insertBefore(jq, first);
  }
)();
