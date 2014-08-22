(function() {
  define(['oraculum'], function(Oraculum) {
    'use strict';
    return Oraculum.defineMixin('StaticClasses.ViewMixin', {
      mixinOptions: {
        staticClasses: []
      },
      mixinitialize: function() {
        return this.$el.addClass(this.mixinOptions.staticClasses.join(' '));
      }
    });
  });

}).call(this);
