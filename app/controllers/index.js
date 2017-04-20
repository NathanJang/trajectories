import Ember from 'ember';
import Math from 'npm:mathjs';
import {getter, setter} from 'trajectories/util/computed';
import {formatString} from 'trajectories/util/is-invalid-input';

export default Ember.Controller.extend({
  precision: 14,

  formatString: formatString,

  degreesPerRadian: Math.divide(180, Math.PI),
  radiansPerDegree: Math.divide(Math.PI, 180),
  gMetersPerSecond: 9.80665,

  _initialVelocity: 0,
  initialVelocity: Ember.computed('_initialVelocity', {
    get: getter(),
    set: setter(function (key, value, numberValue) {
      var _angleRadians = this.get('_angleRadians');
      this.updateInitialVelocityX(numberValue, _angleRadians);
      this.updateInitialVelocityY(numberValue, _angleRadians);
      return value;
    })
  }),
  updateInitialVelocity(_initialVelocityX, _initialVelocityY) {
    var _initialVelocity = Math.sqrt(Math.add(Math.square(_initialVelocityX), Math.square(_initialVelocityY)));
    this.set('_initialVelocity', _initialVelocity);
    return _initialVelocity;
  },
  _initialVelocityX: 0,
  initialVelocityX: Ember.computed('_initialVelocityX', {
    get: getter(),
    set: setter(function (key, value, numberValue) {
      var _initialVelocityY = this.get('_initialVelocityY');
      this.updateInitialVelocity(numberValue, _initialVelocityY);
      var _angleRadians = this.updateAngleRadiansWithCartesianComponents(numberValue, _initialVelocityY);
      this.updateAngleDegreesWithAngleRadians(_angleRadians);
      return value;
    })
  }),
  updateInitialVelocityX(_initialVelocity, _angleRadians) {
    var _initialVelocityX = Math.multiply(_initialVelocity, Math.cos(_angleRadians));
    this.set('_initialVelocityX', _initialVelocityX);
    return _initialVelocityX;
  },
  _initialVelocityY: 0,
  initialVelocityY: Ember.computed('_initialVelocityY', {
    get: getter(),
    set: setter(function (key, value, numberValue) {
      var _initialVelocityX = this.get('_initialVelocityX');
      this.updateInitialVelocity(_initialVelocityX, numberValue);
      var _angleRadians = this.updateAngleRadiansWithCartesianComponents(_initialVelocityX, numberValue);
      this.updateAngleDegreesWithAngleRadians(_angleRadians);
      return value;
    })
  }),
  updateInitialVelocityY(_initialVelocity, _angleRadians) {
    var _initialVelocityY = Math.multiply(_initialVelocity, Math.sin(_angleRadians));
    this.set('_initialVelocityY', _initialVelocityY);
    return _initialVelocityY;
  },
  _angleRadians: 0,
  angleRadians: Ember.computed('_angleRadians', {
    get: getter(),
    set: setter(function (key, value, numberValue) {
      var _initialVelocity = this.get('_initialVelocity');
      this.updateInitialVelocityX(_initialVelocity, numberValue);
      this.updateInitialVelocityY(_initialVelocity, numberValue);
      this.updateAngleDegreesWithAngleRadians(numberValue);
      return value;
    })
  }),
  updateAngleRadiansWithCartesianComponents(_initialVelocityX, _initialVelocityY) {
    var xIsPositive = Math.isPositive(_initialVelocityX);
    var yIsPositive = Math.isPositive(_initialVelocityY);
    var _angleRadians;
    if (!Math.isZero(_initialVelocityX)) {
      _angleRadians = Math.atan(Math.divide(_initialVelocityY, _initialVelocityX));
    } else {
      _angleRadians = Math.multiply((yIsPositive ? 1 : -1), Math.divide(Math.PI, 2));
    }
    if (!xIsPositive && yIsPositive) {
      _angleRadians = Math.add(Math.PI, _angleRadians);
    } else if (Math.isZero(_initialVelocityX) && Math.isZero(_initialVelocityY)) {
      _angleRadians = 0;
    } else if (!xIsPositive && !yIsPositive) {
      _angleRadians = Math.add(Math.unaryMinus(Math.PI), _angleRadians);
    }
    this.set('_angleRadians', _angleRadians);
    return _angleRadians;
  },
  updateAngleRadiansWithAngleDegrees(_angleDegrees) {
    var _angleRadians = Math.multiply(_angleDegrees, this.get('radiansPerDegree'));
    this.set('_angleRadians', _angleRadians);
    return _angleRadians;
  },
  _angleDegrees: 0,
  angleDegrees: Ember.computed('_angleDegrees', {
    get: getter(),
    set: setter(function (key, value, numberValue) {
      var _angleRadians = this.updateAngleRadiansWithAngleDegrees(numberValue);
      var _initialVelocity = this.get('_initialVelocity');
      this.updateInitialVelocityX(_initialVelocity, _angleRadians);
      this.updateInitialVelocityY(_initialVelocity, _angleRadians);
      return value;
    })
  }),
  updateAngleDegreesWithAngleRadians(_angleRadians) {
    var _angleDegrees = Math.multiply(_angleRadians, this.get('degreesPerRadian'));
    this.set('_angleDegrees', _angleDegrees);
  },
  _launchHeight: 0,
  launchHeight: Ember.computed('_launchHeight', {
    get: getter(),
    set: setter()
  }),
  _peakHeight: Ember.computed('_initialVelocityY', '_launchHeight', {
    get() {
      var _initialVelocityY = this.get('_initialVelocityY');
      var _launchHeight = this.get('_launchHeight');
      if (Math.isNegative(_initialVelocityY)) {
        return _launchHeight;
      }
      return Math.add(Math.divide(Math.square(_initialVelocityY), Math.multiply(2, this.get('gMetersPerSecond'))), _launchHeight);
    }
  }),
  peakHeight: Ember.computed('_peakHeight', {
    get: getter()
  }),
  _range: Ember.computed('_initialVelocityX', '_initialVelocityY', '_launchHeight', {
    get() {
      var _initialVelocityX = this.get('_initialVelocityX');
      var _initialVelocityY = this.get('_initialVelocityY');
      var gMetersPerSecond = this.get('gMetersPerSecond');
      return Math.multiply(Math.divide(_initialVelocityX, gMetersPerSecond), Math.add(_initialVelocityY, Math.sqrt(Math.add(Math.square(_initialVelocityY), Math.multiply(Math.multiply(2, gMetersPerSecond), this.get('_launchHeight'))))));
    }
  }),
  range: Ember.computed('_range', {
    get: getter()
  }),
  _timeOfFlight: Ember.computed('_initialVelocityY', '_launchHeight', {
    get() {
      var gMetersPerSecond = this.get('gMetersPerSecond');
      return Math.divide(Math.add(this.get('_initialVelocityY'), Math.sqrt(Math.add(Math.square(this.get('_initialVelocityY')), Math.multiply(Math.multiply(2, gMetersPerSecond), this.get('_launchHeight'))))), gMetersPerSecond);
    }
  }),
  timeOfFlight: Ember.computed('_timeOfFlight', {
    get: getter()
  })
});
