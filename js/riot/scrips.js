riot.tag('scrips-page', '<h3>Prescriptions</h3><ul if="{collection.length}"><li each="{collection}"> {name} <a href="javascript:" onclick="{remove}">X</a></li></ul><div if="{!collection.length}"> No prescriptions added! </div>', function(opts) {
    WidgetApp.controllers['scrips'].init(this);
  
});
