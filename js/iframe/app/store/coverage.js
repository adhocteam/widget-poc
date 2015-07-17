var WidgetApp = WidgetApp || {};
(function(){
  WidgetApp.store = WidgetApp.store || {};
  var store = WidgetApp.store;

  var coverage = store.coverage = {};

  coverage.check = function(planId, data){
    var promises = _.map(['doctors', 'drugs', 'facilities'], function(datatype){
      return forDataType(planId, datatype, data[datatype]);
    })
    return Q.all(promises).then(function(results){
      var output = _.reduce(results, function(memo, result){
        return _.extend(memo, result);
      }, {})
      return output;
    })
  }

  var forDataType = function(planID, datatype, data){

    var grouped = _.groupBy(data, function(datum){
      return !!cacheEntryFor(planID, datatype, datum.id);
    });
       
    var cached = _.object(
      _.map(grouped[true], function(datum){
        return [datum.id, cacheEntryFor(planID, datatype, datum.id)];
      })
    );
    return getForDataType(planID, datatype, grouped[false]).then(function(result){
      _.each(result[datatype], function(datum, entity_id){
        setCacheEntry(planID, datatype, entity_id, datum);
      });
      var output = {};
      output[datatype] = _.extend(result[datatype], cached);
      return output;
    });
  }
  var cache = {};

  var cacheKey = function(planID, datatype, entity_id){
    return ''+planID+'-'+datatype+'-'+entity_id;
  }
  
  var cacheEntryFor = function(planID, datatype, entity_id){
    return cache[cacheKey(planID, datatype, entity_id)];
  }

  var setCacheEntry = function(planID, datatype, entity_id, value){
    cache[cacheKey(planID, datatype, entity_id)] = value;
  }
  
  var getForDataType = function(planID, datatype, data){
    var lookupDeferred = Q.defer();
    if (data && data.length){
      queues[datatype].push({planID: planID, data: data, deferred: lookupDeferred});
    } else {
      var output = {};
      output[datatype] = {};
      lookupDeferred.resolve(output);
    }
    return lookupDeferred.promise;
  }
  
  var buildQueues = function(datatypes){
    return _.object(
      _.map(datatypes, function(datatype){
        
        var queue = [];
        var queueObj = {};

        var batchSize = 20;
        
        queueObj.push = function(task){
          queue.push(task)
          this.scheduleDrain();
        }
        queueObj.scheduleDrain = function(){
          if (!this.scheduledDrain){
            this.scheduledDrain = window.setTimeout(this.drain.bind(this), 25);
          }
        }
        
        queueObj.drain = function(){
          var batch = _.head(queue, batchSize);
          queue = _.tail(queue, batchSize);
          this.scheduledDrain = null;
          if (queue.length){
            this.scheduleDrain();
          }

          
          if (batch.length){
            var output = coverage.dummyCheck(
              _.pluck(batch, 'planID'),
              datatype,
              _.uniq(_.flatten(_.pluck(batch, 'data')))
            );
            _.each(output, function(data, planID){
              _.each(batch, function(item){
                if (item.planID == planID){
                  item.deferred.resolve(data)
                }
              });
            });
          }
        }
        
        return [datatype, queueObj];
      })
    );
  }
  
  var queues = buildQueues(['doctors', 'drugs', 'facilities']);
  
  coverage.dummyCheck = function(planIDs, datatype, data){
    return _.object(
      _.map(planIDs, function(planID){
        var planChars = planID.toString().split('');
        var output = {};
        output[datatype] = 
          _.object(
            _.map(data, function(entity){
              var idChars = entity.id.toString().split('');
              var found = !!(_.intersection(planChars, idChars).length)
              return [entity.id, {covered: found, name: entity.name}]
            })
          );
        
        return [planID, output];
        
      })
    );
  }
  
})();
