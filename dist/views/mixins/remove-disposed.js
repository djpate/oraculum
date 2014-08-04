(function() {
  define(['oraculum', 'oraculum/mixins/evented'], function(Oraculum) {
    'use strict';
    return Oraculum.defineMixin('RemoveDisposed.ViewMixin', {
      mixinOptions: {
        disposable: {
          keepElement: false
        }
      },
      mixconfig: function(_arg, _arg1) {
        var disposable, keepElement;
        disposable = _arg.disposable;
        keepElement = (_arg1 != null ? _arg1 : {}).keepElement;
        if (keepElement != null) {
          return disposable.keepElement = keepElement;
        }
      },
      mixinitialize: function() {
        return this.on('dispose', (function(_this) {
          return function() {
            var keepElement;
            keepElement = _this.mixinOptions.disposable.keepElement;
            if (keepElement !== true) {
              return _this.remove();
            }
          };
        })(this));
      }
    }, {
      mixins: ['Evented.Mixin']
    });
  });

}).call(this);
