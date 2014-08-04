(function() {
  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/pub-sub', 'oraculum/mixins/listener', 'oraculum/mixins/disposable', 'oraculum/mixins/callback-provider', 'oraculum/application/composition'], function(Oraculum) {
    'use strict';
    var Composer, _;
    _ = Oraculum.get('underscore');

    /*
    Composer
    ========
    The sole job of the composer is to manage the lifecycle of `View`s across
    `Controller` actions. If a `View` has already been composed by a previous
    action then nothing apart from registering the `View` as in-use happens.
    Otherwise, the `View` is constructed with the specified `options`.
    If the application is routed to an action where the `View` was not composed,
    the `View` will disposed.
    
    @see application/controller.coffee
    @see http://backbonejs.org/#View
     */
    return Oraculum.define('Composer', (Composer = (function() {

      /*
      Compositions
      ------------
      This is the collection of composed compositions.
      
      @see application/composition.coffee
      
      @type {Object}
       */
      Composer.prototype.compositions = null;


      /*
      Constructor
      -----------
      Initialize `@compositions` as a new blank object, and allow custom
      initialization via the standard `initialize` method.
       */

      function Composer() {
        this.compositions = {};
        if (typeof this.initialize === "function") {
          this.initialize.apply(this, arguments);
        }
      }


      /*
      Mixin Options
      -------------
      Set up our event listeners and named callbacks.
      
      @see mixins/listener.coffee
      @see mixins/callback-provider.coffee
       */

      Composer.prototype.mixinOptions = {
        listen: {
          'dispose this': '_disposeCompositions',
          'dispatcher:dispatch mediator': '_cleanup'
        },
        provideCallbacks: {
          'composer:compose': 'compose',
          'composer:retrieve': 'retrieve'
        }
      };


      /*
      Retrieve
      --------
      Retrieve an active `composition`'s `item` from our `compositions` collector.
      Will return `undefined` if the named composition doesn't exist, or is stale.
      
      @param {String} name Name of the composition to be retrieved
      
      @return {Composition} If composition `name` exists and is not stale.
       */

      Composer.prototype.retrieve = function(name) {
        var active;
        active = this.compositions[name];
        if (!active) {
          return;
        }
        if (active.stale()) {
          return;
        }
        return active.item;
      };


      /*
      Compose
      -------
      Constructs a composition and adds it into the active compositions.
      This function permits numerous fingerprints. See comments for details.
      
      @see @_composeWithComposition
      @see @_composeWithDefinition
      @see @_composeWithFunction
      @see @_composeWithFunctionAndOptions
      @see @_composeWithOptions
      
      @param {String} name The name of the composition to compose.
      @param {Function} second?
      @param {Object} second?
      @param {Function} third?
      @param {Object} third?
       */

      Composer.prototype.compose = function(name, second, third) {
        var Composition;
        if (_.isFunction(second) || _.isString(second)) {
          Composition = this.__factory().getConstructor('Composition');
          if (second.prototype instanceof Composition) {
            return this._composeWithComposition(name, second, third);
          }
          if (third || _.isString(second) || second.prototype !== Function.prototype) {
            return this._composeWithDefinition(name, second, third);
          }
          return this._composeWithFunction(name, second);
        }
        if (_.isFunction(third)) {
          return this._composeWithFunctionAndOptions(name, third, second);
        }
        return this._composeWithOptions(name, second);
      };


      /*
      Composes with a `Composition` object.
      This method gives complete control over the composition process.
      
      @param {String} name The name of the composition to compose.
      @param {Composition} composition The constructed composition to register.
      @param {Object} options The options to be passed to the `composition`.
       */

      Composer.prototype._composeWithComposition = function(name, composition, options) {
        return this._compose(name, {
          composition: composition,
          options: options
        });
      };


      /*
      Composes a `View` or a factory definition name.
      The options are passed to the instance when it is constructed and are
      further used to test if the `composition` should be re-composed.
      
      @param {String} name The name of the composition to compose.
      @param {Constructor} definition Constructor that the `composition` should create.
      @param {String} definition Factory definition that the `composition` should create.
      @param {Object} options The options to be passed to the `composition`.
       */

      Composer.prototype._composeWithDefinition = function(name, definition, options) {
        if (options == null) {
          options = {};
        }
        return this._compose(name, {
          options: options,
          compose: function() {
            return this.item = _.isString(definition) ? this.__factory().get(definition, this.options) : new definition(this.options);
          }
        });
      };


      /*
      Composes a function that executes in the context of the `Controller`.
      It __does not__ bind the function context.
      
      @param {String} name The name of the composition to compose.
      @param {Function} compose The function to use to compose the `View`.
       */

      Composer.prototype._composeWithFunction = function(name, compose) {
        return this._compose(name, {
          compose: compose
        });
      };


      /*
      Composes using the `compose` function in the context of the `Controller`.
      It __does not__ bind the function context, and is passed the `options` as
      a parameter. The `options` are further used to test if the `composition`
      should be re-composed.
      
      @param {String} name The name of the composition to compose.
      @param {Function} compose The function to use to compose the `composition`.
      @param {Object} options The options to be passed to the `composition`.
       */

      Composer.prototype._composeWithFunctionAndOptions = function(name, compose, options) {
        return this._compose(name, {
          options: options,
          compose: compose
        });
      };


      /*
      Calls the `compose` method of the `options` hash in place of a function.
      If present, the `check` method of the `options` hash is called to determine
      if re-composition is necessary.
      If not present, this method is functionally identical to
      `_composeWithFunctionAndOptions`.
      
      @see @_composeWithFunctionAndOptions
      
      @param {String} name The name of the composition to compose.
      @param {Object} options The options to be passed to the `composition`.
       */

      Composer.prototype._composeWithOptions = function(name, options) {
        return this._compose(name, options);
      };


      /*
      Performs the actual composition after everything else gets "normalized".
      
      @param {String} name The name of the composition to compose.
      @param {Object} options The composition specification.
      
      @return {Promise?} May return a promise if the composition returns one.
       */

      Composer.prototype._compose = function(name, options) {
        var composition, current, isPromise, returned;
        if (typeof options.compose !== 'function' && (options.composition == null)) {
          throw new Error('Composer#compose was used incorrectly');
        }
        if (options.composition != null) {
          composition = new options.composition(options.options);
        } else {
          composition = this.__factory().get('Composition', options.options);
          composition.compose = options.compose;
          if (options.check != null) {
            composition.check = options.check;
          }
        }
        current = this.compositions[name];
        if (current && current.check(composition.options)) {
          current.stale(false);
        } else {
          if (current) {
            current.dispose();
          }
          returned = composition.compose(composition.options);
          isPromise = returned && _.isFunction(returned.then);
          composition.stale(false);
          this.compositions[name] = composition;
        }
        if (isPromise) {
          return returned;
        } else {
          return this.compositions[name].item;
        }
      };


      /*
      Cleanup
      -------
      Any dispatched `Controller` action should be complete.
      Perform post-action disposal and delete all inactive compositions.
      Declare all active compositions as stale for the next dispatch cycle.
      
      @see application/composition.coffee
      @see mixins/disposable.coffee
       */

      Composer.prototype._cleanup = function() {
        return _.each(this.compositions, (function(_this) {
          return function(composition, name) {
            if (composition.stale()) {
              composition.dispose();
              return delete _this.compositions[name];
            } else {
              return composition.stale(true);
            }
          };
        })(this));
      };


      /*
      Dispose Compositions
      --------------------
      Invoke dispose on all of our compositions for memory-mamagement.
      
      @see mixins/disposable.coffee
       */

      Composer.prototype._disposeCompositions = function() {
        return _.invoke(this.compositions, 'dispose');
      };

      return Composer;

    })()), {
      mixins: ['PubSub.Mixin', 'Listener.Mixin', 'Disposable.Mixin', 'CallbackProvider.Mixin']
    });
  });

}).call(this);
