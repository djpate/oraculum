(function() {
  define(['oraculum', 'oraculum/mixins/evented-method'], function(Oraculum) {
    'use strict';

    /*
    Freezable.Mixin
    ===============
    Allow an object to be frozen immediately after construction and provide
    a freezable interface.
     */
    return Oraculum.defineMixin('Freezable.Mixin', {

      /*
      Mixin Options
      -------------
      Allow the object to be configured to be frozen immediately after
      construction. Default to false.
       */
      mixinOptions: {
        freeze: false
      },

      /*
      Minitialize
      -----------
      Configure the instance and perform the freeze operation.
       */
      mixinitialize: function() {
        if (this.mixinOptions.freeze !== true) {
          return;
        }
        if (this.constructed == null) {
          this.constructed = function() {};
        }
        this.makeEventedMethod('constructed');
        return this.on('constructed:after', this.freeze, this);
      },

      /*
      Freeze
      ------
      The freeze interface.
      Invoke the freezse method on this instance if it's available.
       */
      freeze: function() {
        return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
      },

      /*
      Is Frozen
      ---------
      Check to see if this instance is frozen.
      
      @return {Boolean} Whether this instance is frozen.
       */
      isFrozen: function() {
        return typeof Object.isFrozen === "function" ? Object.isFrozen(this) : void 0;
      }
    }, {
      mixins: ['EventedMethod.Mixin']
    });
  });

}).call(this);
