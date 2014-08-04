(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/listener', 'oraculum/mixins/disposable'], function(Oraculum) {
    'use strict';
    var stateModelName, _;
    _ = Oraculum.get('underscore');
    stateModelName = '_PageableCollectionInterfaceState.Model';
    Oraculum.extend('Model', stateModelName, {
      defaults: {
        from: 0,
        size: 10,
        start: 0,
        total: 0,
        end: 0,
        page: 1,
        pages: 1
      },
      mixinOptions: {
        listen: {
          'change:size change:start change:page this': '_calculateFrom',
          'change:size change:start change:from this': '_calculatePage',
          'change:size change:start change:total this': '_calculateEnd'
        }
      },
      _calculateFrom: function() {
        var from, page, size, start;
        page = this.get('page');
        size = this.get('size');
        start = this.get('start');
        from = ((page - 1) * size) + start;
        return this.set({
          from: from
        });
      },
      _calculatePage: function() {
        var from, page, relativeOffset, size, start;
        from = this.get('from');
        size = this.get('size');
        start = this.get('start');
        relativeOffset = from - start;
        page = 1 + Math.floor(relativeOffset / size);
        return this.set({
          page: page
        });
      },
      _calculateEnd: function() {
        var end, pages, size, start, total;
        size = this.get('size');
        start = this.get('start');
        total = this.get('total');
        end = total + start;
        pages = Math.max(1, Math.ceil(total / size));
        return this.set({
          end: end,
          pages: pages
        });
      },
      parse: function(response) {
        var defaultKeys;
        response = _.clone(response);
        defaultKeys = _.chain(this).result('defaults').keys().value();
        _.each(response, function(value, key) {
          var numericValue;
          if (__indexOf.call(defaultKeys, key) < 0) {
            return;
          }
          numericValue = parseInt(value, 10);
          if (_.isNaN(numericValue)) {
            throw new TypeError("Value for " + key + ": " + value + " is not a number.");
          }
          return response[key] = numericValue;
        });
        return response;
      }
    }, {
      mixins: ['Listener.Mixin', 'Disposable.Mixin']
    });
    return Oraculum.defineMixin('PageableInterface.CollectionMixin', {
      mixinOptions: {
        pageable: {
          from: 0,
          size: 10,
          start: 0
        }
      },
      mixconfig: function(_arg, models, _arg1) {
        var from, pageable, size, start, _ref;
        pageable = _arg.pageable;
        _ref = _arg1 != null ? _arg1 : {}, start = _ref.start, from = _ref.from, size = _ref.size;
        if (start != null) {
          pageable.start = start;
        }
        if (from != null) {
          pageable.from = from;
        }
        if (size != null) {
          return pageable.size = size;
        }
      },
      mixinitialize: function() {
        var from, size, start, _ref;
        _ref = this.mixinOptions.pageable, start = _ref.start, from = _ref.from, size = _ref.size;
        this.pageState = this.__factory().get(stateModelName, {
          start: start,
          from: from,
          size: size
        }, {
          parse: true
        });
        return this.on('dispose', (function(_this) {
          return function(target) {
            if (target !== _this) {
              return;
            }
            _this.pageState.dispose();
            return delete _this.pageState;
          };
        })(this));
      },
      hasPrevious: function() {
        var page;
        page = this.pageState.get('page');
        return page > 1;
      },
      hasNext: function() {
        var page, pages;
        page = this.pageState.get('page');
        pages = this.pageState.get('pages');
        return page < pages;
      },
      previous: function() {
        var page;
        page = this.pageState.get('page');
        if (this.hasPrevious()) {
          return this.pageState.set('page', --page);
        }
      },
      next: function() {
        var page;
        page = this.pageState.get('page');
        if (this.hasNext()) {
          return this.pageState.set('page', ++page);
        }
      },
      jumpTo: function(page) {
        var pages;
        page = parseInt(page, 10);
        pages = this.pageState.get('pages');
        if (!(page >= 1 && page <= pages)) {
          return;
        }
        return this.pageState.set({
          page: page
        });
      },
      jumpToFirst: function() {
        return this.jumpTo(1);
      },
      jumpToLast: function() {
        return this.jumpTo(this.pageState.get('pages'));
      },
      setPageSize: function(size) {
        return this.pageState.set({
          size: size
        });
      },
      setPageStart: function(start) {
        return this.pageState.set({
          start: start
        });
      }
    });
  });

}).call(this);
