// IE polyfill
var wl = window.location;
if (!wl.origin) {
  wl.origin = wl.protocol + "//" + wl.hostname + (wl.port ? ':' + wl.port: '');
}

"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

/**
 * @class VanillaModal
 * @version 1.1.2
 * @author Ben Ceglowski
 */
var VanillaModal = (function () {
  /**
   * @param {Object} [userSettings]
   */
  function VanillaModal(userSettings) {
    this.$$ = {
      modal: ".modal",
      modalInner: ".modal-inner",
      modalContent: ".modal-content",
      open: "[rel=\"modal:open\"]",
      close: "[rel=\"modal:close\"]",
      page: "body",
      "class": "modal-visible",
      loadClass: "vanilla-modal",
      clickOutside: true,
      closeKey: 27,
      transitions: true,
      transitionEnd: null,
      onBeforeOpen: function () {},
      onBeforeClose: function () {},
      onOpen: function () {},
      onClose: function () {}
    };

    this._applyUserSettings(userSettings);
    this.error = false;
    this.isOpen = false;
    this.current = null;
    this.open = this._open.bind(this);
    this.close = this._close.bind(this);
    this.$$.transitionEnd = this._transitionEndVendorSniff();
    this.$ = this._setupDomNodes();

    if (!this.error) {
      this._addLoadedCssClass();
      this._events().add();
    } else {
      console.error("Please fix errors before proceeding.");
    }
  }

  _prototypeProperties(VanillaModal, null, {
    _applyUserSettings: {

      /**
       * @param {Object} userSettings
       */
      value: function ApplyUserSettings(userSettings) {
        if (typeof userSettings === "object") {
          for (var i in userSettings) {
            if (userSettings.hasOwnProperty(i)) {
              this.$$[i] = userSettings[i];
            }
          }
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _transitionEndVendorSniff: {
      value: function TransitionEndVendorSniff() {
        if (this.$$.transitions === false) return;
        var el = document.createElement("div");
        var transitions = {
          transition: "transitionend",
          OTransition: "otransitionend",
          MozTransition: "transitionend",
          WebkitTransition: "webkitTransitionEnd"
        };
        for (var i in transitions) {
          if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
            return transitions[i];
          }
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _getNode: {

      /**
       * @param {String} selector
       * @param {Node} parent
       */
      value: function GetNode(selector, parent) {
        var targetNode = parent || document;
        var node = targetNode.querySelector(selector);
        if (!node) {
          this.error = true;
          return console.error(selector + " not found in document.");
        }
        return node;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _setupDomNodes: {
      value: function SetupDomNodes() {
        var $ = {};
        $.modal = this._getNode(this.$$.modal);
        $.page = this._getNode(this.$$.page);
        $.modalInner = this._getNode(this.$$.modalInner, this.modal);
        $.modalContent = this._getNode(this.$$.modalContent, this.modal);
        return $;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _addLoadedCssClass: {
      value: function AddLoadedCssClass() {
        this._addClass(this.$.page, this.$$.loadClass);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _addClass: {

      /**
       * @param {Node} el
       * @param {String} className
       */
      value: function AddClass(el, className) {
        if (el instanceof HTMLElement === false) return;
        var cssClasses = el.className.split(" ");
        if (cssClasses.indexOf(className) === -1) {
          cssClasses.push(className);
        }
        el.className = cssClasses.join(" ");
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _removeClass: {

      /**
       * @param {Node} el
       * @param {String} className
       */
      value: function RemoveClass(el, className) {
        if (el instanceof HTMLElement === false) return;
        var cssClasses = el.className.split(" ");
        if (cssClasses.indexOf(className) > -1) {
          cssClasses.splice(cssClasses.indexOf(className), 1);
        }
        el.className = cssClasses.join(" ");
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _setOpenId: {
      value: function SetOpenId() {
        var id = this.current.id || "anonymous";
        this.$.page.setAttribute("data-current-modal", id);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _removeOpenId: {
      value: function RemoveOpenId() {
        this.$.page.removeAttribute("data-current-modal");
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _getElementContext: {

      /**
       * @param {mixed} e
       */
      value: function GetElementContext(e) {
        if (e && typeof e.hash === "string") {
          return document.querySelector(e.hash);
        } else if (typeof e === "string") {
          return document.querySelector(e);
        } else {
          return console.error("No selector supplied to open()");
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _open: {

      /**
       * @param {Event} e
       */
      value: function Open(e) {
        this._releaseNode();
        this.current = this._getElementContext(e);
        if (this.current instanceof HTMLElement === false) return console.error("VanillaModal target must exist on page.");
        if (typeof this.$$.onBeforeOpen === "function") this.$$.onBeforeOpen.call(this);
        this._captureNode();
        this._addClass(this.$.page, this.$$["class"]);
        this._setOpenId();
        this.isOpen = true;
        if (typeof this.$$.onOpen === "function") this.$$.onOpen.call(this);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _detectTransition: {
      value: function DetectTransition() {
        var css = window.getComputedStyle(this.$.modal, null);
        var transitionDuration = ["transitionDuration", "oTransitionDuration", "MozTransitionDuration", "webkitTransitionDuration"];
        var hasTransition = transitionDuration.filter(function (i) {
          if (typeof css[i] === "string" && parseFloat(css[i]) > 0) {
            return true;
          }
        });
        return hasTransition.length ? true : false;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _close: {

      /**
       * @param {Event} e
       */
      value: function Close(e) {
        if (typeof this.$$.onBeforeClose === "function") this.$$.onBeforeClose.call(this);
        this._removeClass(this.$.page, this.$$["class"]);
        var transitions = this._detectTransition();
        if (this.$$.transitions && this.$$.transitionEnd && transitions) {
          this._closeModalWithTransition();
        } else {
          this._closeModal();
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _closeModal: {
      value: function CloseModal() {
        this._removeOpenId(this.$.page);
        this._releaseNode();
        this.isOpen = false;
        this.current = null;
        if (typeof this.$$.onClose === "function") this.$$.onClose.call(this);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _closeModalWithTransition: {
      value: function CloseModalWithTransition() {
        var _closeTransitionHandler = (function () {
          this.$.modal.removeEventListener(this.$$.transitionEnd, _closeTransitionHandler);
          this._closeModal();
        }).bind(this);
        this.$.modal.addEventListener(this.$$.transitionEnd, _closeTransitionHandler);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _captureNode: {
      value: function CaptureNode() {
        while (this.current.childNodes.length > 0) {
          this.$.modalContent.appendChild(this.current.childNodes[0]);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _releaseNode: {
      value: function ReleaseNode() {
        while (this.$.modalContent.childNodes.length > 0) {
          this.current.appendChild(this.$.modalContent.childNodes[0]);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _closeKeyHandler: {

      /**
       * @param {Event} e
       */
      value: function CloseKeyHandler(e) {
        if (typeof this.$$.closeKey !== "number") return;
        if (e.which === this.$$.closeKey && this.isOpen === true) {
          e.preventDefault();
          this.close();
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _outsideClickHandler: {

      /**
       * @param {Event} e
       */
      value: function OutsideClickHandler(e) {
        if (this.$$.clickOutside !== true) return;
        var node = e.target;
        while (node != document.body) {
          if (node === this.$.modalInner) return;
          node = node.parentNode;
        }
        this.close();
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _matches: {

      /**
       * @param {Event} e
       * @param {String} selector
       */
      value: function Matches(e, selector) {
        var el = e.target;
        var matches = (el.document || el.ownerDocument).querySelectorAll(selector);
        for (var i = 0; i < matches.length; i++) {
          var child = el;
          while (child !== document.body) {
            if (child === matches[i]) return child;
            child = child.parentNode;
          }
        }
        return null;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _delegateOpen: {

      /**
       * @param {Event} e
       */
      value: function DelegateOpen(e) {
        var matches = this._matches(e, this.$$.open);
        if (matches) {
          e.preventDefault();
          return this.open(matches);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _delegateClose: {

      /**
       * @param {Event} e
       */
      value: function DelegateClose(e) {
        if (this._matches(e, this.$$.close)) {
          e.preventDefault();
          return this.close();
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _events: {

      /**
       * @private {Function} add
       */
      value: function Events() {
        var _closeKeyHandler = this._closeKeyHandler.bind(this);
        var _outsideClickHandler = this._outsideClickHandler.bind(this);
        var _delegateOpen = this._delegateOpen.bind(this);
        var _delegateClose = this._delegateClose.bind(this);

        var add = function () {
          this.$.modal.addEventListener("click", _outsideClickHandler);
          document.addEventListener("keydown", _closeKeyHandler);
          document.addEventListener("click", _delegateOpen);
          document.addEventListener("click", _delegateClose);
        };

        this.destroy = function () {
          this.close();
          this.$.modal.removeEventListener("click", _outsideClickHandler);
          document.removeEventListener("keydown", _closeKeyHandler);
          document.removeEventListener("click", _delegateOpen);
          document.removeEventListener("click", _delegateClose);
        };

        return {
          add: add.bind(this)
        };
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return VanillaModal;
})();

(function () {
  if (typeof define === "function" && define.amd) {
    define("VanillaModal", function () {
      return VanillaModal;
    });
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = VanillaModal;
  } else {
    window.VanillaModal = VanillaModal;
  }
})();
window.EmbedPOC.bindBehavior = function(){
  var body = document.body;
  var forEach = Array.prototype.forEach;
  
  var preloadResource = function(path){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path);
    xhr.send('');
  };
  var iFrame;
  var buildIframe = function(){
    
    iFrame = '<iframe aria-live="polite" src="embed.html"></iframe>';
  }
  
  var clickHandler = function(attribute, modal) {
    return function(event){
      var target = event.target,
          modalData = target.getAttribute(attribute);
      if (modalData) {
        var planID = target.getAttribute('data-plan-id');
        var section = target.getAttribute('data-section');
        modal.lastFocus = target;
        modal.fill(iFrame);
        modal.open({planID: planID, section: section});
        
      }
    }
  };

  var notifyPlans = function(sendFunc){
    var blocks = body.querySelectorAll('[data-my-coverage]');
    forEach.call(blocks, function(block){
      sendFunc.call(null, {
        planID: block.getAttribute('data-plan-id'),
        fips: block.getAttribute('data-fips-code'),
        zip: block.getAttribute('data-zip-code')
      });
    });
  }
  
  var messageHandler = function(output){
    return function(event){
      if (event.origin != window.location.origin) return;
      try {
        var payload = JSON.parse(event.data);
      } catch(err) {
        return;
      }
      var replyWith = function(payload){
        event.source.postMessage(JSON.stringify(payload), window.location.origin);
      }
      
      if (payload.init){
        notifyPlans(replyWith);
      } else if (payload.planData){
        for (var planID in payload.planData){
          var block = body.querySelectorAll('[data-plan-id="'+planID+'"]');
          if (block[0]){
            block[0].innerHTML = payload.planData[planID];
          }
        }
      } else if (payload.overlayContent){
        addOverlay(payload.overlayContent);
      }
    };
  };

  var buildModal = function(){
    var modalBox = document.createElement('div');

    modalBox.className = 'modal';
    modalBox.setAttribute('role','dialog');
    modalBox.setAttribute('aria-labelledby', 'iFrame');
    modalBox.innerHTML = '<div class="modal-inner"><a href="javascript:" rel="modal:close" aria-label="Close" class="close">&times;</a><div class="modal-content"></div></div>';

    var modalContainer = document.createElement('div');
    var attributes = {};
    modalContainer.id = 'iFrameWidget';
    modalContainer.style.display = 'none';
    body.appendChild(modalBox);
    body.appendChild(modalContainer);

    var vm = new VanillaModal({
      onBeforeClose: function(){
        if (this.$.modalContent.innerHTML){
          // If you just set it to null, IE gives it a null
          // child node, instead of an empty set of child nodes.
          this.$.modalContent.innerHTML = null;
        }
      },
      onClose: function(){
        if (modal.lastFocus){
          modal.lastFocus.focus();
          modal.lastFocus = null;
        }
      },
      onOpen: function(){
        var content=this.$.modalContent;
        content.innerHTML = content.getAttribute('data-content-to-load');
        content.querySelector('iframe').contentWindow.focus();
      },
      closeKey: 27
    });
    
    var modal = {
      setAttribute: function(attrName, value){
        attributes[attrName] = value;
      },
      open: function(){
        vm.open('#'+ modalContainer.id);
      },
      fill: function(content){
        vm.$.modalContent.setAttribute('data-content-to-load', content);
      }
    };
    return modal;
  };

  
  
  var addOverlay = function(content){
    var overlay = document.getElementsByClassName('widgetOverlay')[0];
    if (!overlay){
      var box = document.createElement('div');
      box.className = 'widgetOverlay';
      body.appendChild(box);
      overlay = box;
    }
    overlay.innerHTML = content;
  }
  
  buildIframe();
  var modal = buildModal();
  body.addEventListener('click', clickHandler('data-modal', modal));

  
  
  var iFramebox = document.createElement('div');
  iFramebox.style.display = 'none';
  iFramebox.innerHTML = iFrame;
  body.appendChild(iFramebox);
  var messageContainer = document.createElement('div');
  body.appendChild(messageContainer);
  window.addEventListener("message", messageHandler(messageContainer), false);
  
  
};
