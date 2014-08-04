Oraculum Behaviors
------------------
------------------

Oraculum comes with a large library of `mixin`s that aim to solve some of the most common use case problems when building a Backbone application. For example, if you need to bind an attribute of a `Model` to a particular element in a `View`, you may choose to use <a href="docs/src/views/mixins/dom-property-binding.coffee.html" rel="external" target="_blank">DOMPropertyBinding.ViewMixin</a>, which has both a configuration and data-attribute based interface for one-way model -> element binding. If you want a `Model` to automatically invokes `fetch()` after it's been constructed, you could use <a href="docs/src/models/mixins/auto-fetch.coffee.html" rel="external" target="_blank">AutoFetch.ModelMixin</a>, etc.

#### List of mixins
-------------------
```bash
$ find src -type f | grep mixins
src/mixins/callback-provider.coffee
src/mixins/disposable.coffee
src/mixins/evented-method.coffee
src/mixins/evented.coffee
src/mixins/freezable.coffee
src/mixins/listener.coffee
src/mixins/middleware-method.coffee
src/mixins/pub-sub.coffee
src/models/mixins/auto-fetch.coffee
src/models/mixins/disposable.coffee
src/models/mixins/dispose-destroyed.coffee
src/models/mixins/dispose-removed.coffee
src/models/mixins/last-fetch.coffee
src/models/mixins/pageable-interface.coffee
src/models/mixins/remove-disposed.coffee
src/models/mixins/sort-by-attribute-direction-interface.coffee
src/models/mixins/sort-by-attribute-direction.coffee
src/models/mixins/sort-by-multi-attribute-direction-interface.coffee
src/models/mixins/sort-by-multi-attribute-direction.coffee
src/models/mixins/sortable-column.coffee
src/models/mixins/sync-machine.coffee
src/models/mixins/xhr-cache.coffee
src/models/mixins/xhr-debounce.coffee
src/views/mixins/attach.coffee
src/views/mixins/auto-render.coffee
src/views/mixins/cell.coffee
src/views/mixins/column-list.coffee
src/views/mixins/dom-cache.coffee
src/views/mixins/dom-property-binding.coffee
src/views/mixins/html-templating.coffee
src/views/mixins/layout.coffee
src/views/mixins/list.coffee
src/views/mixins/region-attach.coffee
src/views/mixins/region-publisher.coffee
src/views/mixins/region-subscriber.coffee
src/views/mixins/remove-disposed.coffee
src/views/mixins/static-classes.coffee
src/views/mixins/subview.coffee
src/views/mixins/templating-interface.coffee
src/views/mixins/underscore-templating.coffee
```

<small class="pull-right">
  To learn more about Oraculum's `mixin`s, check out <a href="docs/README.md.html" rel="external">the official documentation</a>
</small>
