/**
 * @name vanilla-modal
 * @version 1.1.2
 * @author Ben Ceglowski
 * @url http://phuse.ca
 * @date 2015-04-17
 * @license MIT
 */;"use strict";var _prototypeProperties=function(a,b,c){b&&Object.defineProperties(a,b),c&&Object.defineProperties(a.prototype,c)},VanillaModal=function(){function a(a){this.$$={modal:".modal",modalInner:".modal-inner",modalContent:".modal-content",open:'[rel="modal:open"]',close:'[rel="modal:close"]',page:"body","class":"modal-visible",loadClass:"vanilla-modal",clickOutside:!0,closeKey:27,transitions:!0,transitionEnd:null,onBeforeOpen:function(){},onBeforeClose:function(){},onOpen:function(){},onClose:function(){}},this._applyUserSettings(a),this.error=!1,this.isOpen=!1,this.current=null,this.open=this._open.bind(this),this.close=this._close.bind(this),this.$$.transitionEnd=this._transitionEndVendorSniff(),this.$=this._setupDomNodes(),this.error?console.error("Please fix errors before proceeding."):(this._addLoadedCssClass(),this._events().add())}return _prototypeProperties(a,null,{_applyUserSettings:{value:function(a){if("object"==typeof a)for(var b in a)a.hasOwnProperty(b)&&(this.$$[b]=a[b])},writable:!0,enumerable:!0,configurable:!0},_transitionEndVendorSniff:{value:function(){if(this.$$.transitions!==!1){var a=document.createElement("div"),b={transition:"transitionend",OTransition:"otransitionend",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(var c in b)if(b.hasOwnProperty(c)&&void 0!==a.style[c])return b[c]}},writable:!0,enumerable:!0,configurable:!0},_getNode:{value:function(a,b){var c=b||document,d=c.querySelector(a);return d?d:(this.error=!0,console.error(a+" not found in document."))},writable:!0,enumerable:!0,configurable:!0},_setupDomNodes:{value:function(){var a={};return a.modal=this._getNode(this.$$.modal),a.page=this._getNode(this.$$.page),a.modalInner=this._getNode(this.$$.modalInner,this.modal),a.modalContent=this._getNode(this.$$.modalContent,this.modal),a},writable:!0,enumerable:!0,configurable:!0},_addLoadedCssClass:{value:function(){this._addClass(this.$.page,this.$$.loadClass)},writable:!0,enumerable:!0,configurable:!0},_addClass:{value:function(a,b){if(a instanceof HTMLElement!=!1){var c=a.className.split(" ");-1===c.indexOf(b)&&c.push(b),a.className=c.join(" ")}},writable:!0,enumerable:!0,configurable:!0},_removeClass:{value:function(a,b){if(a instanceof HTMLElement!=!1){var c=a.className.split(" ");c.indexOf(b)>-1&&c.splice(c.indexOf(b),1),a.className=c.join(" ")}},writable:!0,enumerable:!0,configurable:!0},_setOpenId:{value:function(){var a=this.current.id||"anonymous";this.$.page.setAttribute("data-current-modal",a)},writable:!0,enumerable:!0,configurable:!0},_removeOpenId:{value:function(){this.$.page.removeAttribute("data-current-modal")},writable:!0,enumerable:!0,configurable:!0},_getElementContext:{value:function(a){return a&&"string"==typeof a.hash?document.querySelector(a.hash):"string"==typeof a?document.querySelector(a):console.error("No selector supplied to open()")},writable:!0,enumerable:!0,configurable:!0},_open:{value:function(a){return this._releaseNode(),this.current=this._getElementContext(a),this.current instanceof HTMLElement==!1?console.error("VanillaModal target must exist on page."):("function"==typeof this.$$.onBeforeOpen&&this.$$.onBeforeOpen.call(this),this._captureNode(),this._addClass(this.$.page,this.$$["class"]),this._setOpenId(),this.isOpen=!0,void("function"==typeof this.$$.onOpen&&this.$$.onOpen.call(this)))},writable:!0,enumerable:!0,configurable:!0},_detectTransition:{value:function(){var a=window.getComputedStyle(this.$.modal,null),b=["transitionDuration","oTransitionDuration","MozTransitionDuration","webkitTransitionDuration"],c=b.filter(function(b){return"string"==typeof a[b]&&parseFloat(a[b])>0?!0:void 0});return c.length?!0:!1},writable:!0,enumerable:!0,configurable:!0},_close:{value:function(a){"function"==typeof this.$$.onBeforeClose&&this.$$.onBeforeClose.call(this),this._removeClass(this.$.page,this.$$["class"]);var b=this._detectTransition();this.$$.transitions&&this.$$.transitionEnd&&b?this._closeModalWithTransition():this._closeModal()},writable:!0,enumerable:!0,configurable:!0},_closeModal:{value:function(){this._removeOpenId(this.$.page),this._releaseNode(),this.isOpen=!1,this.current=null,"function"==typeof this.$$.onClose&&this.$$.onClose.call(this)},writable:!0,enumerable:!0,configurable:!0},_closeModalWithTransition:{value:function(){var a=function(){this.$.modal.removeEventListener(this.$$.transitionEnd,a),this._closeModal()}.bind(this);this.$.modal.addEventListener(this.$$.transitionEnd,a)},writable:!0,enumerable:!0,configurable:!0},_captureNode:{value:function(){for(;this.current.childNodes.length>0;)this.$.modalContent.appendChild(this.current.childNodes[0])},writable:!0,enumerable:!0,configurable:!0},_releaseNode:{value:function(){for(;this.$.modalContent.childNodes.length>0;)this.current.appendChild(this.$.modalContent.childNodes[0])},writable:!0,enumerable:!0,configurable:!0},_closeKeyHandler:{value:function(a){"number"==typeof this.$$.closeKey&&a.which===this.$$.closeKey&&this.isOpen===!0&&(a.preventDefault(),this.close())},writable:!0,enumerable:!0,configurable:!0},_outsideClickHandler:{value:function(a){if(this.$$.clickOutside===!0){for(var b=a.target;b!=document.body;){if(b===this.$.modalInner)return;b=b.parentNode}this.close()}},writable:!0,enumerable:!0,configurable:!0},_matches:{value:function(a,b){for(var c=a.target,d=(c.document||c.ownerDocument).querySelectorAll(b),e=0;e<d.length;e++)for(var f=c;f!==document.body;){if(f===d[e])return f;f=f.parentNode}return null},writable:!0,enumerable:!0,configurable:!0},_delegateOpen:{value:function(a){var b=this._matches(a,this.$$.open);return b?(a.preventDefault(),this.open(b)):void 0},writable:!0,enumerable:!0,configurable:!0},_delegateClose:{value:function(a){return this._matches(a,this.$$.close)?(a.preventDefault(),this.close()):void 0},writable:!0,enumerable:!0,configurable:!0},_events:{value:function(){var a=this._closeKeyHandler.bind(this),b=this._outsideClickHandler.bind(this),c=this._delegateOpen.bind(this),d=this._delegateClose.bind(this),e=function(){this.$.modal.addEventListener("click",b),document.addEventListener("keydown",a),document.addEventListener("click",c),document.addEventListener("click",d)};return this.destroy=function(){this.close(),this.$.modal.removeEventListener("click",b),document.removeEventListener("keydown",a),document.removeEventListener("click",c),document.removeEventListener("click",d)},{add:e.bind(this)}},writable:!0,enumerable:!0,configurable:!0}}),a}();!function(){"function"==typeof define&&define.amd?define("VanillaModal",function(){return VanillaModal}):"undefined"!=typeof module&&module.exports?module.exports=VanillaModal:window.VanillaModal=VanillaModal}();
var bindBehavior = function(){
  (function(){

    var modalBox = document.createElement('div');
    modalBox.className = 'modal'
    modalBox.innerHTML = '<div class="modal-inner"><a rel="modal:close">Close</a><div class="modal-content"></div></div>';
    
    var modalContainer = document.createElement('div');
    modalContainer.id = 'iFrameWidget';
    modalContainer.style.display = 'none';
    document.body.appendChild(modalBox);
    document.body.appendChild(modalContainer);
    
    var modal = new VanillaModal({
      onBeforeClose: function(){
        this['$'].modalContent.innerHTML = null;
      },
      onOpen: function(){
        this['$'].modalContent.innerHTML = modalContainer.getAttribute('contentToLoad');
      }
    });

    document.querySelector('body').addEventListener('click', function(event) {
      if (event.target.attributes['data-modal']) {
        var modalData = event.target.getAttribute('data-modal');
        var iFrameSrc = "embed.html?input="+modalData;
        var iFrame = '<iframe src="'+iFrameSrc+'"></iframe>';
        modalContainer.setAttribute('contentToLoad', iFrame);
        modal.open('#' +modalContainer.id);
      }
    });
    
    window.addEventListener("message", function(event){
      var payload;
      try {
        payload = JSON.parse(event.data);
      } catch(err) {
        payload = {};
      }
      event.source.postMessage(JSON.stringify({reply: "Hello back from the parent"}), '*');
      var messageContainer = document.createElement('div');
      messageContainer.innerHTML = "<p>The iFrame said:</p>"+payload.init+"</div>";
      document.body.appendChild(messageContainer);
    }, false);
  })();
};
