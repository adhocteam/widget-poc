var WidgetApp = WidgetApp || {};
(function(){

  var routes = {
    plans: {'id': 'plan-page', 'default': 'plans-page'},
    doctors: {controller: 'doctors'},
    scrips: {controller: 'scrips'},
    facilities: {controller: 'facilities'},
    'default': 'home-page',
    'home': 'home-page'
  }
  
  var routeFunction = function(collection, id, action){
    var baseRoute = routes[collection] || routes['default'];
    if (baseRoute.controller){
      WidgetApp.controllers[baseRoute.controller].init();
    } else if (id && baseRoute.id) {
      var ids = id.toString().split(',');
      if (ids.length == 1){
        riot.mount('body', baseRoute.id, {id: id});
      } else {
        riot.mount('body', baseRoute['default'], {ids: ids});
      }
    } else {
      riot.mount('body', baseRoute);
    }
  };
  
  WidgetApp.routes = {}

  WidgetApp.routes.handleRouteTo = function(data){
    if (data.planID){
      riot.route('plans/'+data.planID);
    } else if (data.section){
      riot.route(''+data.section);
    } else {
      riot.route('home');
    }
  }
  
  WidgetApp.routes.bind = function(){
    riot.route.exec(routeFunction);
    riot.route(routeFunction);
  }
})();

