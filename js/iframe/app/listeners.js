var WidgetApp = WidgetApp || {};
(function(){
  WidgetApp.bindListeners = function(){
    window.addEventListener("message", function(event){
      // Only accept same-origin messages for now
      var payload = extractPayload(event);
      if (payload.planID){
        WidgetApp.emitFactsAboutId(payload.planID)
      } else if (payload.routeTo){
        WidgetApp.routes.handleRouteTo(payload.routeTo);
      }
    }, false);
  }
})();
