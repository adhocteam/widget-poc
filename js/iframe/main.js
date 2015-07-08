$(document).ready(function(){
  var forEach = Array.prototype.forEach;

  var checkCoverage = function(planId, data){
    var output = {};
    // Consider it covered if the planId and the entity id share any chars
    var planChars = planId.toString().split('');
    $.each(data, function(type, list){
      var typeList = output[type] = {};
      $.each(list, function(i, id){
        var found = false;
        var idChars = id.toString().split('');
        for (var i=0; i<idChars.length; i++){
          if (planChars.indexOf(idChars[i]) > -1) found = true;
        }
        typeList[id] = found;
      });
        
    });
    return output;
  }
  
  var dummyData = {
    doctors: [1,2,3,9,8,6],
    scrips: [45, 66, 89],
    facilities: [345]
  };

  var rollUpCoverage = function(coverageData){
    var output = {}
    $.each(coverageData, function(type, data){
      var coveredCount = 0,
          uncoveredCount = 0;
      $.each(data, function(id, value){
        if (value){
          coveredCount++;
        } else {
          uncoveredCount++;
        }
      });
      output[type] = {covered: coveredCount, uncovered: uncoveredCount, total: coveredCount+uncoveredCount};
    });
    return output;
  }
  
  var getMyEntities = function(){
    return dummyData;
  }
  
  var dispatchToParent = function(payload){
    window.parent.postMessage(
      JSON.stringify(payload),
      window.location.origin
    );
  }

  var emitOverlay = function(){
    var dataPayload = getMyEntities();
    var data = {doctors: dataPayload.doctors.length,
                scrips: dataPayload.scrips.length,
                facilities: dataPayload.facilities.length};
    var dispatch = document.createElement('div');
    riot.mountTo(dispatch, 'plan-overlay', data);
    dispatchToParent({overlayContent: dispatch.innerHTML});
  }

  var emitInit = function(){
    dispatchToParent({init: true});
  }
  
  var emitFactsAboutId = function(id){
    var data = rollUpCoverage(checkCoverage(id, getMyEntities()));
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
    var payload = extractPayload(event);
    if (payload.planID){
      emitFactsAboutId(payload.planID)
    } else if (payload.routeTo){
      var routeBox = document.createElement('div');
      routeBox.innerHTML = JSON.stringify(payload.routeTo);
      document.body.appendChild(routeBox);
    }
  }, false);
  
  var input = [];
  try {
    var params = URI(document.URL).query(true);
    input = JSON.parse(params['input']);
  } catch(err) {
  }
  $.each(input, function(i, planBlock){
    emitFactsAboutId(planBlock.id);
  });
  emitOverlay();
  emitInit();
});
