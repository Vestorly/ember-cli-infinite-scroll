import Controller from '@ember/controller';

export default Controller.extend({
  sidebarParams: null,

  init() {
    this._super(...arguments);
    this.set('sidebarParams', ['group_ids']);
  }
});
