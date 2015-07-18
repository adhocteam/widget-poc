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
      return !funcToCall(val)
    });
  }

  var orStream = function(stream, funcToCall){
    return _.find(stream, function(val){
      return funcToCall(val)
    });
  }

  var searchProviders = function(query, zip){
    var d = Q.defer();
    reqwest({
      url: entities.providerUrl,
      method: 'get',
      crossOrigin: true,
      type: 'json',
      data: [
        {
          name: 'q',
          value: query
        },
        {
          name: 'zipcode',
          value: zip
        }
      ]
    }).then(d.resolve,d.reject);
    return d.promise.then(function(resp){
      var transformed = _.map(
        resp.providers,
        function(provider){
          return _.extend(provider.provider, {
            id: provider.provider.npi,
            group_key: (provider.provider.provider_type == 'Individual' ? 'doctors' : 'facilities')
          })
        }
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
      data: [
        {
          name: 'q',
          value: query
        }
      ]
    }).then(d.resolve, d.reject);
    return d.promise.then(function(resp){
      return {drugs: _.map(resp.drugs, function(drug){
        return {id: drug.rxcui, name: drug.name}
      })};
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
