(function() {
  define(['oraculum'], function(Oraculum) {
    'use strict';
    return Oraculum.defineMixin('AutoRender.ViewMixin', {
      mixinOptions: {
        autoRender: true
      },
      mixconfig: function(mixinOptions, _arg) {
        var autoRender;
        autoRender = (_arg != null ? _arg : {}).autoRender;
        if (autoRender != null) {
          return mixinOptions.autoRender = autoRender;
        }
      },
      mixinitialize: function() {
        if (this.mixinOptions.autoRender === true) {
          return this.render();
        }
      }
    });
  });

}).call(this);
