var WidgetApp = WidgetApp || {};
(function(){

  var routes = {
    plans: {'id': 'plan-page', 'default': 'plans-page'},
    list: 'list',
    search: 'search-panel',
    'default': 'home-page',
    'home': 'home-page'
  }
  
  var routeFunction = function(collection, id, action){
    var baseRoute = routes[collection] || routes['default'];
    var mounted;
    if (id && baseRoute.id) {
      var ids = id.toString().split(',');
      if (ids.length == 1){
        mounted = riot.mount('body', baseRoute.id, {id: id})[0];
      } else {
        mounted = riot.mount('body', baseRoute['default'], {ids: ids})[0];
      }
    } else {
      mounted = riot.mount('body', baseRoute)[0];
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

