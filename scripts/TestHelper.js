const Refrax = require('Refrax');
const RefraxResourceDescriptor = require('RefraxResourceDescriptor');
const RefraxTools = require('RefraxTools');


exports.deleteStores = function() {
  for (var key in Refrax.Store.all) {
    delete Refrax.Store.all[key];
  }
};

exports.descriptorFrom = function(params) {
  var descriptor = new RefraxResourceDescriptor();
  RefraxTools.extend(descriptor, params);
  return descriptor;
}
