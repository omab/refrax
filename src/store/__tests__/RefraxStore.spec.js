/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const chai = require('chai');
const sinon = require('sinon');
const TestHelper = require('TestHelper');
const RefraxConstants = require('RefraxConstants');
const RefraxStore = require('RefraxStore');
const RefraxTools = require('RefraxTools');
const expect = chai.expect;


const dataSegmentId_1 = {
  id: 1,
  title: 'Foo Project'
};

const dataSegmentId_2 = {
  id: 2,
  title: 'Bar Project'
};

var refStore;

function fixtureStore() {
  refStore = RefraxStore.get();

  refStore.updateResource(TestHelper.descriptorFrom({
    basePath: '/projects'
  }), [dataSegmentId_1, dataSegmentId_2], RefraxConstants.status.SUCCESS);
}

function testInvalidateResult(args, result) {
  it('should properly invoke invalidate', function() {
    sinon.spy(refStore.cache, 'invalidate');

    refStore.invalidate.apply(refStore, args);

    expect(refStore.cache.invalidate.callCount).to.equal(1);
    expect(refStore.cache.invalidate.getCall(0).args)
      .to.deep.equal(result);
  });
}

function testInvalidateSubscriber(args) {
  it('should trigger a subscriber', function() {
    var callback
      , disposer
      , event = null;

    callback = sinon.spy(function(innerEvent) {
      event = innerEvent;
    });
    sinon.spy(refStore.cache, 'invalidate');

    disposer = refStore.subscribe('change', callback);
    refStore.invalidate.apply(refStore, args);
    disposer();

    expect(callback.callCount).to.equal(1);
    expect(event)
      .to.be.a('object')
      .to.deep.equal(RefraxTools.extend({
        storeType: refStore.definition.type,
        type: 'invalidate'
      }, refStore.cache.invalidate.getCall(0).args[1]));
  });
}

