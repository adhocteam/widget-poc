var WidgetApp = WidgetApp || {};
(function(){
  var store = {};
  store.checkCoverage = function(planId, data){
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
    return dummyData;
  }
  WidgetApp.store = store;

})();
