(function() {
  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/callback-provider'], function(Oraculum) {
    'use strict';
    var $;
    $ = Oraculum.get('jQuery');
    return Oraculum.defineMixin('RegionSubscriber.ViewMixin', {
      globalRegions: null,
      mixinitialize: function() {
        this.globalRegions = [];
        this.provideCallback('region:show', this.showRegion);
        this.provideCallback('region:find', this.regionByName);
        this.provideCallback('region:register', this.registerRegionHandler);
        return this.provideCallback('region:unregister', this.unregisterRegionHandler);
      },
      registerRegionHandler: function(instance, name, selector) {
        if (name != null) {
          return this.registerGlobalRegion(instance, name, selector);
        } else {
          return this.registerGlobalRegions(instance);
        }
      },
      registerGlobalRegion: function(instance, name, selector) {
        this.unregisterGlobalRegion(instance, name);
        return this.globalRegions.unshift({
          instance: instance,
          name: name,
          selector: selector
        });
      },
      registerGlobalRegions: function(instance) {
        _.each(instance.mixinOptions.regions, (function(_this) {
          return function(selector, name) {
            return _this.registerGlobalRegion(instance, name, selector);
          };
        })(this));
      },
      unregisterRegionHandler: function(instance, name) {
        if (name != null) {
          return this.unregisterGlobalRegion(instance, name);
        } else {
          return this.unregisterGlobalRegions(instance);
        }
      },
      unregisterGlobalRegion: function(instance, name) {
        var cid, region;
        cid = instance.cid;
        return this.globalRegions = (function() {
          var _i, _len, _ref, _results;
          _ref = this.globalRegions;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            region = _ref[_i];
            if (region.instance.cid !== cid || region.name !== name) {
              _results.push(region);
            }
          }
          return _results;
        }).call(this);
      },
      unregisterGlobalRegions: function(instance) {
        var region;
        return this.globalRegions = (function() {
          var _i, _len, _ref, _results;
          _ref = this.globalRegions;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            region = _ref[_i];
            if (region.instance.cid !== instance.cid) {
              _results.push(region);
            }
          }
          return _results;
        }).call(this);
      },
      regionByName: function(name) {
        return _.find(this.globalRegions, function(region) {
          return region.name === name && !region.instance.stale;
        });
      },
      showRegion: function(name, instance) {
        var attach, region;
        region = this.regionByName(name);
        if (!region) {
          throw new Error("No region registered under " + name);
        }
        attach = instance.mixinOptions.attach;
        return attach.container = region.selector === '' ? region.instance.$el : region.instance.noWrap ? $(region.instance.container).find(region.selector) : region.instance.$(region.selector);
      }
    }, {
      mixins: ['CallbackProvider.Mixin']
    });
  });

}).call(this);
