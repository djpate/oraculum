(function() {
  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/evented'], function(Oraculum) {
    var Backbone, _;
    _ = Oraculum.get('underscore');
    Backbone = Oraculum.get('Backbone');

    /*
    Listener.Mixin
    ==============
    Allow objects to automnatically setup event listeners via configuration.
    This uses a syntax similar to `Backbone.View`'s `events` configuration.
     */
    return Oraculum.defineMixin('Listener.Mixin', {

      /*
      Mixin Options
      -------------
      Allow the event configuration to be defined using a mapping of event specs
      and methods as described in the examples below.
      
      @param {Object} listen Object containing an event map.
      @param {Function} listen Function that returns an object containing an event map.
       */

      /*
      Minitialize
      -----------
      Invoke `@delegateListeners`.
      
      @see @delegateListeners
       */
      mixinitialize: function() {
        return this.delegateListeners();
      },

      /*
      Make Evented Methods
      --------------------
      Iterate over an event map, passing an event spec and its mapped callback
      through to `@delegateListener`.
      
      @see @delegateListener
      
      @param {Object} eventMap? An event map. Defaults to the configured event map.
      @param {Function} eventMap? A function that returns an event map. Defaults to the configured event map.
       */
      delegateListeners: function(eventMap) {
        if (!(eventMap != null ? eventMap : eventMap = this.mixinOptions.listen)) {
          return;
        }
        if (_.isFunction(eventMap)) {
          eventMap = eventMap.call(this);
        }
        return _.each(eventMap, (function(_this) {
          return function(callback, spec) {
            return _this.delegateListener(spec, callback);
          };
        })(this));
      },

      /*
      Delegate Listener
      -----------------
      Delegates events for a single event spec which can describe multiple
      listeners.
      
      @param {String} spec The event spec to delegate events for.
      @param {String} method A method on the current instance to bind.
      @param {Function} method A function to bind.
       */
      delegateListener: function(spec, method) {
        var callback, events, target;
        events = spec.split(' ');
        target = events.splice(-1, 1)[0];
        events = events.join(' ');
        callback = _.isString(method) ? this[method] : method;
        if (!_.isFunction(callback)) {
          throw new TypeError("Listener.Mixin " + callback + " is not a function");
        }
        if (target === 'this' || target === 'self') {
          target = this;
        }
        if (target === 'pubsub' || target === 'mediator') {
          target = Backbone;
        }
        if (_.isString(target)) {
          target = this[target];
        }
        if (target != null) {
          return this.listenTo(target, events, callback);
        }
      }
    }, {
      mixins: ['Evented.Mixin']
    });
  });

}).call(this);
