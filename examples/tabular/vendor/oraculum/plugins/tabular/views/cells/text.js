(function() {
  define(['oraculum', 'oraculum/mixins/listener', 'oraculum/mixins/disposable', 'oraculum/views/mixins/static-classes', 'oraculum/views/mixins/html-templating', 'oraculum/views/mixins/dom-property-binding', 'oraculum/plugins/tabular/views/mixins/cell'], function(Oraculum) {
    'use strict';

    /*
    Text.Cell
    =========
    Like all other concrete implementations in Oraculum, this class exists as a
    convenience/example. Please feel free to override or simply not use this
    definition.
     */
    return Oraculum.extend('View', 'Text.Cell', {
      mixinOptions: {
        staticClasses: ['text-cell-view'],
        listen: {
          'change:attribute column': 'render',
          'change:display_attribute column': 'render'
        },
        template: function() {
          var attribute;
          attribute = this.column.get('display_attribute');
          if (attribute == null) {
            attribute = this.column.get('attribute');
          }
          return "<span data-prop='model' data-prop-attr='" + attribute + "'/>";
        }
      }
    }, {
      mixins: ['Cell.ViewMixin', 'Listener.Mixin', 'Disposable.Mixin', 'StaticClasses.ViewMixin', 'HTMLTemplating.ViewMixin', 'DOMPropertyBinding.ViewMixin']
    });
  });

}).call(this);
