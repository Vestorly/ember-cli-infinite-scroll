import { ActiveModelAdapter } from 'active-model-adapter';

export default ActiveModelAdapter.extend({
  host: 'http://staging.vestorly.com',
  namespace: 'api/v3/reader/publishers/infinite-scroll'
});
