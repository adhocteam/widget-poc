if (location.href.match('fixtures=true')){
  var sendToStorage = function(key, data){
    localStorage[key] = JSON.stringify(data);
  }
  sendToStorage('doctors', [
    {id: 1, name: "Ephraim Ferry"},
    {id: 2, name: "Fanny Zemlak I"},
    {id: 3, name: "Braxton Wuckert"},
    {id: 9, name: "Macey Yost"},
    {id: 8, name: "Elenora Jakubowski"},
    {id: 6, name: "Evie Macejkovic"}
  ]);
  sendToStorage('scrips', [
    {id: 45, name: 'benadryl'},
    {id: 66, name: 'aspirin'},
    {id: 89, name: 'ranitidine'}
  ]);
  sendToStorage('facilities',[
    {id: 345, name: 'Massachusetts General Hospital'}
  ]);
}


