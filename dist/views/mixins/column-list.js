(function() {
  define(['oraculum', 'oraculum/libs', 'oraculum/views/mixins/list'], function(Oraculum) {
    'use strict';

    /*
    ColumnList.ViewMixin
    ====================
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
    return Oraculum.defineMixin('ColumnList.ViewMixin', {
      initModelView: function(column) {
        var attribute, model, modelView, view, viewOptions, _ref;
        _ref = this.mixinOptions.list, modelView = _ref.modelView, viewOptions = _ref.viewOptions;
        modelView = column.get('modelView') || modelView;
        if (!modelView) {
          throw new TypeError('ColumList.ViewMixin modelView option must be defined.');
        }
        model = this.model || column;
        viewOptions = _.isFunction(viewOptions) ? viewOptions.call(this, {
          model: model,
          column: column
        }) : _.extend({
          model: model,
          column: column
        }, viewOptions);
        attribute = column.get('attribute');
        viewOptions = _.extend({}, viewOptions, column.get('viewOptions'));
        view = this.createView({
          view: modelView,
          viewOptions: viewOptions
        });
        return view;
      }
    }, {
      mixins: ['List.ViewMixin']
    });
  });

}).call(this);
