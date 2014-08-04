(function() {
  define(['oraculum', 'oraculum/views/mixins/templating-interface'], function(Oraculum) {
    'use strict';
    return Oraculum.defineMixin('HTMLTemplating.ViewMixin', {
      render: function() {
        var template;
        template = this.mixinOptions.template;
        if (typeof template === 'function') {
          template = template.call(this);
        }
        this.$el.html(template);
        return this;
      }
    }, {
      mixins: ['TemplatingInterface.ViewMixin']
    });
  });

}).call(this);
