const Refrax = require('Refrax');


exports.deleteStores = function() {
  for (var key in Refrax.Store.list) {
    delete Refrax.Store.list[key];
  }
};