describe('RefraxStore', function() {
  afterEach(TestHelper.deleteStores);

  describe('instance method', function() {
    beforeEach(fixtureStore);

    describe('reset', function() {
      it('should properly reset the fragment map by assigning a new instance', function() {
        var cache = refStore.cache;

        refStore.reset();

        expect(refStore.cache).to.not.equal(cache);
        expect(refStore.cache.fragments).to.deep.equal({});
      });
    });

    describe('invalidate', function() {
      describe('with no arguments', function() {
        testInvalidateResult([], [null, {}]);
        testInvalidateSubscriber([]);
      });

      describe('with a descriptor argument', function() {
        var descriptor = TestHelper.descriptorFrom({
          basePath: '/projects'
        });

        testInvalidateResult([descriptor], [descriptor, {}]);
        testInvalidateSubscriber([descriptor]);
      });

      describe('with options argument first', function() {
        var options = {foo: 123};

        testInvalidateResult([options], [null, options]);
        testInvalidateSubscriber([options]);
      });

      describe('with descriptor and options argument', function() {
        var options = {foo: 123}
          , descriptor = TestHelper.descriptorFrom({
            basePath: '/projects'
          });

        testInvalidateResult([descriptor, options], [descriptor, options]);
        testInvalidateSubscriber([descriptor, options]);
      });

      describe('with invalid argument', function() {
        it('should throw an error', function() {
          sinon.spy(refStore.cache, 'invalidate');

          expect(function() {
            refStore.invalidate(123);
          }).to.throw(Error);

          expect(refStore.cache.invalidate.callCount).to.equal(0);
        });
      });
    });

    describe('fetchResource', function() {
      beforeEach(fixtureStore);

      it('should properly invoke cache fetch', function() {
        var descriptor = TestHelper.descriptorFrom({
          basePath: '/projects'
        });

        sinon.spy(refStore.cache, 'fetch');

        refStore.fetchResource(descriptor);

        expect(refStore.cache.fetch.callCount).to.equal(1);
        expect(refStore.cache.fetch.getCall(0).args[0]).to.equal(descriptor);
      });
    });

    describe('touchResource', function() {
      beforeEach(fixtureStore);

      it('should properly invoke cache touch', function() {
        var disposer
          , callback = sinon.spy()
          , descriptor = TestHelper.descriptorFrom({
            basePath: '/projects'
          });

        sinon.spy(refStore.cache, 'touch');
        disposer = refStore.subscribe('change', callback);
        refStore.touchResource(descriptor, dataSegmentId_1);
        disposer();

        expect(callback.callCount).to.equal(1);
        expect(refStore.cache.touch.callCount).to.equal(1);
        expect(refStore.cache.touch.getCall(0).args[0]).to.equal(descriptor);
        expect(refStore.cache.touch.getCall(0).args[1]).to.equal(dataSegmentId_1);
      });
    });

    describe('updateResource', function() {
      beforeEach(fixtureStore);

      it('should properly invoke cache update', function() {
        var disposer
          , callback = sinon.spy()
          , descriptor = TestHelper.descriptorFrom({
            basePath: '/projects'
          });

        sinon.spy(refStore.cache, 'update');
        disposer = refStore.subscribe('change', callback);
        refStore.updateResource(descriptor, dataSegmentId_1);
        disposer();

        expect(callback.callCount).to.equal(1);
        expect(refStore.cache.update.callCount).to.equal(1);
        expect(refStore.cache.update.getCall(0).args[0]).to.equal(descriptor);
        expect(refStore.cache.update.getCall(0).args[1]).to.equal(dataSegmentId_1);
      });
    });

    describe('deleteResource', function() {
      beforeEach(fixtureStore);

      it('should properly invoke cache destroy', function() {
        var disposer
          , callback = sinon.spy()
          , descriptor = TestHelper.descriptorFrom({
            basePath: '/projects'
          });

        sinon.spy(refStore.cache, 'destroy');
        disposer = refStore.subscribe('change', callback);
        refStore.destroyResource(descriptor);
        disposer();

        expect(callback.callCount).to.equal(1);
        expect(refStore.cache.destroy.callCount).to.equal(1);
        expect(refStore.cache.destroy.getCall(0).args[0]).to.equal(descriptor);
      });
    });
  });

  describe('static methods', function() {
    describe('get', function() {
      describe('with no arguments', function() {
        it('should create an anonymous store', function() {
          var result = RefraxStore.get();
          expect(result).to.be.an.instanceof(RefraxStore);
          expect(Object.keys(RefraxStore.all)).to.have.members([result.definition.type]);
        });
      });

      describe('with an invalid argument', function() {
        it('should throw an error', function() {
          expect(function() {
            RefraxStore.get(123);
          }).to.throw(Error);
        });
      });

      describe('with a string argument', function() {
        it('should create a named store', function() {
          var result = RefraxStore.get('foobar');
          expect(result).to.be.an.instanceof(RefraxStore);
          expect(Object.keys(RefraxStore.all)).to.have.members(['foobar']);
        });

        it('should fetch a previously named store with the same name', function() {
          var storeFoo = RefraxStore.get('foobar')
            , storeBar = RefraxStore.get('barfoo');

          expect(RefraxStore.get('foobar')).to.equal(storeFoo);
          expect(RefraxStore.get('foobar')).to.not.equal(storeBar);
          expect(RefraxStore.get('barfoo')).to.equal(storeBar);
          expect(RefraxStore.get('barfoo')).to.not.equal(storeFoo);
        });
      });
    });

    describe('reset', function() {
      it('should properly reset the store', function() {
        var store1 = RefraxStore.get('store1')
          , store2 = RefraxStore.get('store2')
          , storeCache1 = store1.cache
          , storeCache2 = store2.cache;

        RefraxStore.reset();

        expect(store1.cache).to.not.equal(storeCache1);
        expect(store1.cache.fragments).to.deep.equal({});
        expect(store2.cache).to.not.equal(storeCache2);
        expect(store2.cache.fragments).to.deep.equal({});
      });
    });
  });
});
