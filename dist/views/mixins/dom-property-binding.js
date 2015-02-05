(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/evented', 'oraculum/mixins/evented-method'], function(Oraculum) {
    'use strict';
    var _;
    _ = Oraculum.get('underscore');
    return Oraculum.defineMixin('DOMPropertyBinding.ViewMixin', {
      mixinOptions: {
        domPropertyBinding: {
          placeholder: '...'
        },
        eventedMethods: {
          render: {}
        }
      },
      mixconfig: function(_arg, _arg1) {
        var domPropertyBinding, placeholder;
        domPropertyBinding = _arg.domPropertyBinding;
        placeholder = (_arg1 != null ? _arg1 : {}).placeholder;
        if (placeholder != null) {
          return domPropertyBinding.placeholder = placeholder;
        }
      },
      mixinitialize: function() {
        this.on('render:before', this._unbindElements, this);
        return this.on('render:after', this._bindElements, this);
      },
      _bindElements: function() {
        var $elements;
        $elements = this.$('[data-prop][data-prop-attr]');
        return _.each($elements, (function(_this) {
          return function(element) {
            var propertySpec, resolvedProperty, tags;
            element.cid = _.uniqueId('dom_property_binding_element_');
            propertySpec = _this.$(element).attr('data-prop').split('.');
            resolvedProperty = _this._resolveProperty(_this, propertySpec);
            if (tags = typeof resolvedProperty.__tags === "function" ? resolvedProperty.__tags() : void 0) {
              if (__indexOf.call(tags, 'Model') >= 0) {
                _this._bindToModel(element, resolvedProperty);
              }
              if (__indexOf.call(tags, 'Collection') >= 0) {
                _this._bindToCollection(element, resolvedProperty);
              }
            }
            return _this._updateBoundElement(element);
          };
        })(this));
      },
      _unbindElements: function() {
        var $elements;
        $elements = this.$('[data-prop][data-prop-attr]');
        return _.each($elements, (function(_this) {
          return function(element) {
            var propertySpec, resolvedProperty, tags;
            propertySpec = _this.$(element).attr('data-prop').split('.');
            resolvedProperty = _this._resolveProperty(_this, propertySpec);
            if (tags = typeof resolvedProperty.__tags === "function" ? resolvedProperty.__tags() : void 0) {
              if (__indexOf.call(tags, 'Model') >= 0) {
                _this._unbindFromModel(element, resolvedProperty);
              }
              if (__indexOf.call(tags, 'Collection') >= 0) {
                return _this._unbindFromCollection(element, resolvedProperty);
              }
            }
          };
        })(this));
      },
      _resolveProperty: function(context, attributes, index) {
        var attribute, property;
        if (index == null) {
          index = 0;
        }
        attribute = attributes[index];
        if (_.isFunction(context.get)) {
          property = context.get(attribute);
        }
        if (property == null) {
          property = _.result(context, attribute);
        }
        if (property == null) {
          return null;
        }
        if (index === attributes.length - 1) {
          return property;
        }
        return this._resolveProperty(property, attributes, ++index);
      },
      _bindToModel: function(element, model) {
        var events;
        if (!(events = this._resolveModelEvents(element))) {
          return;
        }
        return this.listenTo(model, events, this._getElementHandler(element));
      },
      _unbindFromModel: function(element, model) {
        var events;
        if (!(events = this._resolveModelEvents(element))) {
          return;
        }
        return this.stopListening(model, events, this._getElementHandler(element));
      },
      _bindToCollection: function(element, collection) {
        var events;
        if (!(events = this._resolveCollectionEvents(element))) {
          return;
        }
        return this.listenTo(collection, events, this._getElementHandler(element));
      },
      _unbindFromCollection: function(element, collection) {
        var events;
        if (!(events = this._resolveModelEvents(element))) {
          return;
        }
        return this.stopListening(collection, events, this._getElementHandler(element));
      },
      _resolveModelEvents: _.memoize((function(element) {
        var $element, attr, events;
        $element = this.validateBindTarget(element);
        attr = $element.attr('data-prop-attr').split('.')[0];
        events = $element.attr('data-prop-events');
        if (events == null) {
          events = "change:" + attr;
        }
        return events;
      }), function(_arg) {
        var cid;
        cid = _arg.cid;
        return cid;
      }),
      _resolveCollectionEvents: _.memoize((function(element) {
        var $element, events;
        $element = this.validateBindTarget(element);
        events = $element.attr('data-prop-events');
        if (events == null) {
          events = 'add remove reset';
        }
        return events;
      }), function(_arg) {
        var cid;
        cid = _arg.cid;
        return cid;
      }),
      _getElementHandler: _.memoize((function(element) {
        this.validateBindTarget(element);
        return (function(_this) {
          return function() {
            return _this._updateBoundElement(element);
          };
        })(this);
      }), function(_arg) {
        var cid;
        cid = _arg.cid;
        return cid;
      }),
      _updateBoundElement: function(element) {
        var $element, attrSpec, attribute, method, propertySpec, resolvedAttr, resolvedProperty;
        $element = this.validateBindTarget(element);
        propertySpec = $element.attr('data-prop').split('.');
        resolvedProperty = this._resolveProperty(this, propertySpec);
        if (resolvedProperty == null) {
          throw new Error("View does not contain property " + prop);
        }
        attrSpec = $element.attr('data-prop-attr').split('.');
        resolvedAttr = this._resolveProperty(resolvedProperty, attrSpec);
        if (resolvedAttr != null) {
          attribute = resolvedAttr;
        }
        if (attribute == null) {
          attribute = $element.attr('data-prop-placeholder');
        }
        if (attribute == null) {
          attribute = this.mixinOptions.domPropertyBinding.placeholder;
        }
        method = $element.attr('data-prop-method') || 'text';
        return $element[method](attribute);
      },
      validateBindTarget: function(element) {
        var $element;
        $element = this.$(element);
        if (!$element.length) {
          throw new Error("" + element + " not found in " + this + " scope");
        }
        if (!$element.is('[data-prop][data-prop-attr]')) {
          throw new Error("" + element + " does not contain necessary data attributes");
        }
        return $element;
      }
    }, {
      mixins: ['Evented.Mixin', 'EventedMethod.Mixin']
    });
  });

}).call(this);
