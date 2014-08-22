(function() {
  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/evented', 'oraculum/mixins/evented-method'], function(Oraculum) {
    'use strict';
    var _;
    _ = Oraculum.get('underscore');
    return Oraculum.defineMixin('DOMCache.ViewMixin', {
      mixinOptions: {
        eventedMethods: {
          render: {}
        }
      },
      mixconfig: function(mixinOptions, _arg) {
        var domcache;
        domcache = (_arg != null ? _arg : {}).domcache;
        return mixinOptions.domcache = _.extend({}, mixinOptions.domcache, domcache);
      },
      mixinitialize: function() {
        return this.on('render:after', this.cacheDOM, this);
      },
      cacheDOM: function() {
        this.domcache = {};
        _.each(this.$('[data-cache]'), this.cacheElement, this);
        _.each(this.mixinOptions.domcache, this.cacheElement, this);
        return this.trigger('domcache', this);
      },
      cacheElement: function(element, name) {
        var $element;
        $element = this.$(element);
        if (_.isElement(element)) {
          name = $element.attr('data-cache');
        }
        if (name && $element.length) {
          return this.domcache[name] = $element;
        }
      }
    }, {
      mixins: ['Evented.Mixin', 'EventedMethod.Mixin']
    });
  });

}).call(this);
