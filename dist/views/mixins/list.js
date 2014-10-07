(function() {
  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/evented', 'oraculum/mixins/evented-method', 'oraculum/views/mixins/subview'], function(Oraculum) {
    'use strict';
    var initModelView, resolveModelView, resolveViewOptions, subviewName, subviewPrefix, toggleView, _;
    _ = Oraculum.get('underscore');
    subviewPrefix = 'modelView:';
    subviewName = function(_arg) {
      var cid;
      cid = _arg.cid;
      return "" + subviewPrefix + cid;
    };
    resolveModelView = function(model) {
      return this.mixinOptions.list.modelView;
    };
    resolveViewOptions = function(model) {
      var viewOptions;
      viewOptions = this.mixinOptions.list.viewOptions;
      if (_.isFunction(viewOptions)) {
        viewOptions = viewOptions.call(this, {
          model: model
        });
      }
      return _.extend({
        model: model
      }, viewOptions);
    };
    initModelView = function(model) {
      var view, viewOptions;
      view = this.resolveModelView(model);
      if (!view) {
        throw new TypeError('List.ViewMixin#initModelView modelView is not defined.\nProvide modelView in mixinOptions or constructor arguments.\nOptionally, you can override resolveModelView or initModelView.');
      }
      viewOptions = this.resolveViewOptions(model);
      if (!viewOptions) {
        throw new TypeError('List.ViewMixin#initModelView viewOptions is not defined.\nProvide viewOptions in mixinOptions or constructor arguments.\nOptionally, you can override resolveViewOptions or initModelView.');
      }
      return this.createView({
        view: view,
        viewOptions: viewOptions
      });
    };
    toggleView = function(view, included) {
      view.$el.stop(true, true);
      return view.$el.css('display', !included ? 'none' : '');
    };
    return Oraculum.defineMixin('List.ViewMixin', {
      mixinOptions: {
        list: {
          filterer: null,
          modelView: 'View',
          renderItems: true,
          viewOptions: null,
          listSelector: null,
          viewSelector: void 0,
          filterCallback: toggleView
        },
        eventedMethods: {
          render: {}
        }
      },
      mixconfig: function(_arg, options) {
        var filterCallback, filterer, list, listSelector, modelView, renderItems, viewOptions, viewSelector;
        list = _arg.list;
        if (options == null) {
          options = {};
        }
        viewOptions = options.viewOptions, modelView = options.modelView;
        if (modelView != null) {
          list.modelView = modelView;
        }
        if (_.isFunction(viewOptions)) {
          list.viewOptions = viewOptions;
        }
        if (!_.isFunction(list.viewOptions)) {
          list.viewOptions = _.extend({}, list.viewOptions, viewOptions);
        }
        filterer = options.filterer, filterCallback = options.filterCallback;
        if (filterer != null) {
          list.filterer = filterer;
        }
        if (filterCallback != null) {
          list.filterCallback = filterCallback;
        }
        renderItems = options.renderItems;
        if (renderItems != null) {
          list.renderItems = renderItems;
        }
        listSelector = options.listSelector, viewSelector = options.viewSelector;
        if (listSelector != null) {
          list.listSelector = listSelector;
        }
        if (viewSelector != null) {
          return list.viewSelector = viewSelector;
        }
      },
      mixinitialize: function() {
        if (this.initModelView == null) {
          this.initModelView = initModelView;
        }
        if (this.resolveModelView == null) {
          this.resolveModelView = resolveModelView;
        }
        if (this.resolveViewOptions == null) {
          this.resolveViewOptions = resolveViewOptions;
        }
        this.visibleModels = [];
        this.listenTo(this.collection, 'add', this.modelAdded);
        this.listenTo(this.collection, 'remove', this.modelRemoved);
        this.listenTo(this.collection, 'reset sort', this.renderAllModels);
        return this.on('render:after', this.renderCollection, this);
      },
      modelAdded: function(model, collection, _arg) {
        var index, view;
        index = _arg.at;
        view = this.renderModel(model);
        return this.insertView(model, view, index);
      },
      modelRemoved: function(model) {
        this.updateVisibleModels(model, false);
        return this.removeSubview(subviewName(model));
      },
      renderCollection: function() {
        var listSelector, renderItems, _ref;
        _ref = this.mixinOptions.list, renderItems = _ref.renderItems, listSelector = _ref.listSelector;
        this._$list = listSelector != null ? this.$(listSelector) : this.$el;
        if (renderItems) {
          return this.renderAllModels();
        }
      },
      renderAllModels: function() {
        var models, remainingViewsByName;
        this.visibleModels = [];
        remainingViewsByName = {};
        models = this.collection.models;
        _.each(models, (function(_this) {
          return function(model) {
            var name, view;
            name = subviewName(model);
            if (!(view = _this.subview(name))) {
              return;
            }
            return remainingViewsByName[name] = view;
          };
        })(this));
        _.each(this._subviewsByName, (function(_this) {
          return function(view, name) {
            if (0 !== name.indexOf(subviewPrefix)) {
              return;
            }
            if (!(name in remainingViewsByName)) {
              return _this.removeSubview(name);
            }
          };
        })(this));
        _.each(models, (function(_this) {
          return function(model, index) {
            var name, view;
            name = subviewName(model);
            view = _this.subview(name);
            if (view == null) {
              view = _this.renderModel(model);
            }
            return _this.insertView(model, view, index);
          };
        })(this));
        return this.trigger('visibilityChange', this.visibleModels);
      },
      getModelViews: function() {
        return _.chain(this._subviewsByName).filter(function(view, name) {
          return 0 === name.indexOf(subviewPrefix);
        }).values().value();
      },
      renderModel: function(model) {
        var view, viewName;
        viewName = subviewName(model);
        view = this.subview(viewName);
        if (view == null) {
          view = this.subview(viewName, this.initModelView(model));
        }
        view.render();
        return view;
      },
      filter: function(filterer, filterCallback) {
        var hasItemViews, included, index, model, view, _i, _len, _ref, _ref1;
        if (filterer === null || _.isFunction(filterer)) {
          this.mixinOptions.list.filterer = filterer;
        }
        if (filterCallback === null || _.isFunction(filterCallback)) {
          this.mixinOptions.list.filterCallback = filterCallback;
        }
        _ref = this.mixinOptions.list, filterer = _ref.filterer, filterCallback = _ref.filterCallback;
        hasItemViews = (function(_this) {
          return function() {
            var name;
            if (_this._subviews.length > 0) {
              for (name in _this._subviewsByName) {
                if (0 === name.indexOf(subviewPrefix)) {
                  return true;
                }
              }
            }
            return false;
          };
        })(this)();
        if (hasItemViews) {
          _ref1 = this.collection.models;
          for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
            model = _ref1[index];
            included = _.isFunction(filterer) ? filterer.call(this, model, index) : true;
            view = this.subview(subviewName(model));
            if (!view) {
              throw new Error("List.ViewMixin#filter No view found for " + model.cid);
            }
            if (_.isFunction(filterCallback)) {
              filterCallback.call(this, view, included);
            }
            this.updateVisibleModels(model, included, false);
          }
        }
        return this.trigger('visibilityChange', this.visibleModels);
      },
      insertView: function(model, view, position) {
        var children, childrenLength, filterCallback, filterer, included, insertInMiddle, isEnd, length, method, viewSelector, _ref;
        _ref = this.mixinOptions.list, filterer = _ref.filterer, filterCallback = _ref.filterCallback, viewSelector = _ref.viewSelector;
        included = true;
        if (_.isFunction(filterer)) {
          included = filterer.call(this, model, position);
          if (_.isFunction(filterCallback)) {
            filterCallback.call(this, view, included);
          }
        }
        toggleView(view, included);
        length = this.collection.length;
        if (!_.isNumber(position)) {
          position = this.collection.indexOf(model);
        }
        insertInMiddle = (0 < position && position < length);
        isEnd = function(length) {
          return length === 0 || length === position;
        };
        if (insertInMiddle || viewSelector) {
          children = this._$list.children(viewSelector);
          if (children[position] !== view.el) {
            childrenLength = children.length;
            if (isEnd(childrenLength)) {
              this._$list.append(view.el);
            } else if (position === 0) {
              children.eq(position).before(view.el);
            } else {
              children.eq(position - 1).after(view.el);
            }
          }
        } else {
          method = 'prepend';
          if (isEnd(length)) {
            method = 'append';
          }
          this._$list[method](view.el);
        }
        view.trigger('addedToParent');
        this.updateVisibleModels(model, included);
        return view;
      },
      updateVisibleModels: function(model, includedInFilter, triggerEvent) {
        var includedInVisibleItems, visibilityChanged, visibleModelsIndex;
        if (triggerEvent == null) {
          triggerEvent = true;
        }
        visibilityChanged = false;
        visibleModelsIndex = this.visibleModels.indexOf(model);
        includedInVisibleItems = visibleModelsIndex !== -1;
        if (includedInFilter && !includedInVisibleItems) {
          this.visibleModels.push(model);
          visibilityChanged = true;
        } else if (!includedInFilter && includedInVisibleItems) {
          this.visibleModels.splice(visibleModelsIndex, 1);
          visibilityChanged = true;
        }
        if (visibilityChanged && triggerEvent) {
          this.trigger('visibilityChange', this.visibleModels);
        }
        return visibilityChanged;
      }
    }, {
      mixins: ['Evented.Mixin', 'Subview.ViewMixin', 'EventedMethod.Mixin']
    });
  });

}).call(this);
