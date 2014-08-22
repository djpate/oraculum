(function() {
  define(['oraculum'], function(Oraculum) {
    'use strict';

    /*
    DisposeRemoved.CollectionMixin
    ==============================
    Automatically `dispose` a `Model` that has been removed from a `Collection`.
    This mixin is intended to be used at the `Collection` layer so that it can
    ensure that it's not disposing of `Model`s that may have been removed from
    a separate `Collection`.
     */
    return Oraculum.defineMixin('DisposeRemoved.CollectionMixin', {

      /*
      Mixin Options
      -------------
      Allow the `disposeRemoved` flag to be set on the definition.
       */
      mixinOptions: {
        disposeRemoved: true
      },

      /*
      Mixconfig
      ---------
      Allow the `disposeRemoved` flag to be set in the constructor options.
      
      @param {Boolean} disposeRemoved Whether or not to `dispose` removed `Model`s.
       */
      mixconfig: function(mixinOptions, models, _arg) {
        var disposeRemoved;
        disposeRemoved = (_arg != null ? _arg : {}).disposeRemoved;
        if (disposeRemoved != null) {
          return mixinOptions.disposeRemoved = disposeRemoved;
        }
      },

      /*
      Mixinitialize
      -------------
      Set up an event listener to respond to `remove` events by invoking `dispose`
      on the removed `Model`. Additionally, add an event listener to respond to
      `reset` events by invoking `dispose` on `Model`s that were removed during
      the `reset` operation.
      By design, this will throw if the target model does not impement the
      `dispose` method.
       */
      mixinitialize: function() {
        this.on('remove', (function(_this) {
          return function(model) {
            if (!_this.mixinOptions.disposeRemoved) {
              return;
            }
            return model.dispose();
          };
        })(this));
        return this.on('reset', (function(_this) {
          return function(models, _arg) {
            var previousModels;
            previousModels = _arg.previousModels;
            if (!_this.mixinOptions.disposeRemoved) {
              return;
            }
            return _.invoke(previousModels, 'dispose');
          };
        })(this));
      }
    });
  });

}).call(this);
