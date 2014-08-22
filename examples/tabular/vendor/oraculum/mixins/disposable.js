(function() {
  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/evented', 'oraculum/mixins/freezable'], function(Oraculum) {
    'use strict';
    var _;
    _ = Oraculum.get('underscore');

    /*
    Disposable.Mixin
    ================
    This mixin is the heart of the memory management in Oraculum.
    Originally derived from Chaplin's per-class dispose() implementations,
    this mixin provides disposal in a uniform way that can be applied to any
    definition provided by Oraculum.
     */
    return Oraculum.defineMixin('Disposable.Mixin', {

      /*
      Mixin Options
      -------------
      Provide a namespace for disposable configuration and expose the
      `disposeAll` configuration option. When true, the `dispose` method
      will attempt to invoke `dispose` on any top-level attribute of the
      instance it was called on.
       */
      mixinOptions: {
        disposable: {
          disposeAll: false
        }
      },

      /*
      Dispose
      -------
      The disposal interface.
       */
      dispose: function() {
        var _ref;
        if (this.disposed) {
          return this;
        }
        this.trigger('dispose:before', this);
        this.trigger('dispose', this);
        this.disposed = true;
        this.trigger('dispose:after', this);
        this.off();
        this.stopListening();
        if ((_ref = this.mixinOptions.disposable) != null ? _ref.disposeAll : void 0) {
          _.each(this, function(prop, name) {
            return prop != null ? typeof prop.dispose === "function" ? prop.dispose() : void 0 : void 0;
          });
        }
        if (!(typeof Object.isFrozen === "function" ? Object.isFrozen(this) : void 0)) {
          _.each(this, (function(_this) {
            return function(prop, name) {
              if (_.isFunction(prop)) {
                return;
              }
              if (!_.isObject(prop)) {
                return;
              }
              return delete _this[name];
            };
          })(this));
        }
        this.freeze();
        if (this.__factory().verifyTags(this)) {
          return this.__dispose(this);
        }
      }
    }, {
      mixins: ['Evented.Mixin', 'Freezable.Mixin']
    });
  });

}).call(this);
