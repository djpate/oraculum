(function() {
  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/evented-method'], function(Oraculum) {
    'use strict';
    var _;
    _ = Oraculum.get('underscore');
    return Oraculum.defineMixin('Subview.ViewMixin', {
      mixinOptions: {
        eventedMethods: {
          render: {}
        }
      },
      mixconfig: function(mixinOptions, _arg) {
        var subviews;
        subviews = (_arg != null ? _arg : {}).subviews;
        return mixinOptions.subviews = _.extend({}, mixinOptions.subviews, subviews);
      },
      mixinitialize: function() {
        this._subviews = [];
        this._subviewsByName = {};
        this.on('render:after', this.createSubviews, this);
        return this.on('dispose', (function(_this) {
          return function() {
            return _.each(_this._subviews, function(view) {
              return typeof view.dispose === "function" ? view.dispose() : void 0;
            });
          };
        })(this));
      },
      createSubviews: function() {
        return _.each(this.mixinOptions.subviews, (function(_this) {
          return function(spec, name) {
            return _this.createSubview(name, spec);
          };
        })(this));
      },
      createSubview: function(name, spec) {
        return this.subview(name, this.createView(spec));
      },
      createView: function(spec) {
        var viewOptions;
        if (_.isFunction(spec)) {
          spec = spec.call(this);
        }
        viewOptions = _.extend({}, spec.viewOptions);
        if (_.isString(spec.view)) {
          return this.__factory().get(spec.view, viewOptions);
        } else {
          return new spec.view(viewOptions);
        }
      },
      subview: function(name, view) {
        if (!view) {
          return this._subviewsByName[name];
        }
        this.removeSubview(name);
        this._subviews.push(view);
        this._subviewsByName[name] = view;
        this.trigger('subviewCreated', view, this);
        return view;
      },
      removeSubview: function(nameOrView) {
        var index, name, otherName, otherView, view, _i, _len, _ref;
        if (_.isString(nameOrView)) {
          name = nameOrView;
          view = this._subviewsByName[name];
        } else {
          view = nameOrView;
          _ref = this._subviewsByName;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            otherName = _ref[_i];
            otherView = this._subviewsByName[otherName];
            if (view === otherView) {
              name = otherName;
              break;
            }
          }
        }
        if (!(name && view)) {
          return;
        }
        view.remove();
        if (typeof view.dispose === "function") {
          view.dispose();
        }
        index = this._subviews.indexOf(view);
        if (index !== -1) {
          this._subviews.splice(index, 1);
        }
        return delete this._subviewsByName[name];
      }
    }, {
      mixins: ['EventedMethod.Mixin']
    });
  });

}).call(this);
