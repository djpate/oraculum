(function() {
  define(['oraculum', 'oraculum/libs', 'oraculum/views/mixins/attach', 'oraculum/mixins/evented-method', 'oraculum/mixins/callback-provider'], function(Oraculum) {
    'use strict';
    return Oraculum.defineMixin('RegionAttach.ViewMixin', {
      mixinOptions: {
        attach: {
          region: null
        },
        eventedMethods: {
          attach: {}
        }
      },
      mixconfig: function(_arg, _arg1) {
        var attach, region;
        attach = _arg.attach;
        region = (_arg1 != null ? _arg1 : {}).region;
        if (region != null) {
          return attach.region = region;
        }
      },
      mixinitialize: function() {
        return this.on('attach:before', this._attachRegion, this);
      },
      _attachRegion: function() {
        var region;
        if (!(region = this.mixinOptions.attach.region)) {
          return;
        }
        return this.executeCallback('region:show', region, this);
      }
    }, {
      mixins: ['Attach.ViewMixin', 'EventedMethod.Mixin', 'CallbackDelegate.Mixin']
    });
  });

}).call(this);
