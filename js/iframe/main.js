$(document).ready(function(){
  var forEach = Array.prototype.forEach;

  var dummyData = {
    '123456': {doctors: [4,6], scrips: [1,3], facilities: [0,1]},
    '654321': {doctors: [6,6], scrips: [2,3], facilities: [1,1]},
    '111111': {doctors: [1,6], scrips: [0,3], facilities: [1,1]}
  };

  var dispatchToParent = function(payload){
    window.parent.postMessage(
      JSON.stringify(payload),
      window.location.origin
    );
  }

  var emitOverlay = function(){
    var data = {doctors: 6, scrips: 3, facilities: 1};
    var dispatch = document.createElement('div');
    riot.mountTo(dispatch, 'plan-overlay', data);
    dispatchToParent({overlayContent: dispatch.innerHTML});
  }

  var emitInit = function(){
    dispatchToParent({init: true});
  }
  
  var emitFactsAboutId = function(id){
    var data = dummyData[id];
    if (data){
      data.planID = id;
      var dispatch = document.createElement('div');
      riot.mountTo(dispatch, 'plan-details', data);
      var planData = {};
      planData[id] = dispatch.innerHTML;
      dispatchToParent({planData: planData});
    }
  }

  window.addEventListener("message", function(event){
    // Only accept same-origin messages for now
    if (event.origin != window.location.origin) return;
    try {
      var payload = JSON.parse(event.data);
    } catch(err) {
      return;
    }
    if (payload.planID){
      emitFactsAboutId(payload.planID)
    }
  }, false);
  
  var input = [];
  try {
    var params = URI(document.URL).query(true);
    input = JSON.parse(params['input']);
  } catch(err) {
  }
  forEach.call(input, function(planBlock){
    emitFactsAboutId(planBlock.id);
  });
  emitOverlay();
  emitInit();
  $('body').append('<p>The parent said: '+params['input']+'</p>');
});
