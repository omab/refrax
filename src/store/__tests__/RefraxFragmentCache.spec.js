/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const chai = require('chai');
const TestHelper = require('TestHelper');
const RefraxConstants = require('RefraxConstants');
const RefraxFragmentCache = require('RefraxFragmentCache');
const RefraxFragmentResult = require('RefraxFragmentResult');
const assert = chai.assert;
const expect = chai.expect;
const DefaultPartial = RefraxConstants.defaultFragment;
const STATUS_STALE = RefraxConstants.status.STALE;
const STATUS_COMPLETE = RefraxConstants.status.COMPLETE;
const TIMESTAMP_STALE = RefraxConstants.timestamp.stale;


chai.use(require('ChaiDeepMatch'));

const dataSegmentFull__ID_1 = {
  id: 1,
  title: 'Foo Project',
  description: 'This is the Foo project on wheels'
};
const dataSegmentFull__ID_2 = {
  id: 2,
  title: 'Bar Project',
  description: 'This is the Bar project on wheels'
};
const dataSegmentFull__ID_3 = {
  id: 3,
  title: 'BarFoo Project',
  description: 'This is the BarFoo project on wheels'
};
const dataSegmentFull__ID_4 = {
  id: 4,
  title: 'FooBar Project',
  description: 'This is the FooBar project on wheels'
};

const dataSegmentPartial__ID_1 = {
  id: 1,
  title: 'Foo Project'
};
const dataSegmentPartial__ID_2 = {
  id: 2,
  title: 'Bar Project'
};
const dataSegmentPartial__ID_3 = {
  id: 3,
  title: 'BarFoo Project'
};
const dataSegmentPartial__ID_4 = {
  id: 4,
  title: 'FooBar Project'
};


function assertFragmentData(obj, key, data, partial) {
  assert.isObject(obj);
  assert.property(obj, key);

  if (typeof(data) === 'object') {
    assert.deepPropertyVal(obj, key + '.status', RefraxConstants.status.COMPLETE);
    assert.deepProperty(obj, key + '.timestamp');
    assert.deepEqual(obj[key].data, data);
  }
  else {
    assert.propertyVal(obj, key, data);
  }

  // TODO: better handle this test with #1
  // if (partial) {
  //   assert.deepPropertyVal(obj, key + '.partial', partial);
  // }
}

function assertQueryData(obj, key, data) {
  assert.isObject(obj);
  assert.property(obj, key);

  assert.deepPropertyVal(obj, key + '.status', RefraxConstants.status.COMPLETE);
  assert.deepProperty(obj, key + '.timestamp');
  assert.deepEqual(obj[key].data, data);
}


function expectResultDefault(result) {
  expect(result).to.be.an.instanceof(RefraxFragmentResult);
  expect(result).to.have.property('status')
    .that.equals(STATUS_STALE);
  expect(result).to.have.property('timestamp')
    .that.equal(TIMESTAMP_STALE);
  expect(result).to.have.property('data')
    .that.equal(null);
}

function expectResultWithContent(result, data) {
  expect(result).to.be.an.instanceof(RefraxFragmentResult);
  expect(result).to.have.property('status')
    .that.equals(STATUS_COMPLETE);
  expect(result).to.have.property('timestamp')
    .that.is.above(TIMESTAMP_STALE);
  expect(result).to.have.property('data')
    .that.deep.equals(data);
}

