(function() {
  //makes this global
  //put left side as shorthand instead of window.$l
  var $l = window.$l = function(arg) {
    if (arg instanceof HTMLElement) {
      return new DOMNodeCollection([arg]);
    } else if (arg instanceof Function) {
      if (document.readyState === "complete") {
        arg();
      }else {
        document.addEventListener("DOMContentLoaded", arg);
      }
    } else {
      var elementList = document.querySelectorAll(arg);
      elementList = makeArray(elementList);
      return new DOMNodeCollection(elementList);
    }
  };

  var DOMNodeCollection = function (htmlElements) {
      this.htmlElements = htmlElements;
  };

  DOMNodeCollection.prototype.html = function(str){
    if (typeof(str) === "undefined") {
      if (typeof this.htmlElements === "undefined"){
        return null;
      } else {
        return this.htmlElements[0].innerHTML;
      }
    }
    else {
      this.htmlElements.forEach(function(element){
        element.innerHTML = str;
      });
    }
  };

  DOMNodeCollection.prototype.empty = function(){
    this.html("");
  };

  DOMNodeCollection.prototype.append = function(arg){
    if (arg instanceof DOMNodeCollection) {
      arg.htmlElements.forEach(this.append.bind(this));
    } else if (typeof(arg) === "string") {
      this.htmlElements.forEach(function(el){
        el.innerHTML += arg;
      });
    } else if (arg instanceof HTMLElement) {
      if (this.htmlElements.length > 0) {
        this.htmlElements[0].appendChild(arg);

        for (var i = 1; i < this.htmlElements.length; i++) {
          this.htmlElements[i].innerHTML += arg.outerHTML;
        }
      }
    }
  };

  DOMNodeCollection.prototype.attr = function (attribute, value) {
    if (this.htmlElements.length > 0) {
      if (typeof(value) === "undefined") {
        return this.htmlElements[0].getAttribute(attribute);
      }
      else {
        this.htmlElements.forEach(function(el){
          el.setAttribute(attribute, value);
        });
      }
    }
  };

  DOMNodeCollection.prototype.addClass = function (className) {
    this.htmlElements.forEach(function(el){
      if (!el.classList.contains(className)) {
        el.className += (" " + className);
      }
    });
  };

  DOMNodeCollection.prototype.removeClass = function (className) {
    this.htmlElements.forEach(function(el) {
      el.className = el.className.split(" ").filter(function (cl) {
        return cl !== className;
      }).join(" ");
    });
  };

  //TRAVERSAL
  DOMNodeCollection.prototype.children = function(){
    var children = flatMap(this.htmlElements, function(el) {
        return makeArray(el.children);
    });

    return new DOMNodeCollection(children);
  };

  DOMNodeCollection.prototype.parent = function(){
    var parent = this.htmlElements.reduce(function(accum, el){
      if (!accum.includes(el.parentElement)) {
        accum.push(el.parentElement);
      }
      return accum;
    }, []);

    return new DOMNodeCollection(parent);
  };

  DOMNodeCollection.prototype.find = function(selector){
    return flatMap(this.htmlElements, function(el){
      return makeArray(el.querySelectorAll(selector));
    });
  };

  DOMNodeCollection.prototype.remove = function() {
    this.htmlElements.forEach(function(el){
      el.remove();
    });

    this.htmlElements = [];
  };


  //EVENT HANDLING
  DOMNodeCollection.prototype.on = function(event, handler){
    this.htmlElements.forEach(function(el){
      //addEventListener
      el.addEventListener(event, handler);
    });
  };

  DOMNodeCollection.prototype.off = function(event, handler){
    this.htmlElements.forEach(function(el){
      el.removeEventListener(event, handler);
    });
  };

  //HELPER FUNCTIONS
  var makeArray = function(notArr){
    return Array.prototype.slice.call(notArr);
  };

  var flatMap = function(arr, callback) {
    return arr.reduce(function(accum, el){
      return accum.concat(callback(el));
    }, []);
  };


})();
