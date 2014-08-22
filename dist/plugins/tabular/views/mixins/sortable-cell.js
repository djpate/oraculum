(function() {
  define(['oraculum', 'oraculum/views/mixins/static-classes'], function(Oraculum) {
    'use strict';

    /*
    Sortable.CellMixin
    ======================
    This mixin enhances the behavior of Cell.ViewMixin to provide sortable css
    class states on a cell based on its columns sort state.
     */
    return Oraculum.defineMixin('Sortable.CellMixin', {
      mixinOptions: {
        staticClasses: ['sortable-cell-mixin']
      },
      mixinitialize: function() {
        this.column = this.mixinOptions.cell.column;
        this.listenTo(this.column, 'change:sortable', this._updateSortableClass);
        this.listenTo(this.column, 'change:sortDirection', this._updateDirectionClass);
        this._updateSortableClass();
        return this._updateDirectionClass();
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
      }
    }, {
      mixins: ['StaticClasses.ViewMixin']
    });
  });

}).call(this);
