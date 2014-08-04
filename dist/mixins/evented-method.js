(function() {
  var __slice = [].slice;

  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/evented', 'oraculum/extensions/make-evented-method'], function(Oraculum) {
    'use strict';
    var makeEventedMethod, _;
    _ = Oraculum.get('underscore');
    makeEventedMethod = Oraculum.get('makeEventedMethod');

    /*
    Make Evented Method
    ===================
    This mixin exposes the heart of our dynamic AOP-based decoupling.
    
    @see extensions/make-evented-method.coffee
     */
    return Oraculum.defineMixin('EventedMethod.Mixin', {

      /*
      Mixin Options
      -------------
      Allow the targeting of our instance methods to be evented using a mapping
      of method names and evented method spec as described in the examples below.
      
      @param {Object} eventedMethods Object containing the eventing map.
       */

      /*
      Mixinitialize
      -------------
      Invoke `@makeEventedMethods`.
      
      @see @makeEventedMethods
       */
      mixinitialize: function() {
        return this.makeEventedMethods();
      },

      /*
      Make Evented Methods
      --------------------
      Iterate over the eventing map, passing our method names and their eventing
      specs through to `@makeEventedMethod`.
      
      @see @makeEventedMethod
      
      @param {Array} eventingMap? An eventing map. Defaults to our configured eventing map.
       */
      makeEventedMethods: function(eventingMap) {
        if (!(eventingMap != null ? eventingMap : eventingMap = this.mixinOptions.eventedMethods)) {
          return;
        }
        return _.each(eventingMap, (function(_this) {
          return function(_arg, method) {
            var emitter, prefix, trigger;
            emitter = _arg.emitter, trigger = _arg.trigger, prefix = _arg.prefix;
            return _this.makeEventedMethod(method, emitter, trigger, prefix);
          };
        })(this));
      },

      /*
      Make Evented Method
      -------------------
      A proxy for the global `makeEventedMethod` function.
      Forces the evented method's scope to `this`.
       */
      makeEventedMethod: function() {
        return makeEventedMethod.apply(null, [this].concat(__slice.call(arguments)));
      }
    }, {
      mixins: ['Evented.Mixin']
    });
  });

}).call(this);
