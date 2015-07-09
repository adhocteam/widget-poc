var WidgetApp = WidgetApp || {};
(function(){
  WidgetApp.controllers = WidgetApp.controllers || {};
  var controller = WidgetApp.controllers['doctors'] = {};
  controller.init = function(){
    var collection = WidgetApp.store.doctorCollection;
    var tag = riot.mount('body', 'doctors-page', {data: collection.data})[0];
  }
})();
