(function() {
  define(['oraculum'], function(Oraculum) {
    'use strict';

    /*
    Templating Interface
    ====================
    Provide simple common interface for configuring templating mixins.
    
    @see views/mixins/html-templating
    @see views/mixins/underscore-templating
     */
    return Oraculum.defineMixin('TemplatingInterface.ViewMixin', {

      /*
      Mixin Options
      -------------
      Allow the `template` to be configured directly on the definition.
       */
      mixinOptions: {
        template: ''
      },

      /*
      Mixin Config
      ------------
      Allow the `template` to be configured at construction.
       */
      mixconfig: function(mixinOptions, _arg) {
        var template;
        template = (_arg != null ? _arg : {}).template;
        if (template != null) {
          return mixinOptions.template = template;
        }
      }
    });
  });

}).call(this);
