var _ = require('utils')
  , DatasetMounter = require('DatasetMounter');


export function componentWillMount() {
  var self = this;

  _.each(this.datasets || {}, function(dataset, datasetKey) {
    var config = self.datasetConfig && self.datasetConfig[datasetKey];

    // datasetConfig just allows the dataset block to be "clean" by offering
    // a seperate location to create local datasets with custom configurations.
    if (config) {
      dataset = dataset.createDataset(config);
    }

    self[datasetKey] = DatasetMounter(self, dataset);
  });
}
