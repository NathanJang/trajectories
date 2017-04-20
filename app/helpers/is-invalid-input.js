import Ember from 'ember';
import isInvalidInput from 'trajectories/util/is-invalid-input';

export default Ember.Helper.helper(function (params) {
  var input = params[0];
  return isInvalidInput(input);
});