describe('RefraxFragmentCache', function() {
  var fragmentCache;

  beforeEach(function() {
    fragmentCache = new RefraxFragmentCache();
  });

  describe('instantiation', function() {
    it('should look like a FragmentCache', function() {
      expect(Object.keys(fragmentCache)).to.deep.equal(['fragments', 'queries']);
    });
  });

  describe('instance method', function() {
    describe('fetch', function() {
      beforeEach(function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects',
          partial: 'minimal'
        }), [dataSegmentPartial__ID_1, dataSegmentPartial__ID_2], STATUS_COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects/1'
        }), dataSegmentFull__ID_1, STATUS_COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects/2'
        }), dataSegmentFull__ID_2, STATUS_COMPLETE);
      });

      describe('when passed a descriptor', function() {
        describe('describing nothing', function() {
          it('should return a default result', function() {
            var descriptor = TestHelper.descriptorFrom({})
              , result = fragmentCache.fetch(descriptor);

            expectResultDefault(result);
          });
        });

        describe('describing a collection', function() {
          it('should return expected result', function() {
            var descriptor = TestHelper.descriptorFrom({
                path: '/projects'
              })
              , result = fragmentCache.fetch(descriptor);

            expectResultWithContent(result, [
              dataSegmentFull__ID_1,
              dataSegmentFull__ID_2
            ]);
          });

          it('should return expected result for a partial', function() {
            var descriptor = TestHelper.descriptorFrom({
                path: '/projects',
                partial: 'minimal'
              })
              , result = fragmentCache.fetch(descriptor);

            expectResultWithContent(result, [
              dataSegmentPartial__ID_1,
              dataSegmentPartial__ID_2
            ]);
          });

          it('should return default result for non-existing path', function() {
            var descriptor = TestHelper.descriptorFrom({
                path: '/projectz',
                partial: 'minimal'
              })
              , result = fragmentCache.fetch(descriptor);

            expectResultDefault(result);
          });
        });

        describe('describing an id-resource by path', function() {
          it('should return expected result', function() {
            var descriptor = TestHelper.descriptorFrom({
                path: '/projects/1'
              })
              , result = fragmentCache.fetch(descriptor);

            expectResultWithContent(result, dataSegmentFull__ID_1);
          });

          it('should return expected result for a partial', function() {
            var descriptor = TestHelper.descriptorFrom({
                path: '/projects/1',
                partial: 'minimal'
              })
              , result = fragmentCache.fetch(descriptor);

            expectResultWithContent(result, dataSegmentPartial__ID_1);
          });

          it('should return default result for non-existing path', function() {
            var descriptor = TestHelper.descriptorFrom({
                path: '/projects/11',
                partial: 'minimal'
              })
              , result = fragmentCache.fetch(descriptor);

            expectResultDefault(result);
          });
        });

        describe('describing an id-resource by id', function() {
          it('should return expected result', function() {
            var descriptor = TestHelper.descriptorFrom({
                id: '1'
              })
              , result = fragmentCache.fetch(descriptor);

            expectResultWithContent(result, dataSegmentFull__ID_1);
          });

          it('should return expected result for a partial', function() {
            var descriptor = TestHelper.descriptorFrom({
                id: '1',
                partial: 'minimal'
              })
              , result = fragmentCache.fetch(descriptor);

            expectResultWithContent(result, dataSegmentPartial__ID_1);
          });

          it('should return default result for non-existing id', function() {
            var descriptor = TestHelper.descriptorFrom({
                id: '11',
                partial: 'minimal'
              })
              , result = fragmentCache.fetch(descriptor);

            expectResultDefault(result);
          });
        });
      });
    });

    describe('touch', function() {
      describe('when passed a descriptor', function() {
        var expectedFragments, expectedQueries;

        beforeEach(function() {
          fragmentCache.update(TestHelper.descriptorFrom({
            path: '/projects',
            partial: 'minimal'
          }), [dataSegmentPartial__ID_1, dataSegmentPartial__ID_2], STATUS_COMPLETE);
          fragmentCache.update(TestHelper.descriptorFrom({
            path: '/projects/1'
          }), dataSegmentFull__ID_1, STATUS_COMPLETE);
          fragmentCache.update(TestHelper.descriptorFrom({
            path: '/projects/2'
          }), dataSegmentFull__ID_2, STATUS_COMPLETE);

          expectedFragments = JSON.parse(JSON.stringify(fragmentCache.fragments));
          expectedQueries = JSON.parse(JSON.stringify(fragmentCache.queries));
        });

        describe('describing nothing', function() {
          it('should not touch data', function() {
            fragmentCache.touch(TestHelper.descriptorFrom({}));

            expect(fragmentCache).to.have.property('fragments')
              .that.deep.equals(expectedFragments);
            expect(fragmentCache).to.have.property('queries')
              .that.deep.equals(expectedQueries);
          });
        });

        describe('alongside no touch data', function() {
          it('should not touch data', function() {
            fragmentCache.touch(TestHelper.descriptorFrom({
              path: '/projects'
            }));
            fragmentCache.touch(TestHelper.descriptorFrom({
              path: '/projects',
              partial: 'minimal'
            }));
            fragmentCache.touch(TestHelper.descriptorFrom({
              path: '/projects/1'
            }));

            expect(fragmentCache).to.have.property('fragments')
              .that.deep.equals(expectedFragments);
            expect(fragmentCache).to.have.property('queries')
              .that.deep.equals(expectedQueries);
          });
        });

        describe('describing an existing collection', function() {
          it('should update cache', function() {
            fragmentCache.touch(TestHelper.descriptorFrom({
              path: '/projects'
            }), {
              timestamp: 1234
            });

            expectedQueries['/projects'].timestamp = 1234;

            expect(fragmentCache).to.have.property('fragments')
              .that.deep.equals(expectedFragments);
            expect(fragmentCache).to.have.property('queries')
              .that.deep.equals(expectedQueries);
          });
        });

        describe('describing an existing id-resource by path', function() {
          it('should update cache', function() {
            fragmentCache.touch(TestHelper.descriptorFrom({
              path: '/projects/1'
            }), {
              timestamp: 1234
            });

            expectedQueries['/projects/1'].timestamp = 1234;

            expect(fragmentCache).to.have.property('fragments')
              .that.deep.equals(expectedFragments);
            expect(fragmentCache).to.have.property('queries')
              .that.deep.equals(expectedQueries);
          });
        });

        describe('describing an existing id-resource by id', function() {
          it('should update cache', function() {
            fragmentCache.touch(TestHelper.descriptorFrom({
              id: '1'
            }), {
              timestamp: 1234
            });

            expectedFragments[DefaultPartial]['1'].timestamp = 1234;

            expect(fragmentCache).to.have.property('fragments')
              .that.deep.equals(expectedFragments);
            expect(fragmentCache).to.have.property('queries')
              .that.deep.equals(expectedQueries);
          });
        });

        describe('describing a non-existing collection', function() {
          it('should update cache', function() {
            fragmentCache.touch(TestHelper.descriptorFrom({
              path: '/foobars'
            }), {
              timestamp: 1234
            });

            expectedQueries['/foobars'] = {timestamp: 1234};

            expect(fragmentCache).to.have.property('fragments')
              .that.deep.equals(expectedFragments);
            expect(fragmentCache).to.have.property('queries')
              .that.deep.equals(expectedQueries);
          });
        });

        describe('describing a non-existing id-resource by path', function() {
          it('should update cache', function() {
            fragmentCache.touch(TestHelper.descriptorFrom({
              path: '/projects/11'
            }), {
              timestamp: 1234
            });

            expectedQueries['/projects/11'] = {timestamp:  1234};

            expect(fragmentCache).to.have.property('fragments')
              .that.deep.equals(expectedFragments);
            expect(fragmentCache).to.have.property('queries')
              .that.deep.equals(expectedQueries);
          });
        });

        describe('describing a non-existing id-resource by id', function() {
          it('should update cache', function() {
            fragmentCache.touch(TestHelper.descriptorFrom({
              id: '11'
            }), {
              timestamp: 1234
            });

            expectedFragments[DefaultPartial]['11'] = {timestamp: 1234};

            expect(fragmentCache).to.have.property('fragments')
              .that.deep.equals(expectedFragments);
            expect(fragmentCache).to.have.property('queries')
              .that.deep.equals(expectedQueries);
          });
        });
      });
    });

    describe('update', function() {
      describe('when passed a descriptor', function() {
        describe('describing nothing', function() {
          it('should not update cache', function() {
            fragmentCache.update(TestHelper.descriptorFrom({}));

            expect(fragmentCache).to.have.property('fragments')
              .that.deep.equals({full: {}});
            expect(fragmentCache).to.have.property('queries')
              .that.deep.equals({
                '/': {
                  data: undefined,
                  status: STATUS_COMPLETE,
                  timestamp: -1
                }
              });
          });
        });

        describe('describing a collection', function() {
          it('should populate cache when non-existant', function() {
            fragmentCache.update(TestHelper.descriptorFrom({
              path: '/projects'
            }), [dataSegmentPartial__ID_1, dataSegmentPartial__ID_2]);

            expect(fragmentCache.fragments)
              .to.have.all.keys([DefaultPartial]);
            expect(fragmentCache.fragments[DefaultPartial])
              .to.have.all.keys(['1', '2'])
              .to.deep.match({
                '1': {
                  data: dataSegmentPartial__ID_1,
                  status: STATUS_COMPLETE,
                  timestamp: Number
                },
                '2': {
                  data: dataSegmentPartial__ID_2,
                  status: STATUS_COMPLETE,
                  timestamp: Number
                }
              });

            expect(fragmentCache.queries)
              .to.have.all.keys(['/projects'])
              .to.deep.match({
                '/projects': {
                  data: ['1', '2'],
                  status: STATUS_COMPLETE,
                  timestamp: Number
                }
              });
          });

          it('should populate cache when non-existant for a partial', function() {
            fragmentCache.update(TestHelper.descriptorFrom({
              path: '/projects',
              partial: 'minimal'
            }), [dataSegmentPartial__ID_1, dataSegmentPartial__ID_2]);

            expect(fragmentCache.fragments)
              .to.have.all.keys(['minimal']);
            expect(fragmentCache.fragments['minimal'])
              .to.have.all.keys(['1', '2'])
              .to.deep.match({
                '1': {
                  data: dataSegmentPartial__ID_1,
                  status: STATUS_COMPLETE,
                  timestamp: Number
                },
                '2': {
                  data: dataSegmentPartial__ID_2,
                  status: STATUS_COMPLETE,
                  timestamp: Number
                }
              });

            expect(fragmentCache.queries)
              .to.have.all.keys(['/projects']);
          });
        });

        describe('describing an id-resource by path', function() {
          it('should populate cache when non-existant', function() {
            fragmentCache.update(TestHelper.descriptorFrom({
              path: '/projects/1'
            }), dataSegmentFull__ID_1);

            expect(fragmentCache.fragments)
              .to.have.all.keys([DefaultPartial]);
            expect(fragmentCache.fragments[DefaultPartial])
              .to.have.all.keys(['1']);
            expect(fragmentCache.queries)
              .to.have.all.keys(['/projects/1']);
          });

          it('should populate cache when non-existant for a partial', function() {
            fragmentCache.update(TestHelper.descriptorFrom({
              path: '/projects/1',
              partial: 'minimal'
            }), dataSegmentPartial__ID_1);

            expect(fragmentCache.fragments)
              .to.have.all.keys(['minimal']);
            expect(fragmentCache.fragments['minimal'])
              .to.have.all.keys(['1']);
            expect(fragmentCache.queries)
              .to.have.all.keys(['/projects/1']);
          });
        });

        describe('describing a non-existing id-resource by id', function() {
          it('should update cache', function() {
          });
        });


        describe('describing an existing collection', function() {
          it('should update cache', function() {
          });
        });

        describe('describing an existing id-resource by path', function() {
          it('should update cache', function() {
          });
        });

        describe('describing an existing id-resource by id', function() {
          it('should update cache', function() {
          });
        });
      });
    });

    describe('invalidate', function() {

    });

    describe('destroy', function() {

    });
  });

  /*
  describe('the update method', function() {
    var fragmentCache
      , dataSegmentId_1 = {
        id: 1,
        title: 'Foo Project'
      }
      , dataSegmentId_2 = {
        id: 2,
        title: 'Bar Project'
      }
      , dataSegmentId_3 = {
        id: 3,
        title: 'BarFoo Project'
      }
      , dataSegmentId_4 = {
        id: 4,
        title: 'FooBar Project'
      };

    beforeEach(function() {
      fragmentCache = new RefraxFragmentCache();
    });

    describe('when passed a collection descriptor', function() {
      it('should properly store the data for a specified partial', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects',
          partial: 'foobar'
        }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), ['foobar']);
        assert.sameMembers(Object.keys(fragmentCache.fragments.foobar), ['1', '2']);
        assertFragmentData(fragmentCache.fragments.foobar, '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments.foobar, '2', dataSegmentId_2);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects']);
        assertFragmentData(fragmentCache.queries, '/projects', ['1', '2'], 'foobar');
      });

      it('should properly store the data for a default partial', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects'
        }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), [DefaultPartial]);
        assert.sameMembers(Object.keys(fragmentCache.fragments[DefaultPartial]), ['1', '2']);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '2', dataSegmentId_2);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects']);
        assertFragmentData(fragmentCache.queries, '/projects', ['1', '2'], DefaultPartial);
      });

      it('should properly update when updated multiple times', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects',
          partial: 'foobar'
        }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects',
          partial: 'foobar'
        }), [dataSegmentId_1, dataSegmentId_3], Constants.status.COMPLETE);


        assert.sameMembers(Object.keys(fragmentCache.fragments), ['foobar']);
        assert.sameMembers(Object.keys(fragmentCache.fragments.foobar), ['1', '2', '3']);
        assertFragmentData(fragmentCache.fragments.foobar, '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments.foobar, '2', dataSegmentId_2);
        assertFragmentData(fragmentCache.fragments.foobar, '3', dataSegmentId_3);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects']);
        assertFragmentData(fragmentCache.queries, '/projects', ['1', '3'], 'foobar');
      });
    });

    describe('when passed an id descriptor', function() {
      it('should properly store the data with a specified partial', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 1,
          path: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_1, Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), ['foobar']);
        assert.sameMembers(Object.keys(fragmentCache.fragments.foobar), ['1']);
        assertFragmentData(fragmentCache.fragments.foobar, '1', dataSegmentId_1);

        assertFragmentData(fragmentCache.queries, '/projects/1', '1', 'foobar');
        // assert.deepEqual(fragmentCache.queries, {});
      });

      it('should properly store the data with a default partial', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 1,
          path: '/projects/1'
        }), dataSegmentId_1, Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), [DefaultPartial]);
        assert.sameMembers(Object.keys(fragmentCache.fragments[DefaultPartial]), ['1']);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '1', dataSegmentId_1);

        assert.deepEqual(fragmentCache.queries, {});
      });

      it('should properly update when updated multiple times', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 1,
          path: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_1, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 1,
          path: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_2, Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), ['foobar']);
        assert.sameMembers(Object.keys(fragmentCache.fragments.foobar), ['1']);
        assertFragmentData(fragmentCache.fragments.foobar, '1', dataSegmentId_2);

        assert.deepEqual(fragmentCache.queries, {});
      });
    });

    describe('when passed an non-id descriptor', function() {
      it('should properly store the data with a specified partial', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_1, Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), ['foobar']);
        assert.sameMembers(Object.keys(fragmentCache.fragments.foobar), ['1']);
        assertFragmentData(fragmentCache.fragments.foobar, '1', dataSegmentId_1);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects/1']);
        assertQueryData(fragmentCache.queries, '/projects/1', '1');
      });

      it('should properly store the data with a default partial', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects/1'
        }), dataSegmentId_1, Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), [DefaultPartial]);
        assert.sameMembers(Object.keys(fragmentCache.fragments[DefaultPartial]), ['1']);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '1', dataSegmentId_1);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects/1']);
        assertQueryData(fragmentCache.queries, '/projects/1', '1');
      });

      it('should properly update when updated multiple times', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_1, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_2, Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), ['foobar']);
        assert.sameMembers(Object.keys(fragmentCache.fragments.foobar), ['1', '2']);
        assertFragmentData(fragmentCache.fragments.foobar, '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments.foobar, '2', dataSegmentId_2);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects/1']);
        assertQueryData(fragmentCache.queries, '/projects/1', '2');
      });
    });

    describe('when passed multiple collection descriptors', function() {
      it('should properly store the data for a specified partial', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects',
          partial: 'foobar'
        }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects/active',
          partial: 'foobar'
        }), [dataSegmentId_1, dataSegmentId_3], Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), ['foobar']);
        assert.sameMembers(Object.keys(fragmentCache.fragments.foobar), ['1', '2', '3']);
        assertFragmentData(fragmentCache.fragments.foobar, '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments.foobar, '2', dataSegmentId_2);
        assertFragmentData(fragmentCache.fragments.foobar, '3', dataSegmentId_3);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects', '/projects/active']);
        assertFragmentData(fragmentCache.queries, '/projects', ['1', '2'], 'foobar');
        assertFragmentData(fragmentCache.queries, '/projects/active', ['1', '3'], 'foobar');
      });

      it('should properly store the data for a default partial', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects'
        }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects/active'
        }), [dataSegmentId_1, dataSegmentId_3], Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), [DefaultPartial]);
        assert.sameMembers(Object.keys(fragmentCache.fragments[DefaultPartial]), ['1', '2', '3']);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '2', dataSegmentId_2);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '3', dataSegmentId_3);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects', '/projects/active']);
        assertFragmentData(fragmentCache.queries, '/projects', ['1', '2'], DefaultPartial);
        assertFragmentData(fragmentCache.queries, '/projects/active', ['1', '3'], DefaultPartial);
      });

      it('should properly update when updated multiple times', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects',
          partial: 'foobar'
        }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects/active',
          partial: 'foobar'
        }), [dataSegmentId_1, dataSegmentId_3], Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects',
          partial: 'foobar'
        }), [dataSegmentId_1, dataSegmentId_4], Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), ['foobar']);
        assert.sameMembers(Object.keys(fragmentCache.fragments.foobar), ['1', '2', '3', '4']);
        assertFragmentData(fragmentCache.fragments.foobar, '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments.foobar, '2', dataSegmentId_2);
        assertFragmentData(fragmentCache.fragments.foobar, '3', dataSegmentId_3);
        assertFragmentData(fragmentCache.fragments.foobar, '4', dataSegmentId_4);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects', '/projects/active']);
        assertFragmentData(fragmentCache.queries, '/projects', ['1', '4'], 'foobar');
        assertFragmentData(fragmentCache.queries, '/projects/active', ['1', '3'], 'foobar');
      });
    });

    describe('when passed multiple id descriptors', function() {
      it('should properly store the data with a specified partial', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 1,
          path: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_1, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 2,
          path: '/projects/2',
          partial: 'foobar'
        }), dataSegmentId_2, Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), ['foobar']);
        assert.sameMembers(Object.keys(fragmentCache.fragments.foobar), ['1', '2']);
        assertFragmentData(fragmentCache.fragments.foobar, '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments.foobar, '2', dataSegmentId_2);

        assert.deepEqual(fragmentCache.queries, {});
      });

      it('should properly store the data with a default partial', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 1,
          path: '/projects/1'
        }), dataSegmentId_1, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 2,
          path: '/projects/2'
        }), dataSegmentId_2, Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), [DefaultPartial]);
        assert.sameMembers(Object.keys(fragmentCache.fragments[DefaultPartial]), ['1', '2']);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '2', dataSegmentId_2);

        assert.deepEqual(fragmentCache.queries, {});
      });

      it('should properly update when updated multiple times', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 1,
          path: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_1, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 2,
          path: '/projects/2',
          partial: 'foobar'
        }), dataSegmentId_2, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 1,
          path: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_3, Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), ['foobar']);
        assert.sameMembers(Object.keys(fragmentCache.fragments.foobar), ['1', '2']);
        assertFragmentData(fragmentCache.fragments.foobar, '1', dataSegmentId_3);
        assertFragmentData(fragmentCache.fragments.foobar, '2', dataSegmentId_2);

        assert.deepEqual(fragmentCache.queries, {});
      });
    });

    describe('when passed multiple non-id descriptors', function() {
      it('should properly store the data with a specified partial', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_1, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects/2',
          partial: 'foobar'
        }), dataSegmentId_2, Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), ['foobar']);
        assert.sameMembers(Object.keys(fragmentCache.fragments.foobar), ['1', '2']);
        assertFragmentData(fragmentCache.fragments.foobar, '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments.foobar, '2', dataSegmentId_2);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects/1', '/projects/2']);
        assertQueryData(fragmentCache.queries, '/projects/1', '1');
        assertQueryData(fragmentCache.queries, '/projects/2', '2');
      });

      it('should properly store the data with a default partial', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects/1'
        }), dataSegmentId_1, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects/2'
        }), dataSegmentId_2, Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), [DefaultPartial]);
        assert.sameMembers(Object.keys(fragmentCache.fragments[DefaultPartial]), ['1', '2']);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '2', dataSegmentId_2);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects/1', '/projects/2']);
        assertQueryData(fragmentCache.queries, '/projects/1', '1');
        assertQueryData(fragmentCache.queries, '/projects/2', '2');
      });

      it('should properly update when updated multiple times', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_1, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects/2',
          partial: 'foobar'
        }), dataSegmentId_2, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_3, Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), ['foobar']);
        assert.sameMembers(Object.keys(fragmentCache.fragments.foobar), ['1', '2', '3']);
        assertFragmentData(fragmentCache.fragments.foobar, '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments.foobar, '2', dataSegmentId_2);
        assertFragmentData(fragmentCache.fragments.foobar, '3', dataSegmentId_3);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects/1', '/projects/2']);
        assertQueryData(fragmentCache.queries, '/projects/1', '3');
        assertQueryData(fragmentCache.queries, '/projects/2', '2');
      });

      it('should properly update a collection when updated multiple times', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects',
          partial: 'foobar'
        }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          path: '/projects',
          partial: 'foobar'
        }), dataSegmentId_3, Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), ['foobar']);
        assert.sameMembers(Object.keys(fragmentCache.fragments.foobar), ['1', '2', '3']);
        assertFragmentData(fragmentCache.fragments.foobar, '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments.foobar, '2', dataSegmentId_2);
        assertFragmentData(fragmentCache.fragments.foobar, '3', dataSegmentId_3);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects']);
        assertQueryData(fragmentCache.queries, '/projects', ['1', '2', '3']);
      });
    });
  });

  describe('the fetch method', function() {
    var fragmentCache
      , dataSegmentId_1 = {
        id: 1,
        title: 'Foo Project'
      }
      , dataSegmentId_2 = {
        id: 2,
        title: 'Bar Project'
      }
      , dataSegmentId_3 = {
        id: 3,
        title: 'FooBar Project'
      };

    beforeEach(function() {
      fragmentCache = new RefraxFragmentCache();
      fragmentCache.update(TestHelper.descriptorFrom({
        path: '/projects',
        partial: DefaultPartial
      }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);
      fragmentCache.update(TestHelper.descriptorFrom({
        path: '/projects/active',
        partial: DefaultPartial
      }), [dataSegmentId_1, dataSegmentId_3], Constants.status.COMPLETE);
    });

    describe('when passed an empty descriptor', function() {
      it('should return a stale resource', function() {
        var result = fragmentCache.fetch(TestHelper.descriptorFrom({}));

        assert.typeOf(result, 'object');
        assert.property(result, 'status');
        assert.strictEqual(result.status, Constants.status.STALE);
        assert.property(result, 'timestamp');
        assert.strictEqual(result.timestamp, Constants.timestamp.stale);
        assert.property(result, 'data');
      });
    });

    describe('when passed an id descriptor', function() {
      it('should return the proper resource for a valid id', function() {
        var result = fragmentCache.fetch(TestHelper.descriptorFrom({id: 1}));

        assert.typeOf(result, 'object');
        assert.property(result, 'status');
        assert.strictEqual(result.status, Constants.status.COMPLETE);
        assert.property(result, 'timestamp');
        assert.notStrictEqual(result.timestamp, Constants.timestamp.stale);
        assert.property(result, 'data');
        assert.deepEqual(result.data, dataSegmentId_1);
      });

      it('should return a stale resource for a invalid id', function() {
        var result = fragmentCache.fetch(TestHelper.descriptorFrom({id: 4}));

        assert.typeOf(result, 'object');
        assert.property(result, 'status');
        assert.strictEqual(result.status, Constants.status.STALE);
        assert.property(result, 'timestamp');
        assert.strictEqual(result.timestamp, Constants.timestamp.stale);
        assert.property(result, 'data');
      });
    });

    describe('when passed a path descriptor', function() {
      it('should return the proper resource for a valid path', function() {
        var result = fragmentCache.fetch(TestHelper.descriptorFrom({path: '/projects'}));

        assert.typeOf(result, 'object');
        assert.property(result, 'status');
        assert.strictEqual(result.status, Constants.status.COMPLETE);
        assert.property(result, 'timestamp');
        assert.notStrictEqual(result.timestamp, Constants.timestamp.stale);
        assert.property(result, 'data');
        assert.deepEqual(result.data, [dataSegmentId_1, dataSegmentId_2]);
      });

      it('should return a stale resource for a invalid path', function() {
        var result = fragmentCache.fetch(TestHelper.descriptorFrom({path: '/projectsz'}));

        assert.typeOf(result, 'object');
        assert.property(result, 'status');
        assert.strictEqual(result.status, Constants.status.STALE);
        assert.property(result, 'timestamp');
        assert.strictEqual(result.timestamp, Constants.timestamp.stale);
        assert.property(result, 'data');
      });
    });
  });

  describe('the delete method', function() {
    var fragmentCache
      , dataSegmentId_1 = {
        id: 1,
        title: 'Foo Project'
      }
      , dataSegmentId_2 = {
        id: 2,
        title: 'Bar Project'
      }
      , dataSegmentId_3 = {
        id: 3,
        title: 'FooBar Project'
      };

    beforeEach(function() {
      fragmentCache = new RefraxFragmentCache();
      fragmentCache.update(TestHelper.descriptorFrom({
        path: '/projects'
      }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);
      fragmentCache.update(TestHelper.descriptorFrom({
        path: '/projects/active'
      }), [dataSegmentId_1, dataSegmentId_3], Constants.status.COMPLETE);
    });

    describe('when passed an empty descriptor', function() {
      it('should perform no action', function() {
        fragmentCache.destroy(TestHelper.descriptorFrom({}));

        assert.sameMembers(Object.keys(fragmentCache.fragments), [DefaultPartial]);
        assert.sameMembers(Object.keys(fragmentCache.fragments[DefaultPartial]), ['1', '2', '3']);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '2', dataSegmentId_2);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '3', dataSegmentId_3);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects', '/projects/active']);
        assertFragmentData(fragmentCache.queries, '/projects', ['1', '2'], DefaultPartial);
        assertFragmentData(fragmentCache.queries, '/projects/active', ['1', '3'], DefaultPartial);
      });
    });

    describe('when passed an id descriptor', function() {
      it('should properly delete resource and remove from collections', function() {
        fragmentCache.destroy(TestHelper.descriptorFrom({id: '2'}));

        assert.sameMembers(Object.keys(fragmentCache.fragments), [DefaultPartial]);
        assert.sameMembers(Object.keys(fragmentCache.fragments[DefaultPartial]), ['1', '2', '3']);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '2', undefined);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '3', dataSegmentId_3);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects', '/projects/active']);
        assertFragmentData(fragmentCache.queries, '/projects', ['1'], DefaultPartial);
        assertFragmentData(fragmentCache.queries, '/projects/active', ['1', '3'], DefaultPartial);
      });
    });

    describe('when passed a path descriptor', function() {
      it('should properly delete only the query', function() {
        fragmentCache.destroy(TestHelper.descriptorFrom({path: '/projects'}));

        assert.sameMembers(Object.keys(fragmentCache.fragments), [DefaultPartial]);
        assert.sameMembers(Object.keys(fragmentCache.fragments[DefaultPartial]), ['1', '2', '3']);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '2', dataSegmentId_2);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '3', dataSegmentId_3);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects', '/projects/active']);
        assertFragmentData(fragmentCache.queries, '/projects', undefined);
        assertFragmentData(fragmentCache.queries, '/projects/active', ['1', '3'], DefaultPartial);
      });
    });
  });

  describe('the touch method', function() {
    var fragmentCache
      , dataSegmentId_1 = {
        id: 1,
        title: 'Foo Project'
      }
      , dataSegmentId_2 = {
        id: 2,
        title: 'Bar Project'
      }
      , dataSegmentId_3 = {
        id: 3,
        title: 'FooBar Project'
      };

    beforeEach(function() {
      fragmentCache = new RefraxFragmentCache();
      fragmentCache.update(TestHelper.descriptorFrom({
        path: '/projects'
      }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);
      fragmentCache.update(TestHelper.descriptorFrom({
        path: '/projects/active'
      }), [dataSegmentId_1, dataSegmentId_3], Constants.status.COMPLETE);
    });

    describe('when passed an invalid descriptor', function() {
      it('should perform no action on empty descriptor', function() {
        fragmentCache.touch(TestHelper.descriptorFrom({}));

        assert.sameMembers(Object.keys(fragmentCache.fragments), [DefaultPartial]);
        assert.sameMembers(Object.keys(fragmentCache.fragments[DefaultPartial]), ['1', '2', '3']);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '2', dataSegmentId_2);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '3', dataSegmentId_3);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects', '/projects/active']);
        assertFragmentData(fragmentCache.queries, '/projects', ['1', '2'], DefaultPartial);
        assertFragmentData(fragmentCache.queries, '/projects/active', ['1', '3'], DefaultPartial);
      });

      it('should perform no action on empty touch', function() {
        fragmentCache.touch(TestHelper.descriptorFrom({id: 2}), {});

        assert.sameMembers(Object.keys(fragmentCache.fragments), [DefaultPartial]);
        assert.sameMembers(Object.keys(fragmentCache.fragments[DefaultPartial]), ['1', '2', '3']);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '2', dataSegmentId_2);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '3', dataSegmentId_3);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects', '/projects/active']);
        assertFragmentData(fragmentCache.queries, '/projects', ['1', '2'], DefaultPartial);
        assertFragmentData(fragmentCache.queries, '/projects/active', ['1', '3'], DefaultPartial);
      });
    });

    describe('when passed an id descriptor', function() {
      it('should properly update metadata', function() {
        assert.deepPropertyNotVal(fragmentCache.fragments[DefaultPartial], '2.timestamp', 123);

        fragmentCache.touch(TestHelper.descriptorFrom({id: 2}), {timestamp: 123});

        assert.sameMembers(Object.keys(fragmentCache.fragments), [DefaultPartial]);
        assert.sameMembers(Object.keys(fragmentCache.fragments[DefaultPartial]), ['1', '2', '3']);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '2', dataSegmentId_2);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '3', dataSegmentId_3);
        assert.deepPropertyVal(fragmentCache.fragments[DefaultPartial], '2.timestamp', 123);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects', '/projects/active']);
        assertFragmentData(fragmentCache.queries, '/projects', ['1', '2'], DefaultPartial);
        assertFragmentData(fragmentCache.queries, '/projects/active', ['1', '3'], DefaultPartial);
      });
    });

    describe('when passed a path descriptor', function() {
      it('should properly update metadata', function() {
        assert.propertyNotVal(fragmentCache.queries['/projects'], 'timestamp', 123);

        fragmentCache.touch(TestHelper.descriptorFrom({path: '/projects'}), {timestamp: 123});

        assert.sameMembers(Object.keys(fragmentCache.fragments), [DefaultPartial]);
        assert.sameMembers(Object.keys(fragmentCache.fragments[DefaultPartial]), ['1', '2', '3']);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '1', dataSegmentId_1);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '2', dataSegmentId_2);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '3', dataSegmentId_3);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects', '/projects/active']);
        assertFragmentData(fragmentCache.queries, '/projects', ['1', '2'], DefaultPartial);
        assertFragmentData(fragmentCache.queries, '/projects/active', ['1', '3'], DefaultPartial);
        assert.propertyVal(fragmentCache.queries['/projects'], 'timestamp', 123);
      });
    });
  });
  */
});
