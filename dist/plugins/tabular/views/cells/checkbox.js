(function() {
  define(['oraculum', 'oraculum/mixins/listener', 'oraculum/mixins/disposable', 'oraculum/mixins/evented-method', 'oraculum/views/mixins/static-classes', 'oraculum/views/mixins/html-templating', 'oraculum/plugins/tabular/views/mixins/cell'], function(Oraculum) {
    'use strict';

    /*
    Checkbox.Cell
    =============
    This cell provides a simple checkbox for representing the boolean state
    of an attribute on a model. It supports two-way binding to the model.
    
    Like all other concrete implementations in Oraculum, this class exists as a
    convenience/example. Please feel free to override or simply not use this
    definition.
     */
    return Oraculum.extend('View', 'Checkbox.Cell', {
      events: {
        'change input': '_updateModel'
      },
      mixinOptions: {
        staticClasses: ['checkbox-cell-view'],
        eventedMethods: {
          render: {}
        },
        listen: {
          'render:after this': '_updateCheckbox'
        },
        template: '<input type="checkbox" />'
      },
      constructed: function() {
        this.listenTo(this.column, 'change:attribute', this._resetModelListener);
        return this._resetModelListener();
      },
      _resetModelListener: function() {
        var current, previous;
        if (previous = this.column.previous('attribute')) {
          this.stopListening(this.model, "change:" + previous, this._updateCheckbox);
        }
        current = this.column.get('attribute');
        this.listenTo(this.model, "change:" + current, this._updateCheckbox);
        return this._updateCheckbox();
      },
      _updateCheckbox: function() {
        var attribute, checked;
        attribute = this.column.get('attribute');
        checked = Boolean(this.model.get(attribute));
        return this.$('input').prop('checked', checked);
      },
      _updateModel: function() {
        var attribute, checked;
        checked = this.$('input').is(':checked');
        attribute = this.column.get('attribute');
        return this.model.set(attribute, checked);
      }
    }, {
      mixins: ['Listener.Mixin', 'Disposable.Mixin', 'EventedMethod.Mixin', 'Cell.ViewMixin', 'StaticClasses.ViewMixin', 'HTMLTemplating.ViewMixin']
    });
  });

}).call(this);
