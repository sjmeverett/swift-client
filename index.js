
const requestp = require('request-promise');
const SwiftContainer = require('./SwiftContainer');
const SwiftEntity = require('./SwiftEntity');
const util = require('util');


module.exports = SwiftClient;

function SwiftClient(url, token) {
  SwiftEntity.call(this, 'Container', url, token);
}

util.inherits(SwiftClient, SwiftEntity);


SwiftClient.create = function (url, username, password) {
  var _this = this;

  return requestp({
      method: 'GET',
      uri: url,
      headers: {
        'x-auth-user': username,
        'x-auth-key': password
      },
      resolveWithFullResponse: true
    })
    .then(function (response) {
      return new SwiftClient(url, response.headers['x-auth-token']);
    });
};


SwiftClient.prototype.create = function (name, publicRead, meta, extra) {
  if (typeof publicRead === 'undefined') {
    publicRead = false;
  }

  if (publicRead) {
    if (!extra)
      extra = {};

    extra['x-container-read'] = '.r:*';
  }

  return requestp({
      method: 'PUT',
      uri: this.url + '/' + name,
      headers: this.headers(meta, extra)
    });
};


SwiftClient.prototype.container = function (name) {
  return new SwiftContainer(this.url + '/' + name, this.token);
};
