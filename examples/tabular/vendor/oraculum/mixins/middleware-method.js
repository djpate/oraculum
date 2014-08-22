(function() {
  var __slice = [].slice;

  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/evented', 'oraculum/extensions/make-middleware-method'], function(Oraculum) {
    'use strict';
    var makeMiddlewareMethod, _;
    _ = Oraculum.get('underscore');
    makeMiddlewareMethod = Oraculum.get('makeMiddlewareMethod');

    /*
    Make Middleware Method
    ===================
    This mixin exposes the heart of our dynamic AOP-based decoupling.
    
    @see extensions/make-middleware-method.coffee
     */
    return Oraculum.defineMixin('MiddlewareMethod.Mixin', {

      /*
      Mixin Options
      -------------
      Allow the targeting of our instance methods to be middlewared using a mapping
      of method names and middlewared method spec as described in the examples below.
      
      @param {Object} middlewaredMethods Object containing the middleware map.
       */

      /*
      Mixinitialize
      -------------
      Invoke `@makeMiddlewareMethods`.
      
      @see @makeMiddlewareMethods
       */
      mixinitialize: function() {
        return this.makeMiddlewareMethods();
      },

      /*
      Make Middleware Methods
      --------------------
      Iterate over the middleware map, passing our method names and their
      middleware specs through to `@makeMiddlewareMethod`.
      
      @see @makeMiddlewareMethod
      
      @param {Array} middlewareMap? An middleware map. Defaults to our configured middleware map.
       */
      makeMiddlewareMethods: function(middlewareMap) {
        if (!(middlewareMap != null ? middlewareMap : middlewareMap = this.mixinOptions.middlewaredMethods)) {
          return;
        }
        return _.each(middlewareMap, (function(_this) {
          return function(_arg, method) {
            var emitter, prefix, trigger;
            emitter = _arg.emitter, trigger = _arg.trigger, prefix = _arg.prefix;
            return _this.makeMiddlewareMethod(method, emitter, trigger, prefix);
          };
        })(this));
      },

      /*
      Make Middleware Method
      -------------------
      A proxy for the global `makeMiddlewareMethod` function.
      Forces the middlewared method's scope to `this`.
       */
      makeMiddlewareMethod: function() {
        return makeMiddlewareMethod.apply(null, [this].concat(__slice.call(arguments)));
      }
    }, {
      mixins: ['Evented.Mixin']
    });
  });

}).call(this);
