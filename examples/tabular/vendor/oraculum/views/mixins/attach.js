(function() {
  define(['oraculum', 'oraculum/mixins/pub-sub', 'oraculum/mixins/evented-method'], function(Oraculum) {
    'use strict';
    var $;
    $ = Oraculum.get('jQuery');
    return Oraculum.defineMixin('Attach.ViewMixin', {
      mixinOptions: {
        attach: {
          auto: true,
          container: null,
          containerMethod: 'append'
        },
        eventedMethods: {
          render: {},
          attach: {}
        }
      },
      mixconfig: function(_arg, _arg1) {
        var attach, autoAttach, container, containerMethod, _ref;
        attach = _arg.attach;
        _ref = _arg1 != null ? _arg1 : {}, autoAttach = _ref.autoAttach, container = _ref.container, containerMethod = _ref.containerMethod;
        if (autoAttach != null) {
          attach.auto = autoAttach;
        }
        if (container != null) {
          attach.container = container;
        }
        if (containerMethod != null) {
          return attach.containerMethod = containerMethod;
        }
      },
      mixinitialize: function() {
        return this.on('render:after', (function(_this) {
          return function() {
            if (_this.mixinOptions.attach.auto) {
              return _this.attach();
            }
          };
        })(this));
      },
      attach: function() {
        var container, containerMethod, _ref;
        _ref = this.mixinOptions.attach, container = _ref.container, containerMethod = _ref.containerMethod;
        if (!(container && containerMethod)) {
          return;
        }
        if (document.body.contains(this.el)) {
          return;
        }
        $(container)[containerMethod](this.el);
        return this.trigger('addedToParent');
      }
    }, {
      mixins: ['EventedMethod.Mixin']
    });
  });

}).call(this);
