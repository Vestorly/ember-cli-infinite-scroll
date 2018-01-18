import Ember from 'ember';

const { get, set, setProperties, typeOf } = Ember;

function isSafe(obj) {
  let type = typeOf(obj);
  let correctType = type === 'object' || type === 'class' || type === 'instance';
  let notDestroyed = !get(obj, 'isDestroyed');
  let notDestroying = !get(obj, 'isDestroying');

  return correctType && notDestroyed && notDestroying;
}

function safeSet(obj, path, value) {
  if (isSafe(obj)) {
    return set(obj, path, value, true);
  }
  return;
}

function safeSetProperties(obj, properties) {
  if (isSafe(obj)) {
    return setProperties(obj, properties);
  }
  return;
}

function safeIncrementProperty(obj, path, value) {
  if (isSafe(obj)) {
    return obj.incrementProperty(path, value);
  }
  return;
}

export {
  isSafe,
  safeSet,
  safeSetProperties,
  safeIncrementProperty
};
