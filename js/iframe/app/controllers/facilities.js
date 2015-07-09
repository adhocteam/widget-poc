var WidgetApp = WidgetApp || {};
(function(){
  WidgetApp.controllers = WidgetApp.controllers || {};
  var controller = WidgetApp.controllers['facilities'] = {};
  controller.init = function(){
    var collection = WidgetApp.store.facilityCollection;
    var tag = riot.mount('body', 'facilities-page', {data: collection.data})[0];
  }
})();
