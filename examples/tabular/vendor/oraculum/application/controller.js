(function() {
  var __slice = [].slice;

  define(['oraculum', 'oraculum/mixins/pub-sub', 'oraculum/mixins/disposable', 'oraculum/mixins/callback-provider'], function(Oraculum) {
    'use strict';

    /*
    Controller
    ==========
    The job of the `Controller` is to serve as the top-level configuration for
    sub-applications within our global `Application`.
    The `Controller` provides actions to be mapped to `Route`s, and subsequently
    receives `Route` parameters with which it can use to create `Model`s,
    `Collection`s, and `View`s to display the requested resources.
    The `Controller`'s lifecycle is managed by the `Dispatcher`
    
    @see application/index.coffee
    @see application/route.coffee
    @see application/router.coffee
    @see application/dispatcher.coffee
    @see http://backbonejs.org/#View
    @see http://backbonejs.org/#Model
    @see http://backbonejs.org/#Collection
     */
    var Controller;
    return Oraculum.define('Controller', (Controller = (function() {

      /*
      Internal flag which stores whether `redirectTo` was called.
      
      @type {Boolean}
       */
      Controller.prototype.redirected = false;


      /*
      Constructor
      -----------
      Allow custom initialization via the standard `initialize` method.
       */

      function Controller() {
        this.initialize.apply(this, arguments);
      }


      /*
      Initialize
      ----------
      We provide an empty `initialize` method to enforce that `initialize` is a
      reserved method name and should not be used for a `Controller` action.
       */

      Controller.prototype.initialize = function() {};


      /*
      Mixin Options
      -------------
      Instruct the `Disposable.Mixin` to dispose all of our properties upon
      disposal.
      
      @see mixins/disposable.coffee
       */

      Controller.prototype.mixinOptions = {
        disposable: {
          disposeAll: true
        }
      };


      /*
      Before Action
      -------------
      We provide an empty `beforeAction` method to allow the method to be hooked
      by `makeEventedMethod` or `makeMiddlewareMethod` even if the implementing
      `Controller` fails to define it's own implementation.
      This method is invoked by the `Dispatcher`'s `executeBeforeAction` method.
      
      @see application/route.coffee
      @see application/router.coffee
      @see application/dispatcher.coffee
      
      @param {Object} params Any parameters defined in the `Route`'s specification.
      @param {Object} route The current `Route` specification.
      @param {Object} options The current `Route` options.
      
      @return {Promise?} May return a promise interface to defer invocation of the action prescribed by the current `Route` specification.
       */

      Controller.prototype.beforeAction = function() {};


      /*
      Adjust Title
      ------------
      Fires an event through the global mediator indicating that the page's title
      should change.
      
      @param {String} subtitle A string representing the scope of the current action.
       */

      Controller.prototype.adjustTitle = function(subtitle) {
        return this.publishEvent('!adjustTitle', subtitle);
      };


      /*
      Reuse
      -----
      Invokes callbacks registered by the `Composer`.
      Will compose a `View` if `view` is specified, else it will attempt to lookup
      and return the composed `View` matching `name`.
      
      @see application/composer.coffee
      
      @param {String} name The composition to be composed/retrieved.
      @param {Constructor} view? The `View` constructor to be composed.
      @param {String} view? The factory definition to be composed.
      @param {Object} options? The options to pass to the `View` constructor.
      
      @return {View?} The `View` that was retrieved/composed, if it exists.
       */

      Controller.prototype.reuse = function() {
        var method;
        method = arguments.length === 1 ? 'retrieve' : 'compose';
        return this.executeCallback.apply(this, ["composer:" + method].concat(__slice.call(arguments)));
      };


      /*
      Redirect To
      -----------
      Redirects to another `Route`.
      Sets the `@redirected` flag to `true` to prevent the `Dispatcher` from
      firing an additional `dispatcher:dispatch` event.
      
      @see application/route.coffee
      @see application/router.coffee
      @see application/dispatcher.coffee
      
      @param {String} pathDesc The `Route`'s path descriptor.
      @param {Object} params Any parameters defined in the `Route`'s specification.
      @param {Object} options Any `Route` options.
       */

      Controller.prototype.redirectTo = function() {
        this.redirected = true;
        return this.executeCallback.apply(this, ['router:route'].concat(__slice.call(arguments)));
      };

      return Controller;

    })()), {
      mixins: ['PubSub.Mixin', 'Evented.Mixin', 'Disposable.Mixin', 'CallbackDelegate.Mixin']
    });
  });

}).call(this);
