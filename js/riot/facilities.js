riot.tag('facilities-page', '<h3>Facilities</h3><ul if="{collection.length}"><li each="{collection}"> {name} <a href="javascript:" onclick="{remove}">X</a></li></ul><div if="{!collection.length}"> No facilities added! </div>', function(opts) {
    WidgetApp.controllers['facilities'].init(this);
  
});
