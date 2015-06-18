"use strict";var _prototypeProperties=function(e,t,n){t&&Object.defineProperties(e,t),n&&Object.defineProperties(e.prototype,n)},VanillaModal=function(){function e(e){this.$$={modal:".modal",modalInner:".modal-inner",modalContent:".modal-content",open:'[rel="modal:open"]',close:'[rel="modal:close"]',page:"body","class":"modal-visible",loadClass:"vanilla-modal",clickOutside:!0,closeKey:27,transitions:!0,transitionEnd:null,onBeforeOpen:function(){},onBeforeClose:function(){},onOpen:function(){},onClose:function(){}},this._applyUserSettings(e),this.error=!1,this.isOpen=!1,this.current=null,this.open=this._open.bind(this),this.close=this._close.bind(this),this.$$.transitionEnd=this._transitionEndVendorSniff(),this.$=this._setupDomNodes(),this.error?console.error("Please fix errors before proceeding."):(this._addLoadedCssClass(),this._events().add())}return _prototypeProperties(e,null,{_applyUserSettings:{value:function(e){if("object"==typeof e)for(var t in e)e.hasOwnProperty(t)&&(this.$$[t]=e[t])},writable:!0,enumerable:!0,configurable:!0},_transitionEndVendorSniff:{value:function(){if(this.$$.transitions!==!1){var e=document.createElement("div"),t={transition:"transitionend",OTransition:"otransitionend",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(var n in t)if(t.hasOwnProperty(n)&&void 0!==e.style[n])return t[n]}},writable:!0,enumerable:!0,configurable:!0},_getNode:{value:function(e,t){var n=t||document,i=n.querySelector(e);return i?i:(this.error=!0,console.error(e+" not found in document."))},writable:!0,enumerable:!0,configurable:!0},_setupDomNodes:{value:function(){var e={};return e.modal=this._getNode(this.$$.modal),e.page=this._getNode(this.$$.page),e.modalInner=this._getNode(this.$$.modalInner,this.modal),e.modalContent=this._getNode(this.$$.modalContent,this.modal),e},writable:!0,enumerable:!0,configurable:!0},_addLoadedCssClass:{value:function(){this._addClass(this.$.page,this.$$.loadClass)},writable:!0,enumerable:!0,configurable:!0},_addClass:{value:function(e,t){if(e instanceof HTMLElement!=!1){var n=e.className.split(" ");-1===n.indexOf(t)&&n.push(t),e.className=n.join(" ")}},writable:!0,enumerable:!0,configurable:!0},_removeClass:{value:function(e,t){if(e instanceof HTMLElement!=!1){var n=e.className.split(" ");n.indexOf(t)>-1&&n.splice(n.indexOf(t),1),e.className=n.join(" ")}},writable:!0,enumerable:!0,configurable:!0},_setOpenId:{value:function(){var e=this.current.id||"anonymous";this.$.page.setAttribute("data-current-modal",e)},writable:!0,enumerable:!0,configurable:!0},_removeOpenId:{value:function(){this.$.page.removeAttribute("data-current-modal")},writable:!0,enumerable:!0,configurable:!0},_getElementContext:{value:function(e){return e&&"string"==typeof e.hash?document.querySelector(e.hash):"string"==typeof e?document.querySelector(e):console.error("No selector supplied to open()")},writable:!0,enumerable:!0,configurable:!0},_open:{value:function(e){return this._releaseNode(),this.current=this._getElementContext(e),this.current instanceof HTMLElement==!1?console.error("VanillaModal target must exist on page."):("function"==typeof this.$$.onBeforeOpen&&this.$$.onBeforeOpen.call(this),this._captureNode(),this._addClass(this.$.page,this.$$["class"]),this._setOpenId(),this.isOpen=!0,void("function"==typeof this.$$.onOpen&&this.$$.onOpen.call(this)))},writable:!0,enumerable:!0,configurable:!0},_detectTransition:{value:function(){var e=window.getComputedStyle(this.$.modal,null),t=["transitionDuration","oTransitionDuration","MozTransitionDuration","webkitTransitionDuration"],n=t.filter(function(t){return"string"==typeof e[t]&&parseFloat(e[t])>0?!0:void 0});return n.length?!0:!1},writable:!0,enumerable:!0,configurable:!0},_close:{value:function(e){"function"==typeof this.$$.onBeforeClose&&this.$$.onBeforeClose.call(this),this._removeClass(this.$.page,this.$$["class"]);var t=this._detectTransition();this.$$.transitions&&this.$$.transitionEnd&&t?this._closeModalWithTransition():this._closeModal()},writable:!0,enumerable:!0,configurable:!0},_closeModal:{value:function(){this._removeOpenId(this.$.page),this._releaseNode(),this.isOpen=!1,this.current=null,"function"==typeof this.$$.onClose&&this.$$.onClose.call(this)},writable:!0,enumerable:!0,configurable:!0},_closeModalWithTransition:{value:function(){var e=function(){this.$.modal.removeEventListener(this.$$.transitionEnd,e),this._closeModal()}.bind(this);this.$.modal.addEventListener(this.$$.transitionEnd,e)},writable:!0,enumerable:!0,configurable:!0},_captureNode:{value:function(){for(;this.current.childNodes.length>0;)this.$.modalContent.appendChild(this.current.childNodes[0])},writable:!0,enumerable:!0,configurable:!0},_releaseNode:{value:function(){for(;this.$.modalContent.childNodes.length>0;)this.current.appendChild(this.$.modalContent.childNodes[0])},writable:!0,enumerable:!0,configurable:!0},_closeKeyHandler:{value:function(e){"number"==typeof this.$$.closeKey&&e.which===this.$$.closeKey&&this.isOpen===!0&&(e.preventDefault(),this.close())},writable:!0,enumerable:!0,configurable:!0},_outsideClickHandler:{value:function(e){if(this.$$.clickOutside===!0){for(var t=e.target;t!=document.body;){if(t===this.$.modalInner)return;t=t.parentNode}this.close()}},writable:!0,enumerable:!0,configurable:!0},_matches:{value:function(e,t){for(var n=e.target,i=(n.document||n.ownerDocument).querySelectorAll(t),o=0;o<i.length;o++)for(var a=n;a!==document.body;){if(a===i[o])return a;a=a.parentNode}return null},writable:!0,enumerable:!0,configurable:!0},_delegateOpen:{value:function(e){var t=this._matches(e,this.$$.open);return t?(e.preventDefault(),this.open(t)):void 0},writable:!0,enumerable:!0,configurable:!0},_delegateClose:{value:function(e){return this._matches(e,this.$$.close)?(e.preventDefault(),this.close()):void 0},writable:!0,enumerable:!0,configurable:!0},_events:{value:function(){var e=this._closeKeyHandler.bind(this),t=this._outsideClickHandler.bind(this),n=this._delegateOpen.bind(this),i=this._delegateClose.bind(this),o=function(){this.$.modal.addEventListener("click",t),document.addEventListener("keydown",e),document.addEventListener("click",n),document.addEventListener("click",i)};return this.destroy=function(){this.close(),this.$.modal.removeEventListener("click",t),document.removeEventListener("keydown",e),document.removeEventListener("click",n),document.removeEventListener("click",i)},{add:o.bind(this)}},writable:!0,enumerable:!0,configurable:!0}}),e}();!function(){"function"==typeof define&&define.amd?define("VanillaModal",function(){return VanillaModal}):"undefined"!=typeof module&&module.exports?module.exports=VanillaModal:window.VanillaModal=VanillaModal}();
window.EmbedPOC.bindBehavior=function(){var e=document.createElement("div");e.className="modal",e.innerHTML='<div class="modal-inner"><a href="javascript:" rel="modal:close" aria-label="Close" class="close">&times;</a><div class="modal-content"></div></div>';var t=document.createElement("div");t.id="iFrameWidget",t.style.display="none",document.body.appendChild(e),document.body.appendChild(t);var n,a=new VanillaModal({onBeforeClose:function(){this.$.modalContent.innerHTML&&(this.$.modalContent.innerHTML=null)},onOpen:function(){this.$.modalContent.innerHTML=t.getAttribute("data-content-to-load")}});document.querySelector("body").addEventListener("click",function(e){if(e.target.getAttribute("data-modal")){var i=e.target.getAttribute("data-modal"),o="embed.html?input="+i,d='<iframe src="'+o+'"></iframe>';t.setAttribute("data-content-to-load",d),a.open("#"+t.id),n=i}}),window.addEventListener("message",function(e){var t;try{t=JSON.parse(e.data)}catch(a){t={}}if(e.source.postMessage(JSON.stringify({reply:"Hello back from the parent. In case you forgot, the thing I sent you earlier was: "+n}),"*"),t.init){var i=document.createElement("div");i.innerHTML="<p>The iFrame said:</p>"+t.init+"</div>",document.body.appendChild(i)}},!1)};