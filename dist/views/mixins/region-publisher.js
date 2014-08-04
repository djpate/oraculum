(function() {
  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/callback-provider'], function(Oraculum) {
    'use strict';
    return Oraculum.defineMixin('RegionPublisher.ViewMixin', {
      mixconfig: function(mixinOptions, _arg) {
        var regions;
        regions = (_arg != null ? _arg : {}).regions;
        return mixinOptions.regions = _.extend({}, mixinOptions.regions, regions);
      },
      mixinitialize: function() {
        var regions;
        regions = this.mixinOptions.regions;
        if (regions != null) {
          this.executeCallback('region:register', this);
        }
        return this.on('dispose', this.unregisterAllRegions, this);
      },
      registerRegion: function(name, selector) {
        return this.executeCallback('region:register', this, name, selector);
      },
      unregisterRegion: function(name) {
        return this.executeCallback('region:unregister', this, name);
      },
      unregisterAllRegions: function() {
        return this.executeCallback('region:unregister', this);
      }
    }, {
      mixins: ['CallbackDelegate.Mixin']
    });
  });

}).call(this);
