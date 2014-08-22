(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty;

  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/pub-sub', 'oraculum/mixins/freezable', 'oraculum/application/controller'], function(Oraculum) {
    'use strict';
    var Route, escapeRegExp, optionalRegExp, paramRegExp, _;
    _ = Oraculum.get('underscore');
    paramRegExp = /(?::|\*)(\w+)/g;
    optionalRegExp = /\((.*?)\)/g;
    escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    /*
    Route
    =====
    The `Route` represents a mapping between a url `fragment` and a method of a
    `Controller`, colloquially referred to as its `action`.
    A route's `fragment` can carry information about a particular `resource` that
    that the `Controller`'s `action` represents, such as the id of a particular
    `Model`, or other metadata.
    
    @see application/router.coffee
    @see application/history.coffee
    @see application/controller.coffee
    @see application/dispatcher.coffee
     */
    return Oraculum.define('Route', (Route = (function() {

      /* Static Methods */

      /*
      Add or remove trailing slash from path according to trailing option.
      
      @param {String} path The path to process.
      @param {Boolean} trailing Wether to add or strip the trailing slash.
      
      @return {String} The processed path.
       */
      Route.processTrailingSlash = function(path, trailing) {
        switch (trailing) {
          case true:
            if (path.slice(-1) !== '/') {
              path += '/';
            }
            break;
          case false:
            if (path.slice(-1) === '/') {
              path = path.slice(0, -1);
            }
        }
        return path;
      };


      /*
      Encode a key/val pair into a querystring component.
      
      @param {String} key The key for the url parameter.
      @param {Mixed} value The value to encode for the url parameter.
      
      @return {String} The resulting querystring component.
       */

      Route.stringifyKeyValue = function(key, value) {
        if (value == null) {
          return '';
        }
        return "&" + key + "=" + (encodeURIComponent(value));
      };


      /*
      Returns a query string from a hash.
      
      @param {Object} queryParams The object to be serialized to a querystring.
      
      @return {String} The resulting querystring.
       */

      Route.stringifyQueryParams = function(queryParams) {
        var query;
        query = '';
        _.each(queryParams, function(value, key) {
          var encodedKey;
          encodedKey = encodeURIComponent(key);
          if (_.isArray(value)) {
            return _.each(value, function(arrParam) {
              return query += Route.stringifyKeyValue(encodedKey, arrParam);
            });
          } else {
            return query += Route.stringifyKeyValue(encodedKey, value);
          }
        });
        return query && query.substring(1);
      };


      /*
      Deserialize a querystring to an object.
      
      @param {String} queryString The querystring to deserialized.
      
      @return {Object} The resulting object.
       */

      Route.parseQueryString = function(queryString) {
        var pairs, params;
        params = {};
        if (!queryString) {
          return params;
        }
        pairs = queryString.split('&');
        _.each(pairs, function(pair) {
          var current, field, value, _ref;
          if (!pair.length) {
            return;
          }
          _ref = pair.split('='), field = _ref[0], value = _ref[1];
          if (!field.length) {
            return;
          }
          field = decodeURIComponent(field);
          value = decodeURIComponent(value);
          current = params[field];
          if (current) {
            if (current.push) {
              return current.push(value);
            } else {
              return params[field] = [current, value];
            }
          } else {
            return params[field] = value;
          }
        });
        return params;
      };


      /*
      Constructor
      -----------
      Create a route for a URL pattern and a controller action
      e.g. new Route '/users/:id', 'users', 'show', { some: 'options' }
      
      @param {String} pattern The `fragment` that represents this route.
      @param {String} controller The `Controller` name this route should use.
      @param {String} action The `Controller`'s targeted `action`.
      @param {Object} options? Any options to be cached.
       */

      function Route(pattern, controller, action, options) {
        this.pattern = pattern;
        this.controller = controller;
        this.action = action;
        this.handler = __bind(this.handler, this);
        if (!_.isString(this.pattern)) {
          throw new Error('Route: RegExps are not supported.\nUse strings with :names and `constraints` option of route');
        }
        this.options = _.extend({}, options);
        if (this.options.name != null) {
          this.name = this.options.name;
        }
        if (this.name && this.name.indexOf("#") !== -1) {
          throw new Error('Route: "#" cannot be used in name');
        }
        if (this.name == null) {
          this.name = "" + this.controller + "#" + this.action;
        }
        this.allParams = [];
        this.requiredParams = [];
        this.optionalParams = [];
        if (this.action in this.__factory().getConstructor('Controller').prototype) {
          throw new Error('Route: You should not use existing controller properties as actions');
        }
        this.createRegExp();
      }


      /*
      Mixin Options
      -------------
      Automatically freeze this object after its construction.
      
      @see mixins/freezable.coffee
       */

      Route.prototype.mixinOptions = {
        freeze: true
      };


      /*
      Matches
      -------
      Tests if route params are equal to pathSpec.
      
      @param {String} pathSpec The `fragment` to test as a string.
      @param {Object} pathSpec The `fragment` to test as an object.
      
      @return {Boolean} Whether or not the provided `fragment` is a match for this `Route`.
       */

      Route.prototype.matches = function(pathSpec) {
        var invalidParamsCount, name, propCount, property, _i, _len, _ref;
        if (_.isString(pathSpec)) {
          return pathSpec === this.name;
        }
        propCount = 0;
        _ref = ['name', 'action', 'controller'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          propCount++;
          property = pathSpec[name];
          if (property && property !== this[name]) {
            return false;
          }
        }
        invalidParamsCount = propCount === 1 && (name === 'action' || name === 'controller');
        return !invalidParamsCount;
      };


      /*
      Reverse
      -------
      Generates `fragment` for this `Route` from params and optional querystring.
      
      @param {Object} params The params for this `Route`.
      @param {Object} query? An optional query hash.
      @param {String} query? An optional querystring.
      
      @return {String} The resulting `fragment`.
       */

      Route.prototype.reverse = function(params, query) {
        var queryString, raw, url;
        params = this.normalizeParams(params);
        if (params === false) {
          return false;
        }
        url = this.pattern;
        _.each(this.requiredParams, function(param) {
          var value;
          value = params[param];
          return url = url.replace(RegExp("[:*]" + param, "g"), value);
        });
        _.each(this.optionalParams, function(param) {
          var value;
          if (!(value = params[param])) {
            return;
          }
          return url = url.replace(RegExp("[:*]" + param, "g"), value);
        });
        raw = url.replace(optionalRegExp, function(match, portion) {
          if (!portion.match(/[:*]/g)) {
            return portion;
          } else {
            return '';
          }
        });
        url = Route.processTrailingSlash(raw, this.options.trailing);
        if (!query) {
          return url;
        }
        if (_.isObject(query)) {
          queryString = Route.stringifyQueryParams(query);
          return url += queryString ? '?' + queryString : '';
        } else {
          return url += (query[0] === '?' ? '' : '?') + query;
        }
      };


      /*
      Normalize Params
      ----------------
      Validates incoming params and returns them in a unified form - hash.
      
      @param {Object} params The params to normalize.
      @param {Array} params The params to normalize.
      
      @return {Object} The normalized params.
      @return {Boolean} `false` if `params` doesn't pass `testParams`.
       */

      Route.prototype.normalizeParams = function(params) {
        var paramsHash;
        if (_.isArray(params)) {
          if (params.length < this.requiredParams.length) {
            return false;
          }
          paramsHash = {};
          _.each(this.requiredParams, function(paramName, paramIndex) {
            return paramsHash[paramName] = params[paramIndex];
          });
          if (!this.testConstraints(paramsHash)) {
            return false;
          }
          params = paramsHash;
        } else {
          if (params == null) {
            params = {};
          }
          if (!this.testParams(params)) {
            return false;
          }
        }
        return params;
      };


      /*
      Test Params
      -----------
      Test if passed params hash matches current route.
      
      @param {Object} params The params to test.
      
      @return {Boolean} Whether `params` match this `Route`.
       */

      Route.prototype.testParams = function(params) {
        var paramName, _i, _len, _ref;
        _ref = this.requiredParams;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          paramName = _ref[_i];
          if (params[paramName] === void 0) {
            return false;
          }
        }
        return this.testConstraints(params);
      };


      /*
      Test Constraints
      ----------------
      Test if passed params hash matches current constraints.
      
      @param {Object} params The params to test.
      
      @return {Boolean} Whether `params` match our constraints.
       */

      Route.prototype.testConstraints = function(params) {
        var constraint, constraints, name;
        constraints = this.options.constraints;
        if (constraints) {
          for (name in constraints) {
            if (!__hasProp.call(constraints, name)) continue;
            constraint = constraints[name];
            if (!constraint.test(params[name])) {
              return false;
            }
          }
        }
        return true;
      };


      /*
      Create RegExp
      -------------
      Creates the actual regular expression that Backbone.History#loadUrl
      uses to determine if the current url is a match.
      
      @return {RegExp} The generated regular expression.
       */

      Route.prototype.createRegExp = function() {
        var pattern;
        pattern = this.pattern;
        pattern = pattern.replace(escapeRegExp, '\\$&');
        this.replaceParams(pattern, (function(_this) {
          return function(match, param) {
            return _this.allParams.push(param);
          };
        })(this));
        pattern = pattern.replace(optionalRegExp, (function(_this) {
          return function() {
            return _this.parseOptionalPortion.apply(_this, arguments);
          };
        })(this));
        pattern = this.replaceParams(pattern, (function(_this) {
          return function(match, param) {
            _this.requiredParams.push(param);
            return _this.paramCapturePattern(match);
          };
        })(this));
        return this.regExp = RegExp("^" + pattern + "(?=/?(?=\\?|$))");
      };


      /*
      Parse Optional Portion
      ----------------------
      Extract optional parameters from a `fragment`, caching them in
      `optionalParams`.
      
      @param {String} match The optional matched portion of the `fragment`.
      @param {String} optionalPortion The extracted optional matched parameter.
      
      @return {String} The optional matched portion of the `fragment` wrapped in a non-capturing group.
       */

      Route.prototype.parseOptionalPortion = function(match, optionalPortion) {
        var portion;
        portion = this.replaceParams(optionalPortion, (function(_this) {
          return function(match, param) {
            _this.optionalParams.push(param);
            return _this.paramCapturePattern(match);
          };
        })(this));
        return "(?:" + portion + ")?";
      };


      /*
      Replace Params
      --------------
      A convenience method for processing parameter portions of a `fragment`.
      
      @param {String} s, `fragment` to be processed.
      @param {Function} callback Method used to process the process any matched parameters.
      
      @return {String} The processed `fragment`.
       */

      Route.prototype.replaceParams = function(s, callback) {
        return s.replace(paramRegExp, callback);
      };


      /*
      Param Capture Pattern
      ---------------------
      Extract the param name from a parameter spec in a `fragment`
      
      @param {String} param The `fragment` to process.
      
      @return {String} The extracted parameter name.
       */

      Route.prototype.paramCapturePattern = function(param) {
        if (param.charAt(0) === ':') {
          return '([^\/\\?]+)';
        } else {
          return '(.*?)';
        }
      };


      /*
      Test
      ----
      Test if the route matches to a path (called by Backbone.History#loadUrl).
      
      @param {String} path The `fragment` to test.
      
      @return {Boolean} Whether the `fragment` matches this `Route`'s specification.
       */

      Route.prototype.test = function(path) {
        var constraints, matched;
        if (!(matched = this.regExp.test(path))) {
          return false;
        }
        constraints = this.options.constraints;
        if (constraints) {
          return this.testConstraints(this.extractParams(path));
        }
        return true;
      };


      /*
      Handler
      -------
      The handler called by Backbone.History when the route matches.
      It is also called by Router#route which might pass options.
      
      @see application/router.coffee
      
      @param {String} pathSpec The path spec for this `Route` as a url.
      @param {Object} pathSpec The path spec for this `Route` as an object.
      @param {Object} options? Any options tfor this `Route`.
       */

      Route.prototype.handler = function(pathSpec, options) {
        var actionParams, params, path, query, route, _ref;
        options = _.extend({}, options);
        if (_.isObject(pathSpec)) {
          query = Route.stringifyQueryParams(options.query);
          params = pathSpec;
          path = this.reverse(params);
        } else {
          _ref = pathSpec.split('?'), path = _ref[0], query = _ref[1];
          if (query == null) {
            query = '';
          } else {
            options.query = Route.parseQueryString(query);
          }
          params = this.extractParams(path);
          path = Route.processTrailingSlash(path, this.options.trailing);
        }
        actionParams = _.extend({}, params, this.options.params);
        route = {
          path: path,
          action: this.action,
          controller: this.controller,
          name: this.name,
          query: query
        };
        return this.publishEvent('router:match', route, actionParams, options);
      };


      /*
      Extract Params
      --------------
      Extract named parameters from a URL path.
      
      @param {String} path Path spec as a url.
      
      @return {Object} Path spec as an object.
       */

      Route.prototype.extractParams = function(path) {
        var matches, params;
        params = {};
        matches = this.regExp.exec(path);
        _.each(matches.slice(1), (function(_this) {
          return function(match, index) {
            var paramName;
            paramName = _this.allParams.length ? _this.allParams[index] : index;
            return params[paramName] = match;
          };
        })(this));
        return params;
      };

      return Route;

    })()), {
      mixins: ['PubSub.Mixin', 'Freezable.Mixin']
    });
  });

}).call(this);
