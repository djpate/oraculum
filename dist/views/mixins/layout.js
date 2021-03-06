(function() {
  var slice = [].slice;

  define(['oraculum', 'oraculum/libs', 'oraculum/mixins/pub-sub', 'oraculum/mixins/callback-provider', 'oraculum/views/mixins/region-publisher', 'oraculum/views/mixins/region-subscriber'], function(Oraculum) {
    'use strict';
    var $, _, modifierKeyPressed;
    $ = Oraculum.get('jQuery');
    _ = Oraculum.get('underscore');
    modifierKeyPressed = function(event) {
      return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.button === 1;
    };
    return Oraculum.defineMixin('Layout.ViewMixin', {
      mixinOptions: {
        layout: {
          title: '',
          scrollTo: [0, 0],
          routeLinks: 'a, .go-to',
          skipRouting: '.noscript',
          openExternalToBlank: false,
          openExternalLink: function(href, event) {
            event.preventDefault();
            return window.open(href);
          },
          titleTemplate: function(data) {
            if (data.subtitle) {
              return data.subtitle + " - " + data.title;
            } else {
              return data.title;
            }
          }
        },
        disposable: {
          disposeAll: true
        }
      },
      mixconfig: function(arg, options) {
        var layout, openExternalToBlank, routeLinks, scrollTo, skipRouting, title, titleTemplate;
        layout = arg.layout;
        if (options == null) {
          options = {};
        }
        title = options.title, scrollTo = options.scrollTo, routeLinks = options.routeLinks;
        if (title != null) {
          layout.title = title;
        }
        if (scrollTo != null) {
          layout.scrollTo = scrollTo;
        }
        if (routeLinks != null) {
          layout.routeLinks = routeLinks;
        }
        skipRouting = options.skipRouting, titleTemplate = options.titleTemplate, openExternalToBlank = options.openExternalToBlank;
        if (skipRouting != null) {
          layout.skipRouting = skipRouting;
        }
        if (titleTemplate != null) {
          layout.titleTemplate = titleTemplate;
        }
        if (typeof openExternalLink !== "undefined" && openExternalLink !== null) {
          layout.openExternalLink = openExternalLink;
        }
        if (openExternalToBlank != null) {
          return layout.openExternalToBlank = openExternalToBlank;
        }
      },
      mixinitialize: function() {
        this.subscribeEvent('!scrollTo', this.scrollTo);
        this.subscribeEvent('!adjustTitle', this.adjustTitle);
        this.subscribeEvent('beforeControllerDispose', this.scroll);
        if (this.mixinOptions.layout.routeLinks) {
          this.startLinkRouting();
        }
        return this.on('dispose', this.stopLinkRouting, this);
      },
      scroll: function() {
        var scrollTo, x, y;
        if (!(scrollTo = this.mixinOptions.layout.scrollTo)) {
          return;
        }
        x = scrollTo[0], y = scrollTo[1];
        return window.scrollTo(x, y);
      },
      scrollTo: function() {
        var args, ref, scroll, selector;
        selector = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        scroll = {
          scrollTop: $(selector).offset().top
        };
        return (ref = $(document.body)).animate.apply(ref, [scroll].concat(slice.call(args)));
      },
      adjustTitle: function(subtitle) {
        var title, titleTemplate;
        if (subtitle == null) {
          subtitle = '';
        }
        title = this.mixinOptions.layout.title;
        titleTemplate = this.mixinOptions.layout.titleTemplate;
        document.title = titleTemplate({
          title: title,
          subtitle: subtitle
        });
        return title;
      },
      startLinkRouting: function() {
        var routeLinks;
        if (!(routeLinks = this.mixinOptions.layout.routeLinks)) {
          return;
        }
        return this.$el.on('click', routeLinks, (function(_this) {
          return function(event) {
            return _this.openLink(event);
          };
        })(this));
      },
      stopLinkRouting: function() {
        var ref, routeLinks;
        if (!(ref = this.mixinOptions.layout, routeLinks = ref.routeLinks, ref)) {
          return;
        }
        return this.$el.off('click', routeLinks);
      },
      isExternalLink: function(link) {
        var ref, ref1;
        return link.rel === 'external' || link.target === '_blank' || ((ref = link.hostname) !== location.hostname && ref !== '') || ((ref1 = link.protocol) !== 'http:' && ref1 !== 'https:' && ref1 !== 'file:');
      },
      openLink: function(event) {
        var el, href, isAnchor, isExternalLink, openExternalToBlank, ref, skipRouting, type;
        if (modifierKeyPressed(event)) {
          return;
        }
        el = event.currentTarget;
        href = el.getAttribute('href') || el.getAttribute('data-href') || null;
        if (href == null) {
          return;
        }
        if (href === '') {
          return;
        }
        if (href.charAt(0) === '#') {
          return;
        }
        if (/^javascript:\s*void\(.*\);?$/.test(href)) {
          return;
        }
        ref = this.mixinOptions.layout, skipRouting = ref.skipRouting, openExternalToBlank = ref.openExternalToBlank;
        type = typeof skipRouting;
        if (_.isString(skipRouting) && $(el).is(skipRouting)) {
          return;
        }
        if (_.isFunction(skipRouting) && !skipRouting(href, el)) {
          return;
        }
        isAnchor = el.nodeName === 'A';
        isExternalLink = isAnchor && this.isExternalLink(el);
        if (isExternalLink) {
          if (openExternalToBlank) {
            this.mixinOptions.layout.openExternalLink(href, event);
          }
          return;
        }
        this.executeCallback('router:route', {
          url: href
        });
        event.preventDefault();
        return false;
      }
    }, {
      mixins: ['PubSub.Mixin', 'CallbackDelegate.Mixin', 'RegionSubscriber.ViewMixin', 'RegionPublisher.ViewMixin']
    });
  });

}).call(this);
