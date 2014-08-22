
/*
This file is a stub for convenience
===================================
This file will be removed in 2.0
 */

(function() {
  define(['oraculum', 'oraculum/plugins/tabular/views/mixins/row'], function(Oraculum) {
    'use strict';
    if (typeof console !== "undefined" && console !== null) {
      if (typeof console.warn === "function") {
        console.warn('Oraculum\'s tabular interface has moved. See /plugins/tabular');
      }
    }
    if (typeof console !== "undefined" && console !== null) {
      if (typeof console.warn === "function") {
        console.warn('ColumnList.ViewMixin is now Row.ViewMixin');
      }
    }
    return Oraculum.defineMixin('ColumnList.ViewMixin', {}, {
      mixins: ['Row.ViewMixin']
    });
  });

}).call(this);
