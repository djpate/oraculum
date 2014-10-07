(function() {
  define(['oraculum'], function(Oraculum) {
    'use strict';

    /*
    SortableColumn.ModelMixin
    =========================
    A mixin to provide a sorting interface on a "column".
    
    It expects `sortCollection` to support the following interface:
      * Method: `getAttributeDirection`
      * Method: `addAttributeDirection`
      * Method: `removeAttributeDirection`
      * Method: `unsort`
    
    These can be custom methods on the `sortCollection`, or the `sortCollection`
    can mixin one of the provided sorting mixins:
    
    @see models/mixins/sort-by-attribute-direction.coffee
    @see models/mixins/sort-by-multi-attribute-direction.coffee
    @see models/mixins/sort-by-attribute-direction-interface.coffee
    @see models/mixins/sort-by-multi-attribute-direction-interface.coffee
     */
    return Oraculum.defineMixin('SortableColumn.ModelMixin', {
      mixinOptions: {
        sortableColumn: {
          collection: null,
          directions: [1, 0, -1]
        }
      },
      mixconfig: function(_arg, attrs, options) {
        var sortCollection, sortDirections, sortableColumn;
        sortableColumn = _arg.sortableColumn;
        if (options == null) {
          options = {};
        }
        sortCollection = options.sortCollection, sortDirections = options.sortDirections;
        if (sortCollection != null) {
          sortableColumn.collection = sortCollection;
        }
        if (sortDirections != null) {
          sortableColumn.directions = sortDirections;
        }
        if (!sortableColumn.collection) {
          throw new Error('SortableColumn.ModelMixin requires a sortCollection');
        }
      },
      mixinitialize: function() {
        this._sortableCollection = this.mixinOptions.sortableColumn.collection;
        if (_.isString(this._sortableCollection)) {
          this._sortableCollection = this.__factory().get(this._sortableCollection);
        }
        if (_.isFunction(this._sortableCollection)) {
          this._sortableCollection = this._sortableCollection.call(this);
        }
        this.listenTo(this._sortableCollection, 'sort', this._collectionSorted);
        return this._collectionSorted();
      },
      _collectionSorted: function() {
        var attribute, currentDirection;
        attribute = this.get('attribute');
        currentDirection = this._sortableCollection.getAttributeDirection(attribute);
        if (!currentDirection) {
          return this.unset('sortDirection');
        }
        return this.set('sortDirection', currentDirection);
      },
      nextDirection: function() {
        var attribute, nextDirection;
        attribute = this.get('attribute');
        nextDirection = this.getNextDirection();
        this._sortableCollection.addAttributeDirection(attribute, nextDirection);
        return this._collectionSorted();
      },
      getNextDirection: function() {
        var attribute, currentDirection, directions, index, nextDirection;
        attribute = this.get('attribute');
        directions = this.mixinOptions.sortableColumn.directions;
        currentDirection = this._sortableCollection.getAttributeDirection(attribute);
        index = directions.indexOf(currentDirection);
        nextDirection = directions[++index];
        if (nextDirection == null) {
          nextDirection = directions[0];
        }
        return nextDirection;
      },
      isSorted: function() {
        return this.has('sortDirection');
      }
    });
  });

}).call(this);
