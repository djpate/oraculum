(function() {
  define(['oraculum', 'oraculum/libs'], function(Oraculum) {
    'use strict';
    var _;
    _ = Oraculum.get('underscore');

    /*
    AutoFetch.ModelMixin
    ====================
    Automatically fetch a model as soon as it's created.
     */
    return Oraculum.defineMixin('AutoFetch.ModelMixin', {

      /*
      Mixin Options
      -------------
      Allow the autoFetch behavior to be configured on a definition.
       */
      mixinOptions: {
        autoFetch: {
          fetch: true,
          fetchOptions: null
        }
      },

      /*
      Mixconfig
      ---------
      Allow autoFetch options to passed in the contructor options.
      
      @param {Boolean} autoFetch Set the `fetch` flag.
      @param {Object} fetchOptions Extend the default fetchOptions.
       */
      mixconfig: function(_arg, attrs, _arg1) {
        var autoFetch, fetch, fetchOptions, _ref;
        autoFetch = _arg.autoFetch;
        _ref = _arg1 != null ? _arg1 : {}, fetch = _ref.autoFetch, fetchOptions = _ref.fetchOptions;
        if (fetch != null) {
          autoFetch.fetch = fetch;
        }
        return autoFetch.fetchOptions = _.extend({}, autoFetch.fetchOptions, fetchOptions);
      },

      /*
      Mixinitialize
      -------------
      Automatically fetch the model if we're still confugred to do so.
       */
      mixinitialize: function() {
        var fetch, fetchOptions, _ref;
        _ref = this.mixinOptions.autoFetch, fetch = _ref.fetch, fetchOptions = _ref.fetchOptions;
        if (fetch) {
          return this.fetch(fetchOptions);
        }
      }
    });
  });

}).call(this);
