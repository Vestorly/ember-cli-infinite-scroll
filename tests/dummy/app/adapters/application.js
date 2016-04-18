import DS from 'ember-data';

const { RESTAdapter } = DS;

export default RESTAdapter.extend({
  host: 'http://staging.vestorly.com',
  namespace: 'api/v3/reader/publishers/infinite-scroll'
});
