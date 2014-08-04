(function() {
  var __slice = [].slice;

  define(['oraculum'], function(Oraculum) {
    'use strict';

    /*
    Make Evented Method
    ===================
    This function is the heart and soul of our dynamic AOP-based decoupling.
    This function will override any method of any object, replacing it with a
    method that executes a callback both before and after executing the original
    implementaion, and finally returning the result of the implementation
    back to the caller.
    
    It theoretically supports any eventing mechanism through the `emitter` and
    `trigger` options, as well as supporting the ability to `abort` the
    execution of the original implementation and change it's `result`.
    
    @param {Object} object The object that contains the targeted method.
    @param {String} method The targeted method name on `object`.
    @param {Object} emitter? The object that contains the event firing mechanism. (defaults to `object`)
    @param {String} trigger? The method name of the event firing method of `emitter`. (defaults to 'trigger')
    @param {String} eventPrefix? An optional string to prefix on the event name.
     */
    return Oraculum.define('makeEventedMethod', (function() {
      return function(object, methodName, emitter, trigger, eventPrefix) {
        var evented, fireEvent, original;
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
          return typeof console !== "undefined" && console !== null ? typeof console.warn === "function" ? console.warn("Attempted to event undefined method " + method + " of " + object) : void 0 : void 0;
        }
        if (original.evented) {
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
        Create our new evented method.
        
        __fires__ `<emitter>#[eventPrefix:]<methodName>:before`
        
        __fires__ `<emitter>#[eventPrefix:]<methodName>:after`
         */
        evented = object[methodName] = function() {

          /*
          Create our `proxy` object. This object will be passed by reference
          through our events, allowing its properties to be mutated in memory
          by any listener that receives it.
           */
          var proxy;
          proxy = {
            type: 'evented_proxy',
            abort: false,
            result: void 0
          };
          fireEvent.call.apply(fireEvent, [emitter, "" + eventPrefix + methodName + ":before"].concat(__slice.call(arguments), [proxy], [emitter], [object]));

          /*
          Allow the implementation to be aborted, passing back whatever the
          current value of `proxy.result` is at that point.
          This allows the method's implementation to be completely bypassed and
          controlled by any arbitrary event listener.
          This can result in unexpected behavior if used ambiguously.
          Code carefully.
           */
          if (proxy.abort === true) {
            return proxy.result;
          }
          proxy.result = original.apply(object, arguments);
          fireEvent.call.apply(fireEvent, [emitter, "" + eventPrefix + methodName + ":after"].concat(__slice.call(arguments), [proxy], [emitter], [object]));
          return proxy.result;
        };
        evented.evented = true;
        return evented.original = original;
      };
    }), {
      singleton: true
    });
  });

}).call(this);
