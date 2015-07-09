riot.tag('doctors-page', '<h3>Doctors</h3><ul><li each="{collection}"> {name} <a href="javascript:" onclick="{remove}">X</a></li></ul>', function(opts) {
    this.collection = opts.collection.data
    this.remove = function(e) {
      this.trigger('remove', e.item.id)
    }.bind(this);
  
});
