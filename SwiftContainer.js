
const Promise = require('any-promise');
const request = require('request');
const requestp = require('request-promise');
const SwiftEntity = require('./SwiftEntity');
const util = require('util');


module.exports = SwiftContainer;


function SwiftContainer(url, token) {
  SwiftEntity.call(this, 'Object', url, token);
}

util.inherits(SwiftContainer, SwiftEntity);


SwiftContainer.prototype.create = function (name, stream, meta, extra) {
  var _this = this;

  return new Promise(function (resolve, reject) {
    var req = request({
        method: 'PUT',
        uri: _this.url + '/' + name,
        headers: _this.headers(meta, extra)
      })
      .on('error', function (err) {
        reject(err);
      })
      .on('response', function (response) {
        if (response.statusCode === 201) {
          resolve();
        } else {
          reject(new Error('HTTP ' + response.statusCode));
        }
      });

    stream.pipe(req);
  });
};


SwiftContainer.prototype.delete = function (name, when) {
  if (when) {
    var h = {};

    if (when instanceof Date) {
      h['X-Delete-At'] = +when / 1000;
    } else if (typeof when === 'number' || when instanceof Number) {
      h['X-Delete-After'] = when;
    } else {
      throw new Error('expected when to be a number of seconds or a date');
    }

    return requestp({
        method: 'POST',
        uri: this.url + '/' + name,
        headers: this.headers(null, h)
      });

  } else {
    return SwiftEntity.prototype.delete.call(this, name);
  }
};


SwiftContainer.prototype.get = function (name, stream) {
  var _this = this;

  return new Promise(function (resolve, reject) {
    request({
        method: 'GET',
        uri: _this.url + '/' + name,
        headers: {
          'x-auth-token': _this.token
        }
      })
      .on('error', function (err) {
        reject(err);
      })
      .on('end', function () {
        resolve();
      })
      .pipe(stream);
  });
};
