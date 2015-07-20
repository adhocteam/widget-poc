var WidgetApp = WidgetApp || {};
(function(){
  WidgetApp.store = WidgetApp.store || {};
  var store = WidgetApp.store;

  var entities = store.entities = {};

  entities.providerUrl = 'http://marketplace.adhocteam.us/api/v1/providers/search';
  entities.drugUrl = 'http://marketplace.adhocteam.us/api/v1/drugs/search';
  
  var hasMatch = function(matchable, token){
    return matchable.indexOf(token) > -1;
  }

  var andStream = function(stream, funcToCall){
    return !_.find(stream, function(val){
      return !funcToCall(val);
    });
  }

  var orStream = function(stream, funcToCall){
    return _.find(stream, function(val){
      return funcToCall(val);
    });
  }

  var searchProviders = function(query, zip){
    var d = Q.defer();
    reqwest({
      url: entities.providerUrl,
      method: 'get',
      crossOrigin: true,
      type: 'json',
      data: {q: query, zipcode: zip}
    }).then(d.resolve,d.reject);
    return d.promise.then(function(resp){
      var transformed = _.compact(
        _.map(
          resp.providers,
          function(provider){
            var entity = _.extend(provider.provider, {
              id: provider.provider.npi,
              group_key: (provider.provider.provider_type == 'Individual' ? 'doctors' : 'facilities')
            })
            if (!added(entity, entity.group_key)){
              return entity;
            }
          }
        )
      );
      return _.groupBy(transformed, function(provider){
        return provider.group_key;
      });
    });
  }

  var searchDrugs = function(query){
    var d = Q.defer();
    reqwest({
      url: entities.drugUrl,
      method: 'get',
      crossOrigin: true,
      type: 'json',
      data: {q: query}
    }).then(d.resolve, d.reject);
    return d.promise.then(function(resp){
      return {drugs: _.compact(
        _.map(resp.drugs, function(drug){
          var payload = {id: drug.rxcui, name: drug.name};
          if (!added(payload, 'drugs')){
            return payload;
          }
        })
      )};
    })
  }

  
  entities.search = function(query){
    return Q.all([
      searchProviders(query, store.zip),
      searchDrugs(query)
    ]).then(function(results){
      var output = _.reduce(results, function(memo, result){
        return _.extend(memo, result);
      }, {})
      return output;
    });
  }
  
  entities.get = function(){
    return {
      doctors: store.doctorCollection.data,
      drugs: store.drugCollection.data,
      facilities: store.facilityCollection.data
    }
  }
  
  var added = function(entity, key){
    if (entity && entity.id){
      var entityList = entities.get()[key]
      return _.find(entityList, function(elem){return elem.id == entity.id})
    }
  }
  
})();
