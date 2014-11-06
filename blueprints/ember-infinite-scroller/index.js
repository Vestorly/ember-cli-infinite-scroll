module.exports = {
  description: 'Template and styles for infinite scroller',
  name: 'infinite-scroller',
  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  // afterInstall: function(options) {
  //   // Perform extra work here.
  // }
  included: function(app) {
    this._super.included(app);

    var infiniteDirectory   = 'blueprints/ember-infinite-scroller/app';
    app.import(path.join(infiniteDirectory, 'styles/infinite-scroller.css'), { destDir: 'public/assets' });
    app.import(path.join(infiniteDirectory, 'templates/infinite-scroller.hbs'), { destDir: 'app/templates/components' });
  }
};
