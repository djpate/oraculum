(function() {
  define(['oraculum', 'oraculum/views/mixins/static-classes'], function(Oraculum) {
    'use strict';

    /*
    Hideable.CellMixin
    ==================
    This mixin enhances the behavior of Cell.ViewMixin to provide hideable
    behavior on a cell based on its columns hidden state.
     */
    return Oraculum.defineMixin('Hideable.CellMixin', {
      mixinOptions: {
        staticClasses: ['hideable-cell-mixin']
      },
      mixinitialize: function() {
        this.column = this.mixinOptions.cell.column;
        this.listenTo(this.column, 'change:hidden', this._updateHiddenState);
        return this._updateHiddenState();
      },
      _updateHiddenState: function() {
        var hidden;
        if ((hidden = this.column.get('hidden')) == null) {
          return;
        }
        return this.$el.toggle(!hidden);
      }
    }, {
      mixins: ['StaticClasses.ViewMixin']
    });
  });

}).call(this);
