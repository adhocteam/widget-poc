riot.tag('coverage-set', '<h4 if="{!_.isEmpty(opts.collection)}">{opts.title} {opts.rollup.covered}/{opts.rollup.total}</h4><ul if="{!_.isEmpty(opts.collection)}"><li> Name <span class="coverage">Covered?</span></li><li each="{key, value in opts.collection}"> {value.name} <span class="coverage:true covered:item.covered"> {value.covered ? \'Yes\' : \'No\'} </span></li></ul>', function(opts) {

});
