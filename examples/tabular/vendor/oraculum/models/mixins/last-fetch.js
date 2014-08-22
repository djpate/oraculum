(function() {
  define(['oraculum', 'oraculum/mixins/evented', 'oraculum/mixins/evented-method'], function(Oraculum) {
    'use strict';
    return Oraculum.defineMixin('LastFetch.ModelMixin', {
      mixinOptions: {
        eventedMethods: {
          fetch: {}
        }
      },
      mixinitialize: function() {
        return this.on('fetch:before', (function(_this) {
          return function() {
            return _this._lastFetchedAt = new Date();
          };
        })(this));
      },
      lastFetch: function() {
        return this._lastFetchedAt;
      },
      hasFetched: function() {
        return Boolean(this._lastFetchedAt);
      }
    }, {
      mixins: ['Evented.Mixin', 'EventedMethod.Mixin']
    });
  });

}).call(this);
