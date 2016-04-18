import { ActiveModelSerializer } from 'active-model-adapter';

ActiveModelSerializer.reopen({
  isNewSerializer: true
});

export default ActiveModelSerializer.extend();
