var extractPayload= function(event){
    // Only accept same-origin messages for now
  if (event.origin != window.location.origin) return {};
  try {
    var payload = JSON.parse(event.data);
    return payload;
  } catch(err) {
    return {};
  }
    
}
