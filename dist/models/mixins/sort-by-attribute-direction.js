(function() {
  define(['oraculum', 'oraculum/mixins/evented', 'oraculum/models/mixins/sort-by-attribute-direction-interface'], function(Oraculum) {
    'use strict';
    return Oraculum.defineMixin('SortByAttributeDirection.CollectionMixin', {
      mixinitialize: function() {
        return this.listenTo(this.sortState, 'change', _.debounce(this.sort, 10));
      },
      comparator: function(a, b) {
        var attribute, delta, direction, valueA, valueB;
        attribute = this.sortState.get('attribute');
        direction = this.sortState.get('direction');
        if (!attribute || !direction || ((valueA = a.get(attribute)) == null) || ((valueB = b.get(attribute)) == null)) {
          return a.cid > b.cid;
        }
        if (_.isFunction(valueA.toString)) {
          valueA = valueA.toString();
        }
        if (_.isFunction(valueB.toString)) {
          valueB = valueB.toString();
        }
        if (_.isFunction(valueA.toLowerCase)) {
          valueA = valueA.toLowerCase();
        }
        if (_.isFunction(valueB.toLowerCase)) {
          valueB = valueB.toLowerCase();
        }
        if (valueA === valueB) {
          return a.cid > b.cid;
        }
        if (valueA > valueB) {
          delta = -1;
        }
        if (valueA < valueB) {
          delta = 1;
        }
        return delta * direction;
      }
    }, {
      mixins: ['Evented.Mixin', 'SortByAttributeDirectionInterface.CollectionMixin']
    });
  });

}).call(this);
