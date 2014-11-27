(function() {
  define(['oraculum', 'oraculum/mixins/disposable'], function(Oraculum) {
    'use strict';

    /*
    Disposable.CollectionMixin
    ==========================
    Extend the functionality of `Disposable.Mixin` to automatically dispose
    models belonging to a collection when the collection is disposed.
    
    @see mixins/disposable.coffee
     */
    return Oraculum.defineMixin('Disposable.CollectionMixin', {

      /*
      MixinOptions
      ------------
      Allow the model disposal behavior to be configured by extending the
      `disposable` configuration with the `disposeModels` flag.
      Default is false.
       */
      mixinOptions: {
        disposable: {
          disposeModels: false
        }
      },

      /*
      Mixconfig
      ---------
      Allow the `disposeModels` flag to passed in the contructor options.
      
      @param {Boolean} disposeModels Set the `disposeModels` flag.
       */
      mixconfig: function(_arg, models, _arg1) {
        var disposable, disposeModels;
        disposable = _arg.disposable;
        disposeModels = (_arg1 != null ? _arg1 : {}).disposeModels;
        if (disposeModels != null) {
          return disposable.disposeModels = disposeModels;
        }
      },

      /*
      Mixinitialize
      -------------
      Set up an event listener to react to the disposal of this instance.
       */
      mixinitialize: function() {
        return this.on('dispose', (function(_this) {
          return function(target) {
            if (target !== _this) {
              return;
            }
            if (!_this.mixinOptions.disposable.disposeModels) {
              return;
            }
            return _.invoke(_this.models.slice(), 'dispose');
          };
        })(this));
      }
    }, {
      mixins: ['Disposable.Mixin']
    });
  });

}).call(this);
