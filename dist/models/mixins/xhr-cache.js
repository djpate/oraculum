(function() {
  define(['oraculum'], function(Oraculum) {
    'use strict';
    return Oraculum.defineMixin('XHRCache.ModelMixin', {
      mixinitialize: function() {
        this._cachedXHRs = [];
        this.on('sync', this._removeXHR, this);
        return this.on('request', this._cacheXHR, this);
      },
      _cacheXHR: function(model, xhr) {
        this._cachedXHRs.push(xhr);
        return this._cachedXHRs;
      },
      _removeXHR: function(model, resp, _arg) {
        var index, xhr;
        xhr = _arg.xhr;
        index = this._cachedXHRs.indexOf(xhr);
        this._cachedXHRs.splice(index, 1);
        return this._cachedXHRs;
      }
    });
  });

}).call(this);
