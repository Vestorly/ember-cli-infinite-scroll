import DS from 'ember-data';

const { ActiveModelSerializer } = DS;

export default ActiveModelSerializer.extend({
  primaryKey: '_id',
  normalizePayload: function(payload) {
    payload.posts = payload.reader_posts;
    if (payload.reader_posts) {
      delete payload.reader_posts;
    }
    return this._super.apply(this, arguments);
  }

});