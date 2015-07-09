var WidgetApp = WidgetApp || {};
(function(){
  var dispatchToParent = function(payload){
    window.parent.postMessage(
      JSON.stringify(payload),
      window.location.origin
    );
  }

  WidgetApp.emitOverlay = function(){
    var dataPayload = this.store.getMyEntities();
    var data = {doctors: dataPayload.doctors.length,
                scrips: dataPayload.scrips.length,
                facilities: dataPayload.facilities.length};
    var dispatch = document.createElement('div');
    riot.mount(dispatch, 'plan-overlay', data);
    dispatchToParent({overlayContent: dispatch.innerHTML});
  }

  WidgetApp.emitInit = function(){
    dispatchToParent({init: true});
  }
  
  WidgetApp.emitFactsAboutId = function(id){
    var data = this.store.rolledUpCoverageFor(id);
    if (data){
      data.planID = id;
      var dispatch = document.createElement('div');
      riot.mount(dispatch, 'plan-details', data);
      var planData = {};
      planData[id] = dispatch.innerHTML;
      dispatchToParent({planData: planData});
    }
  }
})();