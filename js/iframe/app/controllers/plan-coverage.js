(function(){
  var controller = WidgetApp.controllers['plan-coverage'] = {};
  controller.init = function(tag, id){
    var coverage = WidgetApp.store.coverageFor(id);
    tag.coverage = coverage;
    tag.rolledUp = WidgetApp.store.rollUpCoverage(coverage);
  }
})();
