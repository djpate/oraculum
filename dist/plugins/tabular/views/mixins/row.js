(function() {
  define(['oraculum', 'oraculum/views/mixins/list', 'oraculum/views/mixins/static-classes'], function(Oraculum) {
    'use strict';

    /*
    Row.ViewMixin
    =============
     */
    return Oraculum.defineMixin('Row.ViewMixin', {
      mixinOptions: {
        staticClasses: ['row-mixin']
      },
      initModelView: function(column) {
        var model, modelView, view, viewOptions, _ref;
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
        viewOptions = _.extend({}, viewOptions, column.get('viewOptions'));
        view = this.createView({
          view: modelView,
          viewOptions: viewOptions
        });
        return view;
      }
    }, {
      mixins: ['List.ViewMixin', 'StaticClasses.ViewMixin']
    });
  });

}).call(this);
