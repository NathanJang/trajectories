import Ember from 'ember';
import Math from 'npm:mathjs';
import isInvalidInput from 'trajectories/util/is-invalid-input';

function getter(cb) {
  return function (key) {
    var result = this.get('_' + key);
    Ember.debug('Getting ' + key + ' as ' + result);
    if (typeof cb === 'function') {
      return cb.call(this, key, result);
    } else {
      return Math.format(result, this.get('precision'));
    }
  };
}

function setter(cb) {
  return function (key, value) {
    var numberValue;
    if (isInvalidInput(value)) {
      return value;
    } else {
      numberValue = Math.number(value);
    }
    Ember.debug('Setting ' + key + ' to ' + value);
    this.set('_' + key, numberValue);
    if (typeof cb === 'function') {
      return cb.call(this, key, value, numberValue);
    } else {
      return value;
    }
  };
}

export {getter, setter};
