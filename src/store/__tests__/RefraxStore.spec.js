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
const expect = chai.expect;


const dataSegmentId_1 = {
  id: 1,
  title: 'Foo Project'
};

const dataSegmentId_2 = {
  id: 2,
  title: 'Bar Project'
};

describe('RefraxStore', function() {
  afterEach(TestHelper.deleteStores);

  describe('instance methods', function() {
    describe('reset', function() {
      it('should properly reset the fragment map by assigning a new instance', function() {
        var store = RefraxStore.get()
          , cache = store.cache;

        store.updateResource(TestHelper.descriptorFrom({
          basePath: '/projects'
        }), [dataSegmentId_1, dataSegmentId_2], RefraxConstants.status.SUCCESS);
        store.reset();

        expect(store.cache).to.not.equal(cache);
        expect(store.cache.fragments).to.deep.equal({});
      });
    });

    describe('invalidate', function() {
      it('should properly mark data as stale', function() {
        var store = RefraxStore.get();

        store.updateResource(TestHelper.descriptorFrom({
          basePath: '/projects'
        }), [dataSegmentId_1, dataSegmentId_2], RefraxConstants.status.SUCCESS);

        expect(store.fetchResource({id: 1}).status).to.not.equal(RefraxConstants.status.STALE);
        expect(store.fetchResource({id: 2}).status).to.not.equal(RefraxConstants.status.STALE);
        expect(store.fetchResource({id: 1}).timestamp).to.not.equal(RefraxConstants.timestamp.stale);
        expect(store.fetchResource({id: 2}).timestamp).to.not.equal(RefraxConstants.timestamp.stale);

        store.invalidate();

        expect(store.fetchResource({id: 1}).status).to.equal(RefraxConstants.status.STALE);
        expect(store.fetchResource({id: 2}).status).to.equal(RefraxConstants.status.STALE);
        expect(store.fetchResource({id: 1}).timestamp).to.equal(RefraxConstants.timestamp.stale);
        expect(store.fetchResource({id: 2}).timestamp).to.equal(RefraxConstants.timestamp.stale);
      });

      it('should not trigger when not specified to', function() {
        var store = RefraxStore.get()
          , callback = sinon.spy()
          , dispose;

        store.updateResource(TestHelper.descriptorFrom({
          basePath: '/projects'
        }), [dataSegmentId_1, dataSegmentId_2], RefraxConstants.status.SUCCESS);

        dispose = store.subscribe('change', callback);
        store.invalidate();
        dispose();

        expect(callback.callCount).to.equal(0);
      });

      it('should trigger when specified to', function() {
        var store = RefraxStore.get()
          , callback = sinon.spy()
          , dispose;

        store.updateResource(TestHelper.descriptorFrom({
          basePath: '/projects'
        }), [dataSegmentId_1, dataSegmentId_2], RefraxConstants.status.SUCCESS);

        dispose = store.subscribe('change', callback);
        store.invalidate({notify: true});
        dispose();

        expect(callback.callCount).to.equal(1);
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
  });
});
