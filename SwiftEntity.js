
const requestp = require('request-promise');


module.exports = SwiftEntity;


function SwiftEntity(childName, url, token) {
  this.childName = childName;
  this.url = url;
  this.token = token;
}


SwiftEntity.prototype.list = function () {
  return requestp({
      uri: this.url,
      headers: this.headers(),
      json: true
    });
};


SwiftEntity.prototype.update = function (name, meta, extra) {
  return requestp({
      method: 'POST',
      uri: this.url + '/' + name,
      headers: this.headers(meta, extra)
    });
};


SwiftEntity.prototype.meta = function (name) {
  var _this = this;

  return requestp({
      method: 'HEAD',
      uri: this.url + '/' + name,
      headers: this.headers(),
      resolveWithFullResponse: true
    })
    .then(function (response) {
      var meta = {};
      var headers = response.headers;
      var regex = new RegExp('^X-' + _this.childName + '-Meta-(.*)$', 'i');

      for (var k in headers) {
        var m = k.match(regex);

        if (m) {
          meta[m[1]] = headers[k];
        }
      }

      return meta;
    });
};


SwiftEntity.prototype.delete = function (name) {
  return requestp({
      method: 'DELETE',
      uri: this.url + '/' + name,
      headers: this.headers()
    });
};


SwiftEntity.prototype.headers = function (meta, extra) {
  var headers = Object.assign({
    'accept': 'application/json',
    'x-auth-token': this.token
  }, extra);

  if (meta != null) {
    for (var k in meta) {
      if (meta.hasOwnProperty(k)) {
        headers['X-' + this.childName + '-Meta-' + k] = meta[k];
      }
    }
  }

  return headers;
};
