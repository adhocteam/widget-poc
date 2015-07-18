var WidgetApp = WidgetApp || {};
(function(){
  WidgetApp.store = WidgetApp.store || {};
  var store = WidgetApp.store;
  store.rolledUpCoverageFor = function(id){
    return this.coverageFor(id).then(function(data){
      return store.rollUpCoverage(data);
    })
  }

  store.coverageFor = function(id){
    return this.coverage.check(id, this.entities.get())
  }
  
  store.rollUpCoverage = function(coverageData){
    return _.mapObject(coverageData, function(data, type){
      var grouped = _.groupBy(data, 'covered');
      var coveredCount = (grouped['true'] || []).length;
      var uncoveredCount = (grouped['false'] || []).length;
      return {covered: coveredCount, uncovered: uncoveredCount, total: coveredCount+uncoveredCount};
    });
  }

  store.setZip = function(zip){
    this.zip = zip;
  }
  
})();

