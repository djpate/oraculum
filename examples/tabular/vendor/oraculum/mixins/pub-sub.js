(function() {
  var __slice = [].slice;

  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/evented'], function(Oraculum) {
    'use strict';
    var Backbone;
    Backbone = Oraculum.get('Backbone');

    /*
    PubSub.Mixin
    ============
    This mixin provides an interface to our global event bus.
    For the sake of simplicity, `Backbone` act as our global event bus.
    
    @see http://backbonejs.org/#Events-catalog
     */
    return Oraculum.defineMixin('PubSub.Mixin', {

      /*
      Publish Event
      -------------
      Trigger an event on the global event bus.
      
      @param {String} name The event to trigger.
      @param {Mixed} args... Any arguments pass through the event.
       */
      publishEvent: function() {
        var args, name;
        name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return Backbone.trigger.apply(Backbone, [name].concat(__slice.call(args)));
      },

      /*
      Subscribe Event
      ---------------
      Listen for events on the global event bus.
      
      @param {String} name The event(s) name to listen for.
      @param {Function} callback The function to bind to the event.
       */
      subscribeEvent: function(name, callback) {
        return this.listenTo(Backbone, name, callback);
      },

      /*
      Subscribe Once
      --------------
      Listen for events on the global event bus and immediately remove the
      listener after it's been invoked once.
      
      @param {String} name The event(s) name to listen for.
      @param {Function} callback The function to bind to the event.
       */
      subscribeOnce: function(name, callback) {
        return this.listenToOnce(Backbone, name, callback);
      },

      /*
      Unsubscribe Event
      -----------------
      Stop listening to events on the global event bus.
      
      @param {String} name The event(s) to stop listening for.
      @param {Function} callback? The function to stop binding.
       */
      unsubscribeEvent: function(name, callback) {
        return this.stopListening(Backbone, name, callback);
      }
    }, {
      mixins: ['Evented.Mixin']
    });
  });

}).call(this);
