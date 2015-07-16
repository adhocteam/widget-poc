var WidgetApp = WidgetApp || {};
(function(){
  var dispatchToParent = function(payload){
    window.parent.postMessage(
      JSON.stringify(payload),
      window.location.origin
    );
  }

  var extractCounts = function(data){
    var output = {}
    for (key in data){
      if(data.hasOwnProperty(key)){
        output[key] = data[key].length
      }
    }
    return output;
  }
  
  WidgetApp.emitOverlay = function(){
    var data = extractCounts(this.store.getMyEntities())
    dispatchToParent({overlayContent: contentFor('plan-overlay', data)});
  }

  WidgetApp.emitDataChanged = function(){
    dispatchToParent({dataChanged: true});
  }
  
  WidgetApp.emitInit = function(){
    dispatchToParent({init: true});
  }

  var contentFor = function(template, data){
    var dispatch = document.createElement('div');
    var node = riot.mount(dispatch, template, data)[0];
    var content = dispatch.innerHTML;
    node.unmount();
    return content;
  }
  
  WidgetApp.emitFactsAboutId = function(id){
    this.store.rolledUpCoverageFor(id).then(function(data){
      if (data){
        data.planID = id;
        var planData = {};
        planData[id] = contentFor('plan-details', data)
        dispatchToParent({planData: planData});
      }
    });
  }
})();
