(function() {
  var __slice = [].slice;

  define(['oraculum'], function(Oraculum) {
    'use strict';

    /*
    Make Middleware Method
    ======================
    `makeMiddlewareMethod` is essentially the same as `makeEventedMethod`, however
    it allows the original method to be deferred, and fires an additional event to
    notify any listeners that the method has been deferred.
    
    @see extensions/make-evented-method.coffee
    
    @param {Object} object The object that contains the targeted method.
    @param {String} method The targeted method name on `object`.
    @param {Object} emitter? The object that contains the event firing mechanism. (defaults to `object`)
    @param {String} trigger? The method name of the event firing method of `emitter`. (defaults to 'trigger')
    @param {String} eventPrefix? An optional string to prefix on the event name.
     */
    return Oraculum.define('makeMiddlewareMethod', (function() {
      return function(object, methodName, emitter, trigger, eventPrefix) {
        var fireEvent, middleware, original;
        if (emitter == null) {
          emitter = object;
        }
        if (trigger == null) {
          trigger = 'trigger';
        }
        if (eventPrefix == null) {
          eventPrefix = '';
        }
        original = object[methodName];
        if (!original) {
          return typeof console !== "undefined" && console !== null ? typeof console.warn === "function" ? console.warn("Attempted to event undefined method " + methodName + " of " + object) : void 0 : void 0;
        }
        if (original.middleware) {
          return;
        }
        fireEvent = emitter[trigger];
        if (typeof original !== 'function') {
          throw new TypeError("Method " + methodName + " does not exist on object");
        }
        if (typeof fireEvent !== 'function') {
          throw new TypeError("Method " + trigger + " does not exist on emitter");
        }
        if (eventPrefix && !/:$/.test(eventPrefix)) {
          if (eventPrefix == null) {
            eventPrefix = ':';
          }
        }

        /*
        Create our new middleware method.
        
        __fires__ `<emitter>#[eventPrefix:]<methodName>:middleware:before`
        
        __fires__ `<emitter>#[eventPrefix:]<methodName>:middleware:after`
         */
        middleware = object[methodName] = function() {
          var args, proxy, resolve;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];

          /*
          Create our `proxy` object. This object will be passed by reference
          through our events, allowing its properties to be mutated in memory
          by any listener that receives it.
           */
          proxy = {
            type: 'middleware_proxy',
            wait: false,
            abort: false,
            result: void 0
          };
          fireEvent.call.apply(fireEvent, [emitter, "" + eventPrefix + ":" + methodName + ":middleware:before"].concat(__slice.call(args), [proxy], [emitter], [object]));

          /*
          Allow the implementation to be aborted, passing back whatever the
          current value of `proxy.result` is at that point.
          This allows the method's implementation to be completely bypassed and
          controlled by any arbitrary event listener.
          This can result in unexpected behavior if used incorrectly or ambiguously.
          Code carefully.
           */
          if (proxy.abort === true) {
            return proxy.result;
          }
          resolve = function() {
            proxy.result = original.call.apply(original, [object].concat(__slice.call(args)));
            return fireEvent.call.apply(fireEvent, [emitter, "" + eventPrefix + ":" + methodName + ":middleware:after"].concat(__slice.call(args), [proxy], [emitter], [object]));
          };
          if (proxy.wait === true) {
            proxy.dfd = new $.Deferred();
            proxy.promise = proxy.dfd.promise();
            proxy.promise.then(resolve);
            fireEvent.call.apply(fireEvent, [emitter, "" + eventPrefix + ":" + methodName + ":middleware:defer"].concat(__slice.call(args), [proxy], [emitter], [object]));
          } else {
            resolve();
          }
          return proxy.result;
        };
        middleware.middleware = true;
        return middleware.original = original;
      };
    }), {
      singleton: true
    });
  });

}).call(this);
