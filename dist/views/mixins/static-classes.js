(function() {
  define(['oraculum', 'oraculum/libs'], function(Oraculum) {
    'use strict';
    var _;
    _ = require('underscore');
    return Oraculum.defineMixin('StaticClasses.ViewMixin', {
      mixinOptions: {
        staticClasses: []
      },
      mixinitialize: function() {
        if (_.isFunction(this.__type)) {
          this._addTagClass(this.__type());
        }
        return this.$el.addClass(_.isArray(this.mixinOptions.staticClasses) ? this.mixinOptions.staticClasses.join(' ') : this.mixinOptions.staticClasses);
      },
      _addTagClass: function(tag) {
        return this.$el.addClass(_.map(tag.split(/[^\w]/), function(region) {
          return _.map(region.match(/[A-Z]?[a-z]+/g), function(value) {
            return value.toLowerCase();
          }).join('-');
        }).join('_'));
      }
    });
  });

}).call(this);
