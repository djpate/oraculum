(function() {
  define(['oraculum', 'oraculum/mixins/listener', 'oraculum/mixins/disposable', 'oraculum/views/mixins/cell', 'oraculum/views/mixins/static-classes', 'oraculum/views/mixins/html-templating', 'oraculum/views/mixins/dom-property-binding'], function(Oraculum) {
    'use strict';

    /*
    Text.Cell
    =========
    Like all other concrete implementations in Oraculum, this class exists as a
    convenience/example. Please feel free to override or simply not use this
    definition.
     */

    /*
    This definition is part of Oraculum's tabular interface.
    For more information see:
    
    @see views/cell/text.coffee
    @see views/cell/header.coffee
    @see views/cell/checkbox.coffee
    @see views/mixins/cell.coffee
    @see views/mixins/column-list.coffee
    @see models/mixins/sortable-column.coffee
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
          return "<span data-prop=\"model\" data-prop-attr=\"" + attribute + "\"/>";
        }
      }
    }, {
      mixins: ['Cell.ViewMixin', 'Listener.Mixin', 'Disposable.Mixin', 'StaticClasses.ViewMixin', 'HTMLTemplating.ViewMixin', 'DOMPropertyBinding.ViewMixin']
    });
  });

}).call(this);
