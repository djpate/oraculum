(function() {
  var __slice = [].slice;

  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/evented', 'oraculum/mixins/listener'], function(Oraculum) {
    var handlers, _;
    _ = Oraculum.get('underscore');

    /*
    Handlers
    --------
    All callbacks registered across all instances invoking `provideCallback`
    will be collected here in the closure.
    
    @type {Object}
     */
    handlers = {};

    /*
    CallbackProvider.Mixin
    ======================
    This mixin replaces the `setHandler` method implicit to Chaplin's mediator
    with the `provideCallback` method. It's functionally the same, however
    it can be mixed on any object providing a more consistent interface
    while allowing for other conveniences such as providing `this` as the
    default callback scope.
     */
    Oraculum.defineMixin('CallbackProvider.Mixin', {

      /*
      Mixin Options
      -------------
      Allow the callback configuration to be defined using a mapping of callback
      names and methods as described in the examples below.s
      
      @param {Object} Object containing the callback map.
       */

      /*
      Mixinitialize
      -------------
      Initialize the component.
       */
      mixinitialize: function() {
        _.each(this.mixinOptions.provideCallbacks, (function(_this) {
          return function(callback, name) {
            if (_.isString(callback)) {
              callback = _this[callback];
            }
            return _this.provideCallback(name, callback, _this);
          };
        })(this));
        return typeof this.on === "function" ? this.on('dispose:after', (function(_this) {
          return function(target) {
            if (target === _this) {
              return _this.removeCallbacks(_this);
            }
          };
        })(this)) : void 0;
      },

      /*
      Provide Callback
      ----------------
      The **only** registration interface to our callback collector.
      This method will perform sanity checking for registered callbacks as well as
      sane defaults to ensure that nothing gets pushed to the handlers cache that
      doesn't make sense.
      
      @param {String} name The name of the callback.
      @param {Function} callback The callback implemenation.
      @param {Object} instance? The instance to which the callback shoudl be scoped. (defaults to `this`)
       */
      provideCallback: function(name, callback, instance) {
        if (instance == null) {
          instance = this;
        }
        if (!_.isString(name)) {
          throw new TypeError('CallbackProvider.Mixin::provideCallback requires name');
        }
        if (!_.isFunction(callback)) {
          throw new TypeError('CallbackProvider.Mixin::provideCallback requires callback');
        }
        if (handlers[name] != null) {
          if (typeof console !== "undefined" && console !== null) {
            if (typeof console.warn === "function") {
              console.warn("CallbackProvider.Mixin: Overriding " + name + " callback");
            }
          }
        }
        handlers[name] = {
          callback: callback,
          instance: instance
        };
      },

      /*
      Remove Callbacks
      ----------------
      Similar to `provideCallback`, this is the only interface for removing
      callbacks from the collector. It accepts an array of callback names,
      or an instance. Providing an instance will remove all registered callbacks
      scoped to that instance.
      
      @param {Array} input A list of named callbacks to remove.
      @param {Object} input An instance scope to remove the callbacks for.
       */
      removeCallbacks: function(input) {
        var handler, name, _i, _len;
        if (_.isArray(input)) {
          for (_i = 0, _len = input.length; _i < _len; _i++) {
            name = input[_i];
            delete handlers[name];
          }
        } else {
          for (name in handlers) {
            handler = handlers[name];
            if (handler.instance === input) {
              delete handlers[name];
            }
          }
        }
      }
    });

    /*
    CallbackDelegate.Mixin
    ======================
    This mixin provides the `executeCallback` method. It's only purpose is to
    allow the invocation of arbitrary callbacks registered by
    `CallbackProvider.Mixin`.
     */
    return Oraculum.defineMixin('CallbackDelegate.Mixin', {

      /*
      Execute Callback
      ----------------
      This method takes a callback name and attempts to invoked the registered
      callback of that name, passing through whatever arguments are provided.
      If the named callback is not available, this method will throw.
      The error throwing behavior can be bypassed by using an object as the
      first argument with the structure `{name: 'name', silent: true}`
      
      @param {String} name The named callback to execute.
      @param {Object} name The afformentioned silent spec.
      @param {[Mixed]} args Any arguments to pass to the callback.
      
      @return {Mixed} The return value of the callback, if any.
       */
      executeCallback: function() {
        var args, handler, name, silent, _ref;
        name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (_.isObject(name)) {
          _ref = name, name = _ref.name, silent = _ref.silent;
        }
        handler = handlers[name];
        if (!handler && !silent) {
          throw new Error("CallbackDelegate.Mixin: No callback defined for " + name);
        }
        if (handler) {
          return handler.callback.apply(handler.instance, args);
        }
      }
    });
  });

}).call(this);
