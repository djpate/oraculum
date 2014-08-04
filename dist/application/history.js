(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['oraculum', 'oraculum/libs'], function(Oraculum) {
    'use strict';
    var Backbone, History, rootStripper, routeStripper, trailingSlash, _;
    _ = Oraculum.get('underscore');
    Backbone = Oraculum.get('Backbone');
    routeStripper = /^[#\/]|\s+$/g;
    rootStripper = /^\/+|\/+$/g;
    trailingSlash = /\/$/;

    /*
    History
    =======
    Patch Backbone.History with a basic query strings support.
    
    @see http://backbonejs.org/#History
     */
    return Oraculum.define('History', History = (function(_super) {
      __extends(History, _super);

      function History() {
        return History.__super__.constructor.apply(this, arguments);
      }


      /*
      Get Fragment Override
      ---------------------
      Get the cross-browser normalized URL fragment, either from the URL,
      the hash, or the override.
      
      @param {String} fragment The current URL fragment.
      @param {Boolean} forcePushState? Flag used to force a change to the URL via push state.
       */

      History.prototype.getFragment = function(fragment, forcePushState) {
        var root;
        if (fragment == null) {
          if (this._hasPushState || !this._wantsHashChange || forcePushState) {
            root = this.root.replace(trailingSlash, '');
            fragment = this.location.pathname + this.location.search;
            if (!fragment.indexOf(root)) {
              fragment = fragment.substr(root.length);
            }
          } else {
            fragment = this.getHash();
          }
        }
        return fragment.replace(routeStripper, '');
      };


      /*
      Start Override
      --------------
      Start the hash change handling, returning `true` if the current URL matches
      an existing route, and `false` otherwise.
      
      @param {Object} options
       */

      History.prototype.start = function(options) {
        var atRoot, loc, _ref;
        if (Backbone.History.started === true) {
          throw new Error('Backbone.history has already been started');
        }
        Backbone.History.started = true;
        this.options = _.extend({}, {
          root: '/'
        }, this.options, options);
        this.root = this.options.root;
        this.fragment = this.getFragment();
        this._hasPushState = Boolean(this.options.pushState && ((_ref = this.history) != null ? _ref.pushState : void 0));
        this._wantsPushState = Boolean(this.options.pushState);
        this._wantsHashChange = this.options.hashChange !== false;
        this.root = ("/" + this.root + "/").replace(rootStripper, '/');
        if (this._hasPushState) {
          Backbone.$(window).on('popstate', this.checkUrl);
        } else if (this._wantsHashChange && 'onhashchange' in window) {
          Backbone.$(window).on('hashchange', this.checkUrl);
        } else if (this._wantsHashChange) {
          this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
        }
        loc = this.location;
        atRoot = this.location.pathname.replace(/[^\/]$/, '$&/') === this.root;
        if (this._wantsPushState && this._wantsHashChange) {
          if (!atRoot && !this._hasPushState) {
            this.fragment = this.getFragment(null, true);
            this.location.replace("" + this.root + "#" + this.fragment);
            return true;
          } else if (atRoot && loc.hash) {
            this.fragment = this.getHash().replace(routeStripper, '');
            this.history.replaceState({}, document.title, "" + this.root + this.fragment);
          }
        }
        if (!this.options.silent) {
          return this.loadUrl();
        }
      };


      /*
      Navigate Override
      -----------------
      Save a fragment into the hash history, or replace the URL state if the
      'replace' option is passed. You are responsible for properly URL-encoding
      the fragment in advance.
      
      The options object can contain `trigger: true` if you wish to have the
      route callback be fired (not usually desirable), or `replace: true`, if
      you wish to modify the current URL without adding an entry to the history.
      
      @param {String} fragment The url fragment to route.
      @param {Object} options? An object containing navigation options.
      @param {Boolean} options? An Boolean value indicating whether to trigger the route callback.
       */

      History.prototype.navigate = function(fragment, options) {
        var historyMethod, isSameFragment, url;
        if (fragment == null) {
          fragment = '';
        }
        if (options == null) {
          options = false;
        }
        if (!Backbone.History.started) {
          return false;
        }
        if (_.isBoolean(options)) {
          options = {
            trigger: options
          };
        }
        fragment = this.getFragment(fragment);
        url = "" + this.root + fragment;
        if (this.fragment === fragment) {
          return false;
        }
        this.fragment = fragment;
        if (fragment.length === 0 && url !== '/') {
          url = url.slice(0, -1);
        }
        if (this._hasPushState) {
          historyMethod = options.replace ? 'replaceState' : 'pushState';
          this.history[historyMethod]({}, document.title, url);
        } else if (this._wantsHashChange) {
          this._updateHash(this.location, fragment, options.replace);
          isSameFragment = fragment !== this.getFragment(this.getHash(this.iframe));
          if ((this.iframe != null) && isSameFragment) {
            if (!options.replace) {
              this.iframe.document.open().close();
            }
            this._updateHash(this.iframe.location, fragment, options.replace);
          }
        } else {
          return this.location.assign(url);
        }
        if (options.trigger) {
          return this.loadUrl(fragment);
        }
      };

      return History;

    })(Backbone.History));
  });

}).call(this);
