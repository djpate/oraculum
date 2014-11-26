(function() {
  define(['oraculum', 'oraculum/mixins/evented', 'oraculum/models/mixins/disposable', 'oraculum/models/mixins/dispose-removed', 'oraculum/models/mixins/sort-by-attribute-direction'], function(Oraculum) {
    'use strict';
    var stateModelName;
    stateModelName = '_SortByMultiAttributeDirectionInterfaceState.Collection';
    Oraculum.extend('Collection', stateModelName, {
      model: '_SortByAttributeDirectionInterfaceState.Model'
    }, {
      mixins: ['Disposable.CollectionMixin', 'DisposeRemoved.CollectionMixin']
    });
    return Oraculum.defineMixin('SortByMultiAttributeDirectionInterface.CollectionMixin', {
      mixinOptions: {
        sortByMultiAttributeDirection: {
          defaults: []
        }
      },
      mixconfig: function(_arg, models, _arg1) {
        var sortByMultiAttributeDirection, sortDefaults;
        sortByMultiAttributeDirection = _arg.sortByMultiAttributeDirection;
        sortDefaults = (_arg1 != null ? _arg1 : {}).sortDefaults;
        if (sortDefaults != null) {
          return sortByMultiAttributeDirection.defaults = sortDefaults;
        }
      },
      mixinitialize: function() {
        var defaults;
        defaults = this.mixinOptions.sortByMultiAttributeDirection.defaults;
        this.sortState = this.__factory().get(stateModelName, defaults);
        return this.on('dispose', (function(_this) {
          return function(target) {
            if (target !== _this) {
              return;
            }
            _this.sortState.dispose();
            return delete _this.sortState;
          };
        })(this));
      },
      addAttributeDirection: function(attribute, direction) {
        if (!direction) {
          return this.removeAttributeDirection(attribute);
        }
        return this.sortState.add({
          attribute: attribute,
          direction: direction
        }, {
          merge: true
        });
      },
      getAttributeDirection: function(attribute) {
        var model;
        if (!(model = this.sortState.get(attribute))) {
          return 0;
        }
        return model.get('direction');
      },
      removeAttributeDirection: function(attribute) {
        var model;
        if (!this.getAttributeDirection(attribute)) {
          return;
        }
        model = this.sortState.get(attribute);
        return this.sortState.remove(model);
      },
      unsort: function() {
        if (!this.sortState.isEmpty()) {
          return this.sortState.reset();
        }
      }
    }, {
      mixins: ['Evented.Mixin']
    });
  });

}).call(this);
