// IE polyfill
var wl = window.location;
if (!wl.origin) {
  wl.origin = wl.protocol + "//" + wl.hostname + (wl.port ? ':' + wl.port: '');
}
