Readme
------
------

```
 _______                             __
 \   _  \____________    ____  __ __|  |  __ __  _____
 /  / \  \_  __ \__  \ _/ ___\|  |  \  | |  |  \/     \
/  (___)  \  | \// __ \\  \___|  |  /  |_|  |  /  Y Y  \
\_______  /__|  (____  /\___  >____/|____/____/|__|_|  /
        \/           \/     \/                       \/
```

[Documentation](http://hackers.lookout.com/oraculum)

[![Bower version](https://badge.fury.io/bo/Oraculum.svg)](http://badge.fury.io/bo/Oraculum)
[![Build Status](https://travis-ci.org/lookout/oraculum.svg)](https://travis-ci.org/lookout/oraculum)
[![Coverage Status](https://img.shields.io/coveralls/lookout/oraculum.svg)](https://coveralls.io/r/lookout/oraculum?branch=master)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

Oraculum is a [javascript MVC framework](http://todomvc.com/architecture-examples/oraculum/) and a collection of `mixin`s for [Backbone](http://backbonejs.org/) `Model`s, `Collection`s and `View`s written for [FactoryJS](https://github.com/lookout/factoryjs/). It inherits all of its application structure, many behaviors, and is generally inspired by [Chaplin](http://chaplinjs.org/).

Though a large portion of Oraculum's behavior is inherited from Chaplin, Oraculum employs a signficiantly different strategy surrounding the issues of inheritance, structure, and coupling. Applications built with Oraculum take full advantage of the [aspect-oriented programming](http://en.wikipedia.org/wiki/Aspect-oriented_programming) and [composition](http://en.wikipedia.org/wiki/Composition_over_inheritance) paradigms offered by FactoryJS. The purpose of this project is to collect abstract, reusable behaviors into a framework that  can be used by anyone building complex applications with Backbone.

One of the core values provided by Oraculum is its lack of implicit behavior. All non-essential behaviors are optional. No non-essential behavior is implicit. This means that your objects only ever execute code paths relevant to their concerns and you should never have to alter an object's prototype to stub its implicit behaviors. Oraculum accomplishes this by hooking targeted methods of object instances in-memory and providing a consistent eventing interface to those hooks.

Objects and classes composed with Oraculum are often no more than a few lines simple configuration, yet through their `mixin`s they can be perform incredibly complex tasks. There are `mixin`s that emulate or implement every behavior Chaplin provides, plus many other behaviors unique to Oraculum. Because all behaviors are optional and formatted using the FactoryJS `mixin` syntax, it's incredibly easy to add custom behaviors or import behaviors authored by the open source community.
