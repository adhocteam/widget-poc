var WidgetApp = WidgetApp || {};
(function(){
  WidgetApp.store = WidgetApp.store || {};
  var store = WidgetApp.store;
  
  store.checkCoverage = function(planId, data){
    // Consider it covered if the planId and the entity id share any chars
    var planChars = planId.toString().split('');
    return _.mapObject(data, function(list, type){
      var array = 
          _.map(list, function(entity){
            var idChars = entity.id.toString().split('');
            var found = !!(_.intersection(planChars, idChars).length)
            return [entity.id, {covered: found, name: entity.name}]
          })
      return _.object(array);
    });
  }
  
  store.rolledUpCoverageFor = function(id){
    return this.rollUpCoverage(this.coverageFor(id));
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
    var tokens = _.compact(query.toLowerCase().split(/\W/));
    var results = _.mapObject(store.stubData, function(value, key){
      return _.filter(value, function(entity){
        var matchables = _.map(_.compact([entity.name, entity.specialty]), function(m){
          return m.toLowerCase();
        });
        var tokenMatches = function(token){
          return orStream(
            matchables, _.partial(hasMatch, _, token)
          )
        }
        return andStream(tokens, tokenMatches)
      })
    })
    return results
  }
  
  store.getMyEntities = function(){
    return {
      doctors: this.doctorCollection.data,
      scrips: this.scripCollection.data,
      facilities: this.facilityCollection.data
    }
  }

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

