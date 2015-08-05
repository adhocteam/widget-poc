var WidgetApp = WidgetApp || {};

document.addEventListener("DOMContentLoaded", function(event) { 
  WidgetApp.routes.bind();
  WidgetApp.bindListeners();
  WidgetApp.emitInit();
})
