if (location.href.match('fixtures=true')){
  var sendToStorage = function(key, data){
    localStorage[key] = JSON.stringify(data);
  }
  sendToStorage('doctors', [
    {id: 1, name: 'Doctor A'},
    {id: 2, name: 'Doctor B'},
    {id: 3, name: 'Doctor C'},
    {id: 9, name: 'Doctor D'},
    {id: 8, name: 'Doctor E'},
    {id: 6, name: 'Doctor F'}
  ]);
  sendToStorage('scrips', [
    {id: 45, name: 'benadryl'},
    {id: 66, name: 'aspirin'},
    {id: 89, name: 'ranitidine'}
  ]);
  sendToStorage('facilities',[
    {id: 345, name: 'A Place'}
  ]);
}
