(function() {
  define(['oraculum', 'oraculum/libs', 'oraculum/views/mixins/templating-interface'], function(Oraculum) {
    'use strict';
    var getTemplateData, getTemplateFunction, _;
    _ = Oraculum.get('underscore');
    getTemplateData = function() {
      var data;
      data = {};
      if (this.model) {
        _.extend(data, this.model.toJSON());
      }
      if (this.collection) {
        _.defaults(data, {
          items: this.collection.toJSON(),
          length: this.collection.length
        });
      }
      return data;
    };
    getTemplateFunction = function() {
      var template, _template;
      template = this.mixinOptions.template;
      if (_.isFunction(template)) {
        template = template.call(this);
      }
      _template = _.template(template);
      return function(data) {
        var html;
        html = template;
        try {
          return html = _template.call(this, data);
        } finally {
          return html;
        }
      };
    };
    return Oraculum.defineMixin('UnderscoreTemplating.ViewMixin', {
      mixinitialize: function() {
        if (this.getTemplateData == null) {
          this.getTemplateData = getTemplateData;
        }
        return this.getTemplateFunction != null ? this.getTemplateFunction : this.getTemplateFunction = getTemplateFunction;
      },
      render: function() {
        var data, func, templateFunc;
        templateFunc = this.getTemplateFunction();
        data = this.getTemplateData();
        func = this.getTemplateFunction();
        this.$el.html(func.call(this, data));
        return this;
      }
    }, {
      mixins: ['TemplatingInterface.ViewMixin']
    });
  });

}).call(this);
