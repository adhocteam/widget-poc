var WidgetApp = WidgetApp || {};
(function(){
  WidgetApp.store = WidgetApp.store || {};
  var store = WidgetApp.store;
  
  store.checkCoverage = function(planId, data){
    var output = {};
    // Consider it covered if the planId and the entity id share any chars
    var planChars = planId.toString().split('');
    $.each(data, function(type, list){
      var typeList = output[type] = {};
      $.each(list, function(i, entity){
        var found = false;
        var idChars = entity.id.toString().split('');
        for (var i=0; i<idChars.length; i++){
          if (planChars.indexOf(idChars[i]) > -1) found = true;
        }
        typeList[id] = found;
      });
        
    });
    return output;
  }
  
  var dummyData = {
    doctors: 
    scrips: [45, 66, 89],
    facilities: [345]
  };

  var getMyDoctors = function(){
    return [
      {id: 1, name: 'Doctor A'},
      {id: 2, name: 'Doctor B'},
      {id: 3, name: 'Doctor C'},
      {id: 9, name: 'Doctor D'},
      {id: 8, name: 'Doctor E'},
      {id: 6, name: 'Doctor F'}
    ]
  }

  var getMyScrips = function(){
    return [
      {id: 45, name: 'benadryl'},
      {id: 66, name: 'aspirin'},
      {id: 89, name: 'ranitidine'}
    ]
  }

  var getMyFacilities = function(){
    return [{id: 345, name: 'A Place'}]
  }
  
  store.rolledUpCoverageForId = function(id){
    this.rollUpCoverage(this.checkCoverage(id, this.getMyEntities()));
  }
  
  store.rollUpCoverage = function(coverageData){
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
  
  store.getMyEntities = function(){
    return {
      doctors: getMyDoctors,
      scrips: getMyScrips,
      facilities: getMyFacilities
    }
  }

})();
