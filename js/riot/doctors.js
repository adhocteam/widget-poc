riot.tag('doctors-page', '<h3>Doctors</h3><ul if="{collection.length}"><li each="{collection}"> {name} <a href="javascript:" onclick="{remove}">X</a></li></ul><div if="{!collection.length}"> No doctors added! </div>', function(opts) {
    WidgetApp.controllers['doctors'].init(this);
  
});
