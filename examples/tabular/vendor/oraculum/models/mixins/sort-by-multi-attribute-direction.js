(function() {
  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/evented', 'oraculum/models/mixins/sort-by-multi-attribute-direction-interface'], function(Oraculum) {
    'use strict';
    var multiDirectionSort, _;
    _ = Oraculum.get('underscore');
    multiDirectionSort = function(a, b, attributes, directions, index) {
      var attribute, direction, valueA, valueB;
      if (index == null) {
        index = 0;
      }
      if ((direction = directions[index]) === 0) {
        return 0;
      }
      attribute = attributes[index];
      if ((valueA = a.get(attribute)) == null) {
        return 0;
      }
      if ((valueB = b.get(attribute)) == null) {
        return 0;
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
        if ((attributes.length - 1) === index) {
          return 0;
        } else {
          return multiDirectionSort(a, b, attributes, directions, ++index);
        }
      }
      if (valueA < valueB) {
        return direction;
      }
      return direction * -1;
    };
    return Oraculum.defineMixin('SortByMultiAttributeDirection.CollectionMixin', {
      mixinitialize: function() {
        return this.listenTo(this.sortState, 'add remove reset change', _.debounce(this.sort, 10));
      },
      comparator: function(a, b) {
        var attributes, directions;
        attributes = this.sortState.pluck('attribute');
        directions = this.sortState.pluck('direction');
        if (!attributes.length) {
          return (a.cid > b.cid) && 1 || -1;
        }
        return multiDirectionSort(a, b, attributes, directions);
      }
    }, {
      mixins: ['Evented.Mixin', 'SortByMultiAttributeDirectionInterface.CollectionMixin']
    });
  });

}).call(this);
