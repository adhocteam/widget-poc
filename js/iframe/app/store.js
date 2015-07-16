var WidgetApp = WidgetApp || {};
(function(){
  WidgetApp.store = WidgetApp.store || {};
  var store = WidgetApp.store;
  
  store.checkCoverage = function(planId, data){
    // Consider it covered if the planId and the entity id share any chars
    var promises = _.map(['doctors', 'drugs', 'facilities'], function(datatype){
      return store.coverageForDataType(planId, datatype, data[datatype]);
    })
    return Q.all(promises).then(function(results){
      var output = _.reduce(results, function(memo, result){
        return _.extend(memo, result);
      }, {})
      return output;
    })
  }

  store.rolledUpCoverageFor = function(id){
    return this.coverageFor(id).then(function(data){
      return store.rollUpCoverage(data);
    })
  }

  store.coverageFor = function(id){
    return this.checkCoverage(id, this.getMyEntities())
  }
  
  store.rollUpCoverage = function(coverageData){
    return _.mapObject(coverageData, function(data, type){
      var grouped = _.groupBy(data, 'covered');
      var coveredCount = (grouped['true'] || []).length;
      var uncoveredCount = (grouped['false'] || []).length;
      return {covered: coveredCount, uncovered: uncoveredCount, total: coveredCount+uncoveredCount};
    });
  }

  var hasMatch = function(matchable, token){
    return matchable.indexOf(token) > -1;
  }

  var andStream = function(stream, funcToCall){
    return !_.find(stream, function(val){
      return !funcToCall(val)
    })
  }

  var orStream = function(stream, funcToCall){
    return _.find(stream, function(val){
      return funcToCall(val)
    })
  }
  
  store.search = function(query){
    return Q.fcall(function(){
      if (!query) return false;
      var tokens = _.compact(query.toLowerCase().split(/\W/));
      return _.mapObject(store.stubData, function(list, key){
        return _.filter(list, function(entity){
          var matchables = _.map(_.compact([entity.name, entity.specialty]), function(m){
            return m.toLowerCase();
          });
          var tokenMatches = function(token){
            return orStream(
              matchables, _.partial(hasMatch, _, token)
            )
          }
          return !store.entityAdded(entity, key) && andStream(tokens, tokenMatches)
        })
      })
    });
  }

  store.entityAdded = function(entity, key){
    if (entity && entity.id){
      var entityList = store.getMyEntities()[key]
      return _.find(entityList, function(elem){return elem.id == entity.id})
    }
    
    
  }
  
  store.getMyEntities = function(){
    return {
      doctors: this.doctorCollection.data,
      drugs: this.drugCollection.data,
      facilities: this.facilityCollection.data
    }
  }

  store.coverageForDataType = function(planID, datatype, data){
    var idList = _.map(data, function(datum){return datum.id});
    var cacheKey = ''+planID+'-'+datatype+'-'+_.compact(idList).join('-');
    
    if (store.coverageCache[cacheKey]){
      return Q.fcall(function(){
        return store.coverageCache[cacheKey];
      });
    } else {
      return store.getCoverageForDataType(planID, datatype, data).then(function(result){
        store.coverageCache[cacheKey] = result;
        return result;
      })
    }
    return store.dummyCoverageCheck(planID, datatype, data);
  }

  store.coverageCache = {};
  
  store.getCoverageForDataType = function(planID, datatype, data){
    var lookupDeferred = Q.defer();
    store.coverageQueues[datatype].push({planID: planID, data: data, deferred: lookupDeferred});
    return lookupDeferred.promise;
  }

  var buildCoverageQueues = function(datatypes){
    return _.object(
      _.map(datatypes, function(datatype){
        
        var queue = []
        var queueObj = {}

        var batchSize = 20;
        
        queueObj.push = function(task){
          queue.push(task)
          this.scheduleDrain();
        }
        queueObj.scheduleDrain = function(){
          window.setTimeout(this.drain.bind(this), 25);
        }
        
        queueObj.drain = function(){
          var batch = _.head(queue, batchSize);
          queue = _.tail(queue, batchSize);
          if (queue.length){
            this.scheduleDrain();
          }

          
          if (batch.length){
            var output = store.dummyCoverageCheck(
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

  store.coverageQueues = buildCoverageQueues(['doctors', 'drugs', 'facilities']);

  
  
  store.dummyCoverageCheck = function(planIDs, datatype, data){
    console.log(data);
    return _.object(
      _.map(planIDs, function(planID){
        var planChars = planID.toString().split('');
        var output = {}
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
  };
  
  store.stubData = {
    doctors: [
      {id: 1, name: "Ephraim Ferry", specialty: 'Internal Medicine'},
      {id: 2, name: "Fanny Zemlak I", specialty: 'Orthopedics'},
      {id: 3, name: "Braxton Wuckert", specialty: 'Gastroenterology'},
      {id: 4, name: "Johathan Hyatt DDS", specialty: 'Dentistry'},
      {id: 5, name: "Devon Kerluke", specialty: 'Family Medicine'},
      {id: 6, name: "Evie Macejkovic", specialty: 'Family Medicine'},
      {id: 7, name: "Rossie Jacobi", specialty: 'Internal Medicine'},
      {id: 8, name: "Elenora Jakubowski", specialty: 'Podiatry'},
      {id: 9, name: "Macey Yost", specialty: 'Dermatology'},
      {id: 10, name: "Efren McClure", specialty: 'Opthalmology'},
      {id: 11, name: "Althea Bashirian", specialty: 'Pediatric Medicine'},
      {id: 12, name: "Laurie Wiza", specialty: 'Orthopedic Surgery'},
      {id: 13, name: "Ola Jerde", specialty: 'Cardiology'},
      {id: 14, name: "Leann Bauch", specialty: 'Neurology'},
      {id: 15, name: "Maggie Medhurst", specialty: 'Family Medicine'}
    ],
    drugs: [
      {id: 45, name: 'benadryl'},
      {id: 66, name: 'aspirin'},
      {id: 89, name: 'ranitidine'},
      {id: 82, name: 'fluticasone'},
      {id: 47, name: 'acetaminophen'}
    ],
    facilities: [
      {id: 345, name: 'Massachusetts General Hospital'},
      {id: 1124, name: 'Rhode Island Hospital'},
      {id: 7712, name: 'Rhode Island Medical Imaging'},
      {id: 1124, name: 'Sturdy Memorial Hospital'},
      {id: 9752, name: 'Cedars Sinai Hospital '}
    ]
  }
  
})();

