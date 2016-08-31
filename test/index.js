
const expect = require('chai').expect;
const fs = require('fs');
const rc = require('rc-yaml');
const stream = require('stream');
const SwiftClient = require('../index');

const config = rc('swiftclient');


describe('SwiftClient', function () {
  this.timeout(4000);

  var client;

  before(function () {
    return SwiftClient.create(config.url, config.username, config.password)
      .then(function (c) {
        client = c;

        return client.create('swift-client-test');
      });
  });


  describe('#list', function () {
    it('should get a list of containers', function () {
      return client.list()
        .then(function (containers) {
          expect(containers).to.be.instanceof(Array);

          var container = containers.filter((x) => x.name === 'swift-client-test')[0];
          expect(container).to.exist;
          expect(container.count).to.equal(0);
          expect(container.bytes).to.equal(0);
        });
    });
  });


  describe('#create', function () {
    it('should create a container', function () {
      return client.create('swift-client-test-2')
        .then(function () {
          return client.list();
        })
        .then(function (containers) {
          expect(containers.filter((x) => x.name === 'swift-client-test-2')).to.have.length(1);
          return client.delete('swift-client-test-2');
        });
    });
  });


  describe('#update', function () {
    it('should update the metadata', function () {
      return client.update('swift-client-test', {colour: 'orange'})
        .then(function () {
          return client.meta('swift-client-test');
        })
        .then(function (meta) {
          expect(meta).to.eql({
            colour: 'orange'
          });
        });
    });
  });


  describe('SwiftContainer', function () {
    var container;

    before(function () {
      container = client.container('swift-client-test');

      var s = fs.createReadStream('test/test.txt');
      return container.create('test.txt', s);
    });

    after(function () {
      return container.delete('test.txt');
    });

    describe('#list', function () {
      it('should return a list of objects', function () {
        return container.list()
          .then(function (objects) {
            expect(objects).to.have.length(1);
            expect(objects[0].name).to.equal('test.txt');
          });
      });
    });

    describe('#get', function () {
      it('should get the object', function () {
        var s = new stream.Writable();
        var text = '';

        s._write = function (chunk) {
          text += chunk.toString();
        };

        return container.get('test.txt', s)
          .then(function () {
            expect(text).to.equal('Hello, world!\n');
          });
      });
    });

    describe('#update', function () {
      it('should update the metadata', function () {
        return container.update('test.txt', {colour: 'orange'})
          .then(function () {
            return container.meta('test.txt');
          })
          .then(function (meta) {
            expect(meta).to.eql({
              colour: 'orange'
            });
          });
      });
    });
  });
});
