var WidgetApp = WidgetApp || {};
(function(){
  WidgetApp.controllers = WidgetApp.controllers || {};
  var controller = WidgetApp.controllers['scrips'] = {};
  controller.init = function(){
    var collection = WidgetApp.store.scripCollection;
    var tag = riot.mount('body', 'scrips-page', {data: collection.data})[0];
  }
})();
