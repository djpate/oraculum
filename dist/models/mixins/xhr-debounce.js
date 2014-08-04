(function() {
  define(['oraculum'], function(Oraculum) {
    'use strict';
    return Oraculum.defineMixin('XHRDebounce.ModelMixin', {
      mixinitialize: function() {
        this.on('sync', this.abortDebouncedXHR, this);
        this.on('dispose', this.abortDebouncedXHR, this);
        return this.on('request', (function(_this) {
          return function(model, newRequest) {
            if (model !== _this) {
              return;
            }
            _this.abortDebouncedXHR(_this);
            return _this._debouncedXHR = newRequest;
          };
        })(this));
      },
      abortDebouncedXHR: function(model) {
        var _ref;
        if (model !== this) {
          return;
        }
        if ((_ref = this._debouncedXHR) != null) {
          _ref.abort();
        }
        return delete this._debouncedXHR;
      }
    });
  });

}).call(this);
