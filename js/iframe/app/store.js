var WidgetApp = WidgetApp || {};
(function(){
  WidgetApp.store = WidgetApp.store || {};
  var store = WidgetApp.store;
  
  store.checkCoverage = function(planId, data){
    // Consider it covered if the planId and the entity id share any chars
    var planChars = planId.toString().split('');
    return _.mapObject(data, function(list, type){
      var array = 
          _.map(list, function(entity){
            var idChars = entity.id.toString().split('');
            var found = !!(_.intersection(planChars, idChars).length)
            return [entity.id, {covered: found, name: entity.name}]
          })
      return _.object(array);
    });
  }
  
  store.rolledUpCoverageFor = function(id){
    return this.rollUpCoverage(this.coverageFor(id));
  }

  store.coverageFor = function(id){
    return this.checkCoverage(id, this.getMyEntities())
  }
  
  store.rollUpCoverage = function(coverageData){
    return _.mapObject(coverageData, function(data, type){
      var grouped = _.groupBy(data, 'covered');
      var coveredCount = (grouped['true'] || []).length;
      var uncoveredCount = (grouped['false'] || []).length;
      return {covered: coveredCount, uncovered: uncoveredCount, total: coveredCount+uncoveredCount};
    });
  }
  
  store.getMyEntities = function(){
    return {
      doctors: this.doctorCollection.data,
      scrips: this.scripCollection.data,
      facilities: this.facilityCollection.data
    }
  }

})();
