(function() {
  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/pub-sub', 'oraculum/mixins/evented', 'oraculum/mixins/listener', 'oraculum/mixins/disposable'], function(Oraculum) {
    'use strict';
    var Dispatcher, _;
    _ = Oraculum.get('underscore');

    /*
    Dispatcher
    ==========
    The job of the `Dispatcher` is receive and read the `Route` specifications
    from the `Router` and manage the lifecycle of the prescribed `Controller`.
    
    @see application/route.coffee
    @see application/router.coffee
    @see application/controller.coffee
     */
    return Oraculum.define('Dispatcher', (Dispatcher = (function() {

      /*
      We cache the previous `Route` soec so that we can pass it through to a
      new `Route` for the purpose of allowing the `Controller` to perform logic
      against the old values. It contains the `Controller` action, path, and name.
      
      @type {Null|Object}
       */
      Dispatcher.prototype.previousRoute = null;

      Dispatcher.prototype.currentQuery = null;

      Dispatcher.prototype.currentRoute = null;

      Dispatcher.prototype.currentParams = null;

      Dispatcher.prototype.currentController = null;


      /*
      Constructor
      -----------
      Allow custom initialization via the standard `initialize` method.
       */

      function Dispatcher() {
        if (typeof this.initialize === "function") {
          this.initialize.apply(this, arguments);
        }
      }


      /*
      Mixin Options
      -------------
      Set up our event listeners.
      
      @see mixins/listener.coffee
       */

      Dispatcher.prototype.mixinOptions = {
        listen: {
          'router:match mediator': 'dispatch'
        }
      };


      /*
      Dispatch
      --------
      This method is the heart of the `Dispatcher`, providing the logic to create
      and dispose `Controllers`, and invoke their actions as prescribed by the
      current `Route` specification.
      
      The standard flow is:
      
        1. Test if it’s a new `Controller`/action with new params.
        1. Dispose the previous `Controller`.
        1. Instantiate the new `Controller`.
        1. Invoke the `Route` specification's prescribed action.
      
      @see application/route.coffee
      @see application/router.coffee
      @see application/controller.coffee
      
      @param {Object} route The current `Route` specification.
      @param {Object} params Any parameters defined in the `Route`'s specification.
      @param {Object} options The current `Route` options.
       */

      Dispatcher.prototype.dispatch = function(route, params, options) {
        var controller, prev, previous, _ref, _ref1;
        params = _.extend({}, params);
        options = _.extend({}, options);
        if (options.query == null) {
          options.query = {};
        }
        if (options.forceStartup !== true) {
          options.forceStartup = false;
        }
        if (!options.forceStartup && ((_ref = this.currentRoute) != null ? _ref.action : void 0) === route.action && ((_ref1 = this.currentRoute) != null ? _ref1.controller : void 0) === route.controller && _.isEqual(this.currentParams, params) && _.isEqual(this.currentQuery, options.query)) {
          return;
        }
        if (this.nextPreviousRoute = this.currentRoute) {
          previous = _.extend({}, this.nextPreviousRoute);
          if (this.currentParams != null) {
            previous.params = this.currentParams;
          }
          if (previous.previous) {
            delete previous.previous;
          }
          prev = {
            previous: previous
          };
        }
        this.nextCurrentRoute = _.extend({}, route, prev);
        controller = this.__factory().get(route.controller, params, this.nextCurrentRoute, options);
        return this.executeBeforeAction(controller, this.nextCurrentRoute, params, options);
      };


      /*
      Execute Before Action
      ---------------------
      Composes the options for and invokes the current `Controller`'s
      `beforeAction` method, if it is available, before invoking the current
      `Route` specification's prescribed action.
      Tests the return value of the `beforeAction` method to check for a promise
      interface. If a promise is returned, the execution of the current `Route`
      specification's prescribed action will be deferred until the resolution
      of the returned promise.
      
      @see application/route.coffee
      @see application/router.coffee
      @see application/controller.coffee
      
      @param {Controller} controller The current controller.
      @param {Object} route The current `Route` specification.
      @param {Object} params Any parameters defined in the `Route`'s specification.
      @param {Object} options The current `Route` options.
       */

      Dispatcher.prototype.executeBeforeAction = function(controller, route, params, options) {
        var beforeAction, executeAction, promise;
        beforeAction = controller.beforeAction;
        executeAction = (function(_this) {
          return function() {
            if (controller.redirected || _this.currentRoute && route === _this.currentRoute) {
              _this.nextPreviousRoute = _this.nextCurrentRoute = null;
              controller.dispose();
              return;
            }
            _this.currentRoute = _this.nextCurrentRoute;
            _this.previousRoute = _this.nextPreviousRoute;
            _this.nextPreviousRoute = _this.nextCurrentRoute = null;
            return _this.executeAction(controller, route, params, options);
          };
        })(this);
        if (!beforeAction) {
          return executeAction();
        }
        promise = controller.beforeAction(params, route, options);
        if (promise && promise.then) {
          return promise.then(executeAction);
        } else {
          return executeAction();
        }
      };


      /*
      Execute Action
      --------------
      Executes the current `Route` specification's prescribed action.
      
      @see application/route.coffee
      
      @param {Controller} controller The current controller.
      @param {Object} route The current `Route` specification.
      @param {Object} params Any parameters defined in the `Route`'s specification.
      @param {Object} options The current `Route` options.
       */

      Dispatcher.prototype.executeAction = function(controller, route, params, options) {
        if (this.currentController) {
          this.publishEvent('beforeControllerDispose', this.currentController);
          this.currentController.dispose(params, route, options);
        }
        this.currentQuery = options.query;
        this.currentParams = params;
        this.currentController = controller;
        controller[route.action](params, route, options);
        if (controller.redirected) {
          return;
        }
        return this.publishEvent('dispatcher:dispatch', this.currentController, params, route, options);
      };

      return Dispatcher;

    })()), {
      mixins: ['PubSub.Mixin', 'Evented.Mixin', 'Listener.Mixin', 'Disposable.Mixin']
    });
  });

}).call(this);
