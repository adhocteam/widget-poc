var WidgetApp = WidgetApp || {};
(function(){

  var handlePlanPayload = function(payload){
    WidgetApp.store.setZip(payload.zip);
    WidgetApp.emitFactsAboutId(payload.planID);
  }
  
  WidgetApp.bindListeners = function(){
    window.addEventListener("message", function(event){
      // Only accept same-origin messages for now
      if (event){
        var payload = extractPayload(event);
        if (payload.planID){
          handlePlanPayload(payload);
        } else if (payload.routeTo){
          WidgetApp.routes.handleRouteTo(payload.routeTo);
        }
      }
    }, false);

    document.addEventListener('entityDataChanged', function(event){
      WidgetApp.emitOverlay();
      WidgetApp.emitDataChanged();
    }, false)
  }
})();
