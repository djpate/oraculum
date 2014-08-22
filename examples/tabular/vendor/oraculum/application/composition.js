(function() {
  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/evented', 'oraculum/mixins/disposable'], function(Oraculum) {
    'use strict';
    var Backbone, Composition, _;
    _ = Oraculum.get('underscore');
    Backbone = Oraculum.get('Backbone');

    /*
    Composition
    ===========
    The role of a composition is to control the lifecycle of a view between
    controller actions.
    Compositions are managed by the `Composer` and used to track and maintain
    the state of an interlying `item`.
    Currently, the `Composer` is only intended to manage `View`s.
    
    @see application/composer.coffee
    @see http://backbonejs.org/#View
     */
    return Oraculum.define('Composition', (Composition = (function() {

      /*
      State variable tracking the composed item.
      
      @type {View}
       */
      Composition.prototype.item = null;


      /*
      State variable tracking whether the composed item is "stale".
      A composition becomes "stale" when the controlling `Composer` receives
      the `dispatcher:dispatch` event from the global message bus, indicating
      that the current dispatch cycle has been completed.
      
      @type {Boolean}
       */

      Composition.prototype._stale = false;


      /*
      A local cache of the options that this composition was constructed with.
      
      @type {Object}
       */

      Composition.prototype.options = null;


      /*
      Constructor
      -----------
      
      @param {Object} options The options to be used to construct/test our composed `View`
       */

      function Composition(options) {
        this.item = this;
        this.options = _.extend({}, options);
        if (typeof this.initialize === "function") {
          this.initialize.apply(this, arguments);
        }
      }


      /*
      Mixin Options
      -------------
      Instruct the `Disposable.Mixin` to dispose all of our properties upon
      disposal.
      
      @see mixins/disposable.coffee
       */

      Composition.prototype.mixinOptions = {
        disposable: {
          disposeAll: true
        }
      };


      /*
      Compose
      -------
      The compose method is called to construct the underlying `View`.
      It is a no-op method by default, and gets assigned during the `Composer`'s
      `_compose` method.
      
      @see application/composer.coffee
       */

      Composition.prototype.compose = function() {};


      /*
      Check
      -----
      This method is called when the `Composer` attempts to re-compose this
      composition. The default implementation checks if the keys/values of
      `options` are the same as the keys/values of `@options`, however this method
      may be overridden during the `Composer`'s `_compose` method.
      
      @see application/composer.coffee
      
      @param {Object} options The options for the new composition.
      
      @return {Boolean} Whether `options` matches `@options`
       */

      Composition.prototype.check = function(options) {
        return _.isEqual(options, this.options);
      };


      /*
      Stale
      -----
      Getter/setter for the `@_stale` property.
      
      @param {Undefined} value Gets the current value of `@_stale`.
      @param {Boolean} value Sets the current value of `@_stale`.
      
      @return {Boolean?} The value of `@_stale` if `value` is `undefined`.
       */

      Composition.prototype.stale = function(value) {
        if (value == null) {
          return this._stale;
        }
        this._stale = value;
        _.each(this, function(property, name) {
          if (property === this) {
            return;
          }
          if (property == null) {
            return;
          }
          if (property._stale == null) {
            return;
          }
          return property._stale = value;
        });
      };

      return Composition;

    })()), {
      mixins: ['Evented.Mixin', 'Disposable.Mixin']
    });
  });

}).call(this);
