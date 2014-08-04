(function() {
  define(['oraculum', 'oraculum/mixins/evented', 'oraculum/views/mixins/static-classes'], function(Oraculum) {
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
    return Oraculum.defineMixin('Cell.ViewMixin', {
      mixinOptions: {
        staticClasses: ['cell'],
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
        this.listenTo(this.column, 'change:sortable', this._updateSortableClass);
        this.listenTo(this.column, 'change:attribute', this._updateAttributeClass);
        this.listenTo(this.column, 'change:sortDirection', this._updateDirectionClass);
        this.listenTo(this.column, 'change:hidden', this._updateHiddenState);
        this._updateSortableClass();
        this._updateAttributeClass();
        this._updateDirectionClass();
        return this._updateHiddenState();
      },
      _updateAttributeClass: function() {
        var current, previous;
        previous = this.column.previous('attribute');
        this.$el.removeClass("" + previous + "-cell");
        current = this.column.get('attribute');
        return this.$el.addClass("" + current + "-cell");
      },
      _updateSortableClass: function() {
        var sortable;
        sortable = Boolean(this.column.get('sortable'));
        return this.$el.toggleClass('sortable', sortable);
      },
      _updateDirectionClass: function() {
        var direction;
        direction = this.column.get('sortDirection');
        this.$el.toggleClass('sorted', Boolean(direction));
        this.$el.toggleClass('ascending', direction === -1);
        return this.$el.toggleClass('descending', direction === 1);
      },
      _updateHiddenState: function() {
        var hidden;
        hidden = this.column.get('hidden');
        if (hidden == null) {
          return;
        }
        return this.$el.toggle(!hidden);
      }
    }, {
      mixins: ['Evented.Mixin', 'StaticClasses.ViewMixin']
    });
  });

}).call(this);
