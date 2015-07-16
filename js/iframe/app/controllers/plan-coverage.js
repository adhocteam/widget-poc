(function(){
  var controller = WidgetApp.controllers['plan-coverage'] = {};
  controller.init = function(tag, id){
    WidgetApp.store.coverageFor(id).then(function(coverage){
      tag.coverage = coverage;
      tag.rolledUp = WidgetApp.store.rollUpCoverage(coverage);
      tag.update();
    });
  }
})();
