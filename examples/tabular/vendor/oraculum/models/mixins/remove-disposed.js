(function() {
  define(['oraculum'], function(Oraculum) {
    'use strict';
    return Oraculum.defineMixin('RemoveDisposed.CollectionMixin', {
      mixinOptions: {
        removeDisposed: true
      },
      mixconfig: function(mixinOptions, models, _arg) {
        var removeDisposed;
        removeDisposed = (_arg != null ? _arg : {}).removeDisposed;
        if (removeDisposed != null) {
          return mixinOptions.removeDisposed = removeDisposed;
        }
      },
      mixinitialize: function() {
        if (this.mixinOptions.removeDisposed) {
          return this.enableRemoveDisposed();
        } else {
          return this.disableRemoveDisposed();
        }
      },
      enableRemoveDisposed: function() {
        return this.on('dispose:after', this.removeDisposed, this);
      },
      disableRemoveDisposed: function() {
        return this.off('dispose:after', this.removeDisposed, this);
      },
      removeDisposed: function(model) {
        if (model === this) {
          return;
        }
        return this.remove(model);
      }
    });
  });

}).call(this);
