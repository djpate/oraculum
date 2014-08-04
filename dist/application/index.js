(function() {
  define(['oraculum', 'oraculum/mixins/pub-sub', 'oraculum/mixins/freezable', 'oraculum/mixins/disposable', 'oraculum/application/router', 'oraculum/application/composer', 'oraculum/application/dispatcher'], function(Oraculum) {
    'use strict';

    /*
    Application
    ===========
    The role of the `Application` is to act as the entrypoint/primary bootstrapper
    for our application, stitching together our `Router`, `Dispatcher`, `Layout`,
    and `Composer`.
    
    @see application/router.coffee
    @see application/composer.coffee
    @see application/dispatcher.coffee
     */
    var Application;
    return Oraculum.define('Application', (Application = (function() {

      /*
      Title
      -----
      Site-wide title that is mapped to HTML `title` tag.
      
      @type {String}
       */
      Application.prototype.title = '';


      /*
      Started
      -------
      Track whether or not the `Application` has been started. This value is set
      to `true` upon invoking `@start`.
      
      @type {Boolean}
       */

      Application.prototype.started = false;


      /*
      Core Object Instantiation
      -------------------------
      The application instantiates three **core modules**:
       */


      /*
      A `View` that supports the `Layout.ViewMixin` interface.
      
      @see views/mixins/layout.coffee
      @see http://backbonejs.org/#View
      
      @type {View}
       */

      Application.prototype.layout = null;


      /*
      A global `Router`.
      
      @type {Router}
       */

      Application.prototype.router = null;


      /*
      A global `Composer`.
      
      @type {Composer}
       */

      Application.prototype.composer = null;


      /*
      And a global `Dispatcher`.
      
      @type {Dispatcher}
       */

      Application.prototype.dispatcher = null;


      /*
      Constructor
      -----------
      Initializes core components.
      
      @param {Object} options? Any options to be passed to our initializers.
       */

      function Application(options) {
        if (options == null) {
          options = {};
        }
        this.initRouter(options.routes, options);
        this.initDispatcher(options);
        this.initLayout(options);
        this.initComposer(options);
        this.initialize.apply(this, arguments);
        this.start();
      }


      /*
      Mixin Options
      -------------
      Automatically freeze this object after its construction and instruct the
      `Disposable.Mixin` to dispose all of our properties upon disposal.
      
      @see mixins/freezable.coffee
      @see mixins/disposable.coffee
       */

      Application.prototype.mixinOptions = {
        freeze: true,
        disposable: {
          disposeAll: true
        }
      };


      /*
      Initialize Router
      -----------------
      Creates the global `Router`, passing it all of our `options`.
      Invokes the `routes` function, if available, passing through the `Router`s
      `match` method, creating `Route`s for each specification.
      Resolves `options.router` to a factory definition to use as the `Router`.
      If `options.router` is not defined, it will default to `'Router'`.
      
      @see application/route.coffee
      @see application/router.coffee
      
      @param {Function} routes? The `routes` function.
      @param {Object} object? Any options to pass to the `Router`'s constructor.
       */

      Application.prototype.initRouter = function(routes, options) {
        if (options == null) {
          options = {};
        }
        if (options.router == null) {
          options.router = 'Router';
        }
        this.router = _.isString(options.router) ? this.__factory().get(options.router, options) : new options.router(options);
        return typeof routes === "function" ? routes(this.router.match) : void 0;
      };


      /*
      Initialize Dispatcher
      ---------------------
      Creates the global `Dispatcher`, passing it all of our `options`.
      Resolves `options.dispatcher` to a factory definition to use as the
      `Dispatcher`.
      If `options.dispatcher` is not defined, it will default to `'Dispatcher'`.
      
      @see application/dispatcher.coffee
      
      @param {Object} object? Any options to pass to the `Dispatcher`'s constructor.
       */

      Application.prototype.initDispatcher = function(options) {
        if (options == null) {
          options = {};
        }
        if (options.dispatcher == null) {
          options.dispatcher = 'Dispatcher';
        }
        return this.dispatcher = _.isString(options.dispatcher) ? this.__factory().get(options.dispatcher, options) : new options.dispatcher(options);
      };


      /*
      Initialize Layout
      -----------------
      Creates the global `Layout` `View`, passing it all of our `options`.
      Assigns `options.title` as `@title` if `options.title` is not defined.
      Resolves `options.layout` to a factory definition to use as the `Layout`.
      If `options.layout` is not defined, it will throw.
      
      @see views/mixins/layout.coffee
      @see http://backbonejs.org/#View
      
      @param {Object} object? Any options to pass to the `Layout`'s constructor.
       */

      Application.prototype.initLayout = function(options) {
        if (options == null) {
          options = {};
        }
        if (options.title == null) {
          options.title = this.title;
        }
        return this.layout = _.isString(options.layout) ? this.__factory().get(options.layout, options) : new options.layout(options);
      };


      /*
      Initialize Composer
      ---------------------
      Creates the global `Composer`, passing it all of our `options`.
      Resolves `options.composer` to a factory definition to use as the
      `Composer`.
      If `options.composer` is not defined, it will default to `'Composer'`.
      
      @see application/composer.coffee
      
      @param {Object} object? Any options to pass to the `Composer`'s constructor.
       */

      Application.prototype.initComposer = function(options) {
        if (options == null) {
          options = {};
        }
        if (options.composer == null) {
          options.composer = 'Composer';
        }
        return this.composer = _.isString(options.composer) ? this.__factory().get(options.composer, options) : new options.composer(options);
      };


      /*
      Initialize
      ----------
      We provide a basic `initialize` method to perform the most common use case
      implementation while keeping this logic out of `constructor` so that an
      extending definition can override `initialize`, taking control over the
      `@start` method's invocation.
      Throws if invoked after `@started` is set to `true`.
       */

      Application.prototype.initialize = function() {
        if (this.started) {
          throw new Error('Application#initialize: App was already started');
        }
      };


      /*
      Start
      -----
      Starts the `Router`'s history tracking, setting forth a chain of events that
      should lead to `History` reading the URL state, causing the `Router` notify
      the `Dispatcher` of a matched `Route`, culminating in the creation of a
      `Controller` and the execution of the `Route`'s prescribed action.
      
      @see application/route.coffee
      @see application/router.coffee
      @see application/history.coffee
      @see application/controller.coffee
      @see application/dispatcher.coffee
       */

      Application.prototype.start = function() {
        this.router.startHistory();
        return this.started = true;
      };

      return Application;

    })()), {
      singleton: true,
      mixins: ['PubSub.Mixin', 'Disposable.Mixin', 'Freezable.Mixin']
    });
  });

}).call(this);
