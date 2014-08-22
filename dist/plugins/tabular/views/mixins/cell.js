(function() {
  define(['oraculum', 'oraculum/mixins/evented', 'oraculum/views/mixins/static-classes', 'oraculum/plugins/tabular/views/mixins/sortable-cell', 'oraculum/plugins/tabular/views/mixins/hideable-cell'], function(Oraculum) {
    'use strict';

    /*
    Cell.ViewMixin
    ==============
    A "cell" is the intersection of a "column" and a "row".
    In a common tabular view, a "row" may represent a data model,
    and a "column" may represent a rendering specification for the data.
    E.g. what attribute of the data model the cell should render.
    This mixin aims to cover the most common use cases for tabular view cells.
     */
    return Oraculum.defineMixin('Cell.ViewMixin', {
      mixinOptions: {
        staticClasses: ['cell', 'cell-mixin'],
        cell: {
          column: null
        }
      },
      mixconfig: function(_arg, _arg1) {
        var cell, column, model, _ref;
        cell = _arg.cell;
        _ref = _arg1 != null ? _arg1 : {}, model = _ref.model, column = _ref.column;
        if (column != null) {
          cell.column = column;
        }
        if (model != null) {
          if (cell.column == null) {
            cell.column = model;
          }
        }
        if (!cell.column) {
          throw new Error('Cell.ViewMixin#mixconfig: requires a column');
        }
      },
      mixinitialize: function() {
        this.column = this.mixinOptions.cell.column;
        this.listenTo(this.column, 'change:attribute', this._updateAttributeClass);
        return this._updateAttributeClass();
      },
      _updateAttributeClass: function() {
        var current, previous;
        previous = this.column.previous('attribute');
        this.$el.removeClass(("" + previous + "-cell").replace(/[\.\s]/, '-'));
        current = this.column.get('attribute');
        return this.$el.addClass(("" + current + "-cell").replace(/[\.\s]/, '-'));
      }
    }, {
      mixins: ['Evented.Mixin', 'Hideable.CellMixin', 'Sortable.CellMixin', 'StaticClasses.ViewMixin']
    });
  });

}).call(this);
