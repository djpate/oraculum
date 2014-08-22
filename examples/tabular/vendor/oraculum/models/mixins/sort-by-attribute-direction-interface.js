(function() {
  define(['oraculum', 'oraculum/mixins/evented', 'oraculum/mixins/disposable'], function(Oraculum) {
    'use strict';
    var stateModelName;
    stateModelName = '_SortByAttributeDirectionInterfaceState.Model';
    Oraculum.extend('Model', stateModelName, {
      idAttribute: 'attribute',
      validate: function(_arg) {
        var attribute, direction;
        attribute = _arg.attribute, direction = _arg.direction;
        if (!attribute) {
          return "'attribute' attribute required";
        }
        if (!direction) {
          return "'direction' attribute required";
        }
        if (direction !== (-1) && direction !== 1) {
          return "Invalid direction: '" + direction + "'";
        }
      }
    }, {
      mixins: ['Disposable.Mixin']
    });
    return Oraculum.defineMixin('SortByAttributeDirectionInterface.CollectionMixin', {
      mixinOptions: {
        sortByAttributeDirection: {
          defaults: {}
        }
      },
      mixconfig: function(_arg, models, _arg1) {
        var sortByAttributeDirection, sortDefaults;
        sortByAttributeDirection = _arg.sortByAttributeDirection;
        sortDefaults = (_arg1 != null ? _arg1 : {}).sortDefaults;
        if (sortDefaults != null) {
          return sortByAttributeDirection.defaults = sortDefaults;
        }
      },
      mixinitialize: function() {
        var defaults;
        defaults = this.mixinOptions.sortByAttributeDirection.defaults;
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
          return this.unsort();
        }
        return this.sortState.set({
          attribute: attribute,
          direction: direction
        });
      },
      getAttributeDirection: function(attribute) {
        if (attribute !== this.sortState.get('attribute')) {
          return 0;
        }
        return this.sortState.get('direction');
      },
      removeAttributeDirection: function() {
        return this.unsort();
      },
      unsort: function() {
        return this.sortState.unset({
          'attribute': 'attribute',
          'direction': 'direction'
        });
      }
    }, {
      mixins: ['Evented.Mixin']
    });
  });

}).call(this);
