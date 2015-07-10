var WidgetApp = WidgetApp || {};
(function(){
  WidgetApp.controllers = WidgetApp.controllers || {};
  WidgetApp.listControllerFor = function(collectionName){
    var controller = {}
    controller.init = function(tag){
      var collection = WidgetApp.store[collectionName];
      tag.remove = function(e){
        this.collection = collection.remove(e.item.id);
      }.bind(tag)
      tag.collection = collection.data;
    }
    return controller;
  }
})();
