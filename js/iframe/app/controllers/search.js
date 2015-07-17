(function(){
  var controller = WidgetApp.controllers['search'] = {};
  controller.init = function(tag){
    var store = WidgetApp.store;
    tag.results = {
      doctors: [],
      drugs: [],
      facilities: []
    };
    tag.search = function(e){
      store.entities.search(this.query.value).then(function(results){
        tag.results = results;
        tag.update();
      });
    }.bind(tag);

    var addFunction = function(key){
      return function(e){
        var item = e.item;
        if (item && item.name){
          store[key].push(_.pick(item, 'id', 'name'));
          tag.update();
        }
      }.bind(tag);
    }
    
    tag.addDoctor = addFunction('doctorCollection');
    tag.addDrug = addFunction('drugCollection');
    tag.addFacility = addFunction('facilityCollection');
  }
})();
