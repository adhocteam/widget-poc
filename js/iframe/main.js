var WidgetApp = WidgetApp || {};

$(document).ready(function(){
  WidgetApp.routes.bind();
  WidgetApp.bindListeners();
  WidgetApp.emitOverlay();
  WidgetApp.emitInit();
})
