/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const chai = require('chai');
const TestHelper = require('TestHelper');
const Constants = require('RefraxConstants');
const RefraxFragmentCache = require('RefraxFragmentCache');
const assert = chai.assert;
const DefaultPartial = Constants.defaultFragment;


function assertFragmentData(obj, key, data, partial) {
  assert.isObject(obj);
  assert.property(obj, key);

  if (typeof(data) === 'object') {
    assert.deepPropertyVal(obj, key + '.status', Constants.status.COMPLETE);
    assert.deepProperty(obj, key + '.timestamp');
    assert.deepEqual(obj[key].data, data);
  }
  else {
    assert.propertyVal(obj, key, data);
  }

  if (partial) {
    assert.deepPropertyVal(obj, key + '.partial', partial);
  }
}

function assertQueryData(obj, key, data) {
  assert.isObject(obj);
  assert.property(obj, key);

  assert.deepPropertyVal(obj, key + '.status', Constants.status.COMPLETE);
  assert.deepProperty(obj, key + '.timestamp');
  assert.deepEqual(obj[key].data, data);
}

describe('RefraxFragmentCache', function() {
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
          basePath: '/projects',
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
          basePath: '/projects'
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
          basePath: '/projects',
          partial: 'foobar'
        }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          basePath: '/projects',
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
          basePath: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_1, Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), ['foobar']);
        assert.sameMembers(Object.keys(fragmentCache.fragments.foobar), ['1']);
        assertFragmentData(fragmentCache.fragments.foobar, '1', dataSegmentId_1);

        assert.deepEqual(fragmentCache.queries, {});
      });

      it('should properly store the data with a default partial', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 1,
          basePath: '/projects/1'
        }), dataSegmentId_1, Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), [DefaultPartial]);
        assert.sameMembers(Object.keys(fragmentCache.fragments[DefaultPartial]), ['1']);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '1', dataSegmentId_1);

        assert.deepEqual(fragmentCache.queries, {});
      });

      it('should properly update when updated multiple times', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 1,
          basePath: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_1, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 1,
          basePath: '/projects/1',
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
          basePath: '/projects/1',
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
          basePath: '/projects/1'
        }), dataSegmentId_1, Constants.status.COMPLETE);

        assert.sameMembers(Object.keys(fragmentCache.fragments), [DefaultPartial]);
        assert.sameMembers(Object.keys(fragmentCache.fragments[DefaultPartial]), ['1']);
        assertFragmentData(fragmentCache.fragments[DefaultPartial], '1', dataSegmentId_1);

        assert.sameMembers(Object.keys(fragmentCache.queries), ['/projects/1']);
        assertQueryData(fragmentCache.queries, '/projects/1', '1');
      });

      it('should properly update when updated multiple times', function() {
        fragmentCache.update(TestHelper.descriptorFrom({
          basePath: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_1, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          basePath: '/projects/1',
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
          basePath: '/projects',
          partial: 'foobar'
        }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          basePath: '/projects/active',
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
          basePath: '/projects'
        }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          basePath: '/projects/active'
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
          basePath: '/projects',
          partial: 'foobar'
        }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          basePath: '/projects/active',
          partial: 'foobar'
        }), [dataSegmentId_1, dataSegmentId_3], Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          basePath: '/projects',
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
          basePath: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_1, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 2,
          basePath: '/projects/2',
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
          basePath: '/projects/1'
        }), dataSegmentId_1, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 2,
          basePath: '/projects/2'
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
          basePath: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_1, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 2,
          basePath: '/projects/2',
          partial: 'foobar'
        }), dataSegmentId_2, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          id: 1,
          basePath: '/projects/1',
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
          basePath: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_1, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          basePath: '/projects/2',
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
          basePath: '/projects/1'
        }), dataSegmentId_1, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          basePath: '/projects/2'
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
          basePath: '/projects/1',
          partial: 'foobar'
        }), dataSegmentId_1, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          basePath: '/projects/2',
          partial: 'foobar'
        }), dataSegmentId_2, Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          basePath: '/projects/1',
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
          basePath: '/projects',
          partial: 'foobar'
        }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);
        fragmentCache.update(TestHelper.descriptorFrom({
          basePath: '/projects',
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
        basePath: '/projects',
        partial: DefaultPartial
      }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);
      fragmentCache.update(TestHelper.descriptorFrom({
        basePath: '/projects/active',
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
        var result = fragmentCache.fetch(TestHelper.descriptorFrom({basePath: '/projects'}));

        assert.typeOf(result, 'object');
        assert.property(result, 'status');
        assert.strictEqual(result.status, Constants.status.COMPLETE);
        assert.property(result, 'timestamp');
        assert.notStrictEqual(result.timestamp, Constants.timestamp.stale);
        assert.property(result, 'data');
        assert.deepEqual(result.data, [dataSegmentId_1, dataSegmentId_2]);
      });

      it('should return a stale resource for a invalid path', function() {
        var result = fragmentCache.fetch(TestHelper.descriptorFrom({basePath: '/projectsz'}));

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
        basePath: '/projects'
      }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);
      fragmentCache.update(TestHelper.descriptorFrom({
        basePath: '/projects/active'
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
        fragmentCache.destroy(TestHelper.descriptorFrom({basePath: '/projects'}));

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
        basePath: '/projects'
      }), [dataSegmentId_1, dataSegmentId_2], Constants.status.COMPLETE);
      fragmentCache.update(TestHelper.descriptorFrom({
        basePath: '/projects/active'
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

        fragmentCache.touch(TestHelper.descriptorFrom({basePath: '/projects'}), {timestamp: 123});

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
});
