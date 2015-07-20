(
  function(){
    var styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.type = 'text/css';
    styles.href = 'dist/widget.css';
    var inject = document.createElement('script');
    inject.src = 'dist/async.js'
    inject.type = 'text/javascript';
    inject.async = 'true';
    // Shout out to IE9 for firing _both_ events
    var callbackFired = false;
    inject.onload = inject.onreadystatechange = function(){
      var rs = this.readyState;
      if (callbackFired || rs && rs != 'complete' && rs != 'loaded') return;
      try {
        callbackFired = true;
        PlanCompareWidget.init();
      } catch(e) {}
    };
    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(styles, first);
    first.parentNode.insertBefore(inject, first);
  }
)();
