(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  define(['oraculum', 'oraculum/libs', 'oraculum/application/route', 'oraculum/application/history', 'oraculum/mixins/pub-sub', 'oraculum/mixins/evented', 'oraculum/mixins/listener', 'oraculum/mixins/disposable', 'oraculum/mixins/callback-provider'], function(Oraculum) {
    'use strict';
    var Router, escapeRegExp, _;
    _ = Oraculum.get('underscore');
    escapeRegExp = function(str) {
      return String(str || '').replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
    };

    /*
    Router
    ======
    The router which is a replacement for `Backbone.Router`.
    Like the standard router, it creates a `Backbone.History` instance and
    registers routes on it.
    It does not extend `Backbone.Router`, it instead replaces it.
    
    @see application/route.coffee
    @see application/history.coffee
    @see application/controller.coffee
    @see application/dispatcher.coffee
    @see http://backbonejs.org/#Router
    @see http://backbonejs.org/#History
     */
    return Oraculum.define('Router', (Router = (function() {

      /*
      Constructor
      -----------
      
      @param {Object} options? Any options to be cached or passed to our initializers.
       */
      function Router(options) {
        var isWeb, rootRegex, _ref;
        if (options == null) {
          options = {};
        }
        this.match = __bind(this.match, this);
        isWeb = (_ref = window.location.protocol) === 'http:' || _ref === 'https:';
        this.options = _.extend({
          root: '/',
          trailing: false,
          pushState: isWeb
        }, options);
        rootRegex = escapeRegExp(this.options.root);
        this.removeRoot = new RegExp("^" + rootRegex + "(#)?");
        this.createHistory();
      }


      /*
      Mixin Options
      -------------
      Set up our event listeners and named callbacks.
      
      @see mixins/listener.coffee
      @see mixins/callback-provider.coffee
       */

      Router.prototype.mixinOptions = {
        listen: {
          'dispose this': '_deleteHistory',
          'dispatcher:dispatch mediator': 'changeURL'
        },
        provideCallbacks: {
          'router:route': 'route',
          'router:reverse': 'reverse'
        }
      };


      /*
      Create History
      --------------
      Create a Backbone.History instance.
       */

      Router.prototype.createHistory = function() {
        return Backbone.history = this.__factory().get('History');
      };


      /*
      Start History
      -------------
      Start the Backbone.History instance to start routing.
      This should be called after all routes have been registered.
       */

      Router.prototype.startHistory = function() {
        return Backbone.history.start(this.options);
      };


      /*
      Stop History
      ------------
      Stop the current Backbone.History instance from observing URL changes.
       */

      Router.prototype.stopHistory = function() {
        if (!Backbone.History.started) {
          return;
        }
        return Backbone.history.stop();
      };


      /*
      Find Handler
      ------------
      Search through backbone history handlers.
      
      @param {Function} predicate Matching function used to identify the desired handler.
      
      @return {Function} The desired handler or `undefined`.
       */

      Router.prototype.findHandler = function(predicate) {
        return _.find(Backbone.history.handlers, function(handler) {
          return predicate(handler);
        });
      };


      /*
      Match
      -----
      Connect an address with a controller action.
      Creates a route on the Backbone.History instance.
      
      @param {String} pattern A `Route` path spec.
      @param {String} target A `Route` spec as a string.
      @param {Object} target A `Route` spec as an object.
      @param {Object} options? Any options to pass to the `Route`.
       */

      Router.prototype.match = function(pattern, target, options) {
        if (options == null) {
          options = {};
        }
        if (_.isString(target)) {
          return this.matchWithPatternAndString(pattern, target, options);
        } else {
          return this.matchWithPatternAndOptions(pattern, target);
        }
      };


      /*
      Match a `Route` path spec with a `Route` spec as a string.
      
      @param {String} pattern A `Route` path spec.
      @param {Object} target A `Route` spec as an object.
      @param {Object} options? Any options to pass to the `Route`.
       */

      Router.prototype.matchWithPatternAndString = function(pattern, string, options) {
        var action, controller, _ref;
        controller = options.controller, action = options.action;
        if (controller && action) {
          throw new Error('Router#matchWithPatternAndString cannot use both string\nand controller/action');
        }
        _ref = string.split('#'), controller = _ref[0], action = _ref[1];
        return this.addHandler(pattern, controller, action, options);
      };


      /*
      Match a `Route` path spec with a `Route` spec as an object.
      
      @param {String} pattern A `Route` path spec.
      @param {Object} target A `Route` spec as an object.
       */

      Router.prototype.matchWithPatternAndOptions = function(pattern, options) {
        var action, controller;
        controller = options.controller, action = options.action;
        if (!(controller && action)) {
          throw new Error('Router#matchWithPatternAndOptions must receive controller and action');
        }
        return this.addHandler(pattern, controller, action, options);
      };


      /*
      Add Handler
      -----------
      Create a `Route` object and add it to the `History`'s handlers.
      
      @param {String} pattern A `Route` path spec.
      @param {String} controller A `Controller` name.
      @param {String} action The `Controller`'s targeted `action`
      @param {Object} options? Any options to pass to the `Route`.
       */

      Router.prototype.addHandler = function(pattern, controller, action, options) {
        var route, _ref;
        _.defaults(options, {
          trailing: this.options.trailing
        });
        route = (_ref = this.__factory()).get.apply(_ref, ['Route'].concat(__slice.call(arguments)));
        Backbone.history.handlers.push({
          route: route,
          callback: route.handler
        });
        return route;
      };


      /*
      Route
      -----
      Route a given URL path manually.
      This looks quite like Backbone.History::loadUrl but it accepts an absolute
      URL with a leading slash (e.g. /foo) and passes the routing options to the
      callback function.
      
      @param {String} pathSpec The spec for the target `Route` as a string.
      @param {Object} pathSpec The spec for the target `Route` as an object.
      @param {Object} params Any params to pass to the `Route`.
      @param {Object} options? Any options to pass to the handler.
      
      @return {Boolean} Whether a route matched.
       */

      Router.prototype.route = function(pathSpec, params, options) {
        var path;
        if (_.isObject(pathSpec)) {
          path = pathSpec.url;
          if (params == null) {
            params = pathSpec.params;
          }
        }
        params = _.isArray(params) ? params.slice() : _.extend({}, params);
        if (path != null) {
          return this.routeWithPath(path, params);
        } else {
          return this.routeWithPathSpec(pathSpec, params, options);
        }
      };


      /*
      Find and execute a `Route` handler by path.
      
      @param {String} path The path to use to lookup the `Route` handler.
      @param {Object} options? Any options to pass to the handler.
      
      @return {Boolean} Whether a route matched.
       */

      Router.prototype.routeWithPath = function(path, options) {
        var handler;
        path = path.replace(this.removeRoot, '');
        handler = this.findHandler(function(handler) {
          return handler.route.test(path);
        });
        return this.handleRoute(handler, path, options);
      };


      /*
      Find and execute a `Route` handler by path spec.
      
      @param {String} path The path spec to use to lookup the `Route` handler.
      @param {Object} params The `Route`'s params.
      @param {Object} options? Any options to pass to the handler.
      
      @return {Boolean} Whether a route matched.
       */

      Router.prototype.routeWithPathSpec = function(pathSpec, params, options) {
        var handler;
        if (options == null) {
          options = {};
        }
        handler = this.findHandler(function(handler) {
          var matches, normalizedParams;
          matches = handler.route.matches(pathSpec);
          normalizedParams = handler.route.normalizeParams(params);
          return Boolean(matches && normalizedParams);
        });
        return this.handleRoute(handler, params, options);
      };


      /*
      Invoke a matched `Route`'s handler callback.
      
      @param {Function} handler The matched handler callback.
      @param {Object} params The `Route`'s params.
      @param {Object} options? Any options to pass to the handler.
      
      @return {Boolean} `true`.
       */

      Router.prototype.handleRoute = function(handler, params, options) {
        if (!handler) {
          throw new Error('Router#route: request was not routed');
        }
        handler.callback(params, _.extend({
          changeURL: true
        }, options));
        return true;
      };


      /*
      Reverse
      -------
      Find the URL for given pathSpec using the registered routes and provided
      parameters. The pathSpec may be just the name of a route or an object
      containing the name, controller, and/or action.
      
      Warning: this is usually **hot** code in terms of performance.
      
      @param {String} pathSpec The spec for the target `Route` as a string.
      @param {Object} pathSpec The spec for the target `Route` as an object.
      @param {Object} params The `Route`'s params.
      @param {Object} query? An optional query hash.
      @param {String} query? An optional querystring.
      
      @return {String} The URL string if it is found.
      @return {Boolean} `false` if the string is not found.
       */

      Router.prototype.reverse = function(pathSpec, params, query) {
        var handler, handlers, reversed, root, _i, _len;
        root = this.options.root;
        if ((params != null) && !(_.isObject(params) || _.isArray(params))) {
          throw new TypeError('Router#reverse: params must be an array or an object');
        }
        handlers = Backbone.history.handlers;
        for (_i = 0, _len = handlers.length; _i < _len; _i++) {
          handler = handlers[_i];
          if (!(handler.route.matches(pathSpec))) {
            continue;
          }
          reversed = handler.route.reverse(params, query);
          if (reversed !== false) {
            if (root) {
              return "" + root + reversed;
            } else {
              return reversed;
            }
          }
        }
        throw new Error('Router#reverse: invalid route specified');
      };


      /*
      Change URL
      ----------
      Change the current URL, add a history entry. Invoked upon dispatch.
      
      @param {Controller} controller The current `Controller`.
      @param {Object} params The `Route`'s params.
      @param {Object} route The current `Route` spec.
      @param {Object} options? Any options present when dispatch occured.
       */

      Router.prototype.changeURL = function(controller, params, route, options) {
        var changeURL, navigateOptions, path, query, replace, trigger, url;
        path = route.path, query = route.query;
        changeURL = options.changeURL, trigger = options.trigger, replace = options.replace;
        if (!((path != null) && changeURL)) {
          return;
        }
        url = path;
        url += query ? "?" + query : '';
        navigateOptions = {
          trigger: trigger === true,
          replace: replace === true
        };
        return Backbone.history.navigate(url, navigateOptions);
      };


      /*
      Delete History
      --------------
      Invoked upon disposal of this `Router`.
       */

      Router.prototype._deleteHistory = function() {
        this.stopHistory();
        return delete Backbone.history;
      };

      return Router;

    })()), {
      override: true,
      mixins: ['PubSub.Mixin', 'Evented.Mixin', 'Listener.Mixin', 'Disposable.Mixin', 'CallbackProvider.Mixin']
    });
  });

}).call(this);
