var WidgetApp = WidgetApp || {};
(function(){
  WidgetApp.store = WidgetApp.store || {};
  var store = WidgetApp.store;

  var sendToStorage = function(key, data){
    localStorage[key] = JSON.stringify(data);
  }

  var retrieveFromStorage = function(key){
    var raw = localStorage[key];
    var data;
    try {
      data = JSON.parse(raw);
    } catch(err) {}
    return data;
  }

  var event = document.createEvent('Event');
  event.initEvent('entityDataChanged', true, true);
  
  var entityProto = {};
  entityProto.data = [];
  entityProto.persist = function(){
    sendToStorage(this.storageKey, this.data);
    document.dispatchEvent(event);
  }
  entityProto.load = function(){
    this.data = retrieveFromStorage(this.storageKey);
    document.dispatchEvent(event);
    return this.data;
  }
  entityProto.push = function(element){
    this.data.push(element);
    this.persist();
  }
  entityProto.set = function(elements){
    this.data = elements;
    this.persist();
  }
  entityProto.remove = function(id){
    this.data = _.reject(this.data, function(entity){
      return (entity.id == id)
    });
    this.persist();
    return(this.data);
  }

  store.doctorCollection = Object.create(entityProto, {storageKey: {value: 'doctors'}});
  store.scripCollection = Object.create(entityProto, {storageKey: {value: 'scrips'}});
  store.facilityCollection = Object.create(entityProto, {storageKey: {value: 'facilities'}});
  
  

  store.facilityCollection.load();
  store.scripCollection.load();
  store.doctorCollection.load();
  
  
})();
