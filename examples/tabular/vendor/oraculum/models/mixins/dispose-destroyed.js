(function() {
  define(['oraculum', 'oraculum/libs'], function(Oraculum) {
    'use strict';
    var _;
    _ = Oraculum.get('underscore');

    /*
    DisposeDestroyed.ModelMixin
    ===========================
    Automatically `dispose` a `Model` that has been destroyed.
    This mixin is written such that it can be used at the `Model` layer or at the
    `Collection` layer.
     */
    return Oraculum.defineMixin('DisposeDestroyed.ModelMixin', {

      /*
      Mixin Options
      -------------
      Allow the `disposeDestroyed` flag to be set on the definition.
       */
      mixinOptions: {
        disposeDestroyed: true
      },

      /*
      Mixconfig
      ---------
      Allow the `disposeDestroyed` flag to be set in the constructor options.
      
      @param {Boolean} disposeDestroyed Whether or not to `dispose` destroyed `Model`s.
       */
      mixconfig: function(mixinOptions, models, _arg) {
        var disposeDestroyed;
        disposeDestroyed = (_arg != null ? _arg : {}).disposeDestroyed;
        if (disposeDestroyed != null) {
          return mixinOptions.disposeDestroyed = disposeDestroyed;
        }
      },

      /*
      Mixinitialize
      -------------
      Set up an event listener to respond to `destroy` events by invoking
      `dispose` on the destroyed `Model`.
      By design, this will throw if the target `model` does not implement the
      `dispose` method.
       */
      mixinitialize: function() {
        return this.on('destroy', (function(_this) {
          return function(model) {
            if (!_this.mixinOptions.disposeDestroyed) {
              return;
            }
            return _.defer(function() {
              return model.dispose();
            });
          };
        })(this));
      }
    });
  });

}).call(this);
