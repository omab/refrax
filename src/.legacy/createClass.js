var React = require('React')
  , Shims = require('Shims')
  , MixinMounter = require('MixinMounter');


/**
 * Via React create a composite component class given a class specification
 * that will have accessors to any given datasets.
 *
 * @param {object} spec Class specification.
 * @return {function} Component constructor function.
 * @public
 */
var createClass = function(component) {
  component.mixins = [].concat(
    component.mixins || [],
    createClass.mixins,
    MixinMounter,
    {
      getComponentParams: Shims.getComponentParams
    }
  );

  return React.createClass(component);
};

// Shim for adding mixins to RPS components
createClass.mixins = [];

export default createClass;
