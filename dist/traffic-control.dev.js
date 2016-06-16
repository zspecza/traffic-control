(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('trafficControl', factory) :
  (global.trafficControl = factory());
}(this, function () { 'use strict';

  (function (self) {
    'use strict';

    if (self.fetch) {
      return;
    }

    var support = {
      searchParams: 'URLSearchParams' in self,
      iterable: 'Symbol' in self && 'iterator' in Symbol,
      blob: 'FileReader' in self && 'Blob' in self && function () {
        try {
          new Blob();
          return true;
        } catch (e) {
          return false;
        }
      }(),
      formData: 'FormData' in self,
      arrayBuffer: 'ArrayBuffer' in self
    };

    function normalizeName(name) {
      if (typeof name !== 'string') {
        name = String(name);
      }
      if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
        throw new TypeError('Invalid character in header field name');
      }
      return name.toLowerCase();
    }

    function normalizeValue(value) {
      if (typeof value !== 'string') {
        value = String(value);
      }
      return value;
    }

    // Build a destructive iterator for the value list
    function iteratorFor(items) {
      var iterator = {
        next: function next() {
          var value = items.shift();
          return { done: value === undefined, value: value };
        }
      };

      if (support.iterable) {
        iterator[Symbol.iterator] = function () {
          return iterator;
        };
      }

      return iterator;
    }

    function Headers(headers) {
      this.map = {};

      if (headers instanceof Headers) {
        headers.forEach(function (value, name) {
          this.append(name, value);
        }, this);
      } else if (headers) {
        Object.getOwnPropertyNames(headers).forEach(function (name) {
          this.append(name, headers[name]);
        }, this);
      }
    }

    Headers.prototype.append = function (name, value) {
      name = normalizeName(name);
      value = normalizeValue(value);
      var list = this.map[name];
      if (!list) {
        list = [];
        this.map[name] = list;
      }
      list.push(value);
    };

    Headers.prototype['delete'] = function (name) {
      delete this.map[normalizeName(name)];
    };

    Headers.prototype.get = function (name) {
      var values = this.map[normalizeName(name)];
      return values ? values[0] : null;
    };

    Headers.prototype.getAll = function (name) {
      return this.map[normalizeName(name)] || [];
    };

    Headers.prototype.has = function (name) {
      return this.map.hasOwnProperty(normalizeName(name));
    };

    Headers.prototype.set = function (name, value) {
      this.map[normalizeName(name)] = [normalizeValue(value)];
    };

    Headers.prototype.forEach = function (callback, thisArg) {
      Object.getOwnPropertyNames(this.map).forEach(function (name) {
        this.map[name].forEach(function (value) {
          callback.call(thisArg, value, name, this);
        }, this);
      }, this);
    };

    Headers.prototype.keys = function () {
      var items = [];
      this.forEach(function (value, name) {
        items.push(name);
      });
      return iteratorFor(items);
    };

    Headers.prototype.values = function () {
      var items = [];
      this.forEach(function (value) {
        items.push(value);
      });
      return iteratorFor(items);
    };

    Headers.prototype.entries = function () {
      var items = [];
      this.forEach(function (value, name) {
        items.push([name, value]);
      });
      return iteratorFor(items);
    };

    if (support.iterable) {
      Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
    }

    function consumed(body) {
      if (body.bodyUsed) {
        return Promise.reject(new TypeError('Already read'));
      }
      body.bodyUsed = true;
    }

    function fileReaderReady(reader) {
      return new Promise(function (resolve, reject) {
        reader.onload = function () {
          resolve(reader.result);
        };
        reader.onerror = function () {
          reject(reader.error);
        };
      });
    }

    function readBlobAsArrayBuffer(blob) {
      var reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      return fileReaderReady(reader);
    }

    function readBlobAsText(blob) {
      var reader = new FileReader();
      reader.readAsText(blob);
      return fileReaderReady(reader);
    }

    function Body() {
      this.bodyUsed = false;

      this._initBody = function (body) {
        this._bodyInit = body;
        if (typeof body === 'string') {
          this._bodyText = body;
        } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
          this._bodyBlob = body;
        } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
          this._bodyFormData = body;
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this._bodyText = body.toString();
        } else if (!body) {
          this._bodyText = '';
        } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
          // Only support ArrayBuffers for POST method.
          // Receiving ArrayBuffers happens via Blobs, instead.
        } else {
            throw new Error('unsupported BodyInit type');
          }

        if (!this.headers.get('content-type')) {
          if (typeof body === 'string') {
            this.headers.set('content-type', 'text/plain;charset=UTF-8');
          } else if (this._bodyBlob && this._bodyBlob.type) {
            this.headers.set('content-type', this._bodyBlob.type);
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
          }
        }
      };

      if (support.blob) {
        this.blob = function () {
          var rejected = consumed(this);
          if (rejected) {
            return rejected;
          }

          if (this._bodyBlob) {
            return Promise.resolve(this._bodyBlob);
          } else if (this._bodyFormData) {
            throw new Error('could not read FormData body as blob');
          } else {
            return Promise.resolve(new Blob([this._bodyText]));
          }
        };

        this.arrayBuffer = function () {
          return this.blob().then(readBlobAsArrayBuffer);
        };

        this.text = function () {
          var rejected = consumed(this);
          if (rejected) {
            return rejected;
          }

          if (this._bodyBlob) {
            return readBlobAsText(this._bodyBlob);
          } else if (this._bodyFormData) {
            throw new Error('could not read FormData body as text');
          } else {
            return Promise.resolve(this._bodyText);
          }
        };
      } else {
        this.text = function () {
          var rejected = consumed(this);
          return rejected ? rejected : Promise.resolve(this._bodyText);
        };
      }

      if (support.formData) {
        this.formData = function () {
          return this.text().then(decode);
        };
      }

      this.json = function () {
        return this.text().then(JSON.parse);
      };

      return this;
    }

    // HTTP methods whose capitalization should be normalized
    var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

    function normalizeMethod(method) {
      var upcased = method.toUpperCase();
      return methods.indexOf(upcased) > -1 ? upcased : method;
    }

    function Request(input, options) {
      options = options || {};
      var body = options.body;
      if (Request.prototype.isPrototypeOf(input)) {
        if (input.bodyUsed) {
          throw new TypeError('Already read');
        }
        this.url = input.url;
        this.credentials = input.credentials;
        if (!options.headers) {
          this.headers = new Headers(input.headers);
        }
        this.method = input.method;
        this.mode = input.mode;
        if (!body) {
          body = input._bodyInit;
          input.bodyUsed = true;
        }
      } else {
        this.url = input;
      }

      this.credentials = options.credentials || this.credentials || 'omit';
      if (options.headers || !this.headers) {
        this.headers = new Headers(options.headers);
      }
      this.method = normalizeMethod(options.method || this.method || 'GET');
      this.mode = options.mode || this.mode || null;
      this.referrer = null;

      if ((this.method === 'GET' || this.method === 'HEAD') && body) {
        throw new TypeError('Body not allowed for GET or HEAD requests');
      }
      this._initBody(body);
    }

    Request.prototype.clone = function () {
      return new Request(this);
    };

    function decode(body) {
      var form = new FormData();
      body.trim().split('&').forEach(function (bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
      return form;
    }

    function headers(xhr) {
      var head = new Headers();
      var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n');
      pairs.forEach(function (header) {
        var split = header.trim().split(':');
        var key = split.shift().trim();
        var value = split.join(':').trim();
        head.append(key, value);
      });
      return head;
    }

    Body.call(Request.prototype);

    function Response(bodyInit, options) {
      if (!options) {
        options = {};
      }

      this.type = 'default';
      this.status = options.status;
      this.ok = this.status >= 200 && this.status < 300;
      this.statusText = options.statusText;
      this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
      this.url = options.url || '';
      this._initBody(bodyInit);
    }

    Body.call(Response.prototype);

    Response.prototype.clone = function () {
      return new Response(this._bodyInit, {
        status: this.status,
        statusText: this.statusText,
        headers: new Headers(this.headers),
        url: this.url
      });
    };

    Response.error = function () {
      var response = new Response(null, { status: 0, statusText: '' });
      response.type = 'error';
      return response;
    };

    var redirectStatuses = [301, 302, 303, 307, 308];

    Response.redirect = function (url, status) {
      if (redirectStatuses.indexOf(status) === -1) {
        throw new RangeError('Invalid status code');
      }

      return new Response(null, { status: status, headers: { location: url } });
    };

    self.Headers = Headers;
    self.Request = Request;
    self.Response = Response;

    self.fetch = function (input, init) {
      return new Promise(function (resolve, reject) {
        var request;
        if (Request.prototype.isPrototypeOf(input) && !init) {
          request = input;
        } else {
          request = new Request(input, init);
        }

        var xhr = new XMLHttpRequest();

        function responseURL() {
          if ('responseURL' in xhr) {
            return xhr.responseURL;
          }

          // Avoid security warnings on getResponseHeader when not allowed by CORS
          if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
            return xhr.getResponseHeader('X-Request-URL');
          }

          return;
        }

        xhr.onload = function () {
          var options = {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: headers(xhr),
            url: responseURL()
          };
          var body = 'response' in xhr ? xhr.response : xhr.responseText;
          resolve(new Response(body, options));
        };

        xhr.onerror = function () {
          reject(new TypeError('Network request failed'));
        };

        xhr.ontimeout = function () {
          reject(new TypeError('Network request failed'));
        };

        xhr.open(request.method, request.url, true);

        if (request.credentials === 'include') {
          xhr.withCredentials = true;
        }

        if ('responseType' in xhr && support.blob) {
          xhr.responseType = 'blob';
        }

        request.headers.forEach(function (value, name) {
          xhr.setRequestHeader(name, value);
        });

        xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
      });
    };
    self.fetch.polyfill = true;
  })(typeof self !== 'undefined' ? self : this);

  var initialMarkup = "<div class=\"tc-bar\">\n  <div class=\"tc-message\">\n    <div class=\"tc-container\">\n      <div class=\"tc-message--text tc-message--loading\">\n        Loading git info\n      </div>\n      <div class=\"tc-message--text tc-message--synchronized\">\n        You are viewing the staging site.\n        Everything is in sync, production is even with staging. 👌\n      </div>\n      <div class=\"tc-message--text tc-message--ahead\"></div>\n      <div class=\"tc-message--text tc-message--diverged\"></div>\n      <div class=\"tc-message--text tc-message--instruction\"></div>\n      <div class=\"tc-message--text tc-message--unauthorized\">\n        You are viewing the staging site,\n        but you cannot deploy or view changes\n        until you authorize read/write access\n        to your Github repository.\n      </div>\n      <div class=\"tc-message--text tc-message--conflict\">\n        Could not perform merge due to a merge conflict.\n        You'll have to do this update manually. 😕\n      </div>\n      <div class=\"tc-message--text tc-message--success\">\n        Merge successful! ✨🎊\n      </div>\n    </div>\n  </div>\n  <div class=\"tc-action\">\n    <div class=\"tc-container\">\n      <button\n        class=\"tc-action--button tc-action--deploy\"\n        aria-label=\"Perform a deployment to the production branch.\"\n      >Deploy</button>\n      <button\n        class=\"tc-action--button tc-action--authorize\"\n        aria-label=\"Authorize traffic-control to access your Github account.\"\n      >Authorize</button>\n      <button\n        class=\"tc-action--button tc-action--info\"\n        aria-label=\"Find out more information.\"\n      >How?</button>\n      <button\n        class=\"tc-action--button tc-action--ok\"\n        aria-label=\"Close git instructions\"\n      >Ok</button>\n      <button\n        class=\"tc-action--button tc-action--conflict\"\n        aria-label=\"Close merge conflict message\"\n      >Ok</button>\n    </div>\n  </div>\n  <div class=\"tc-close\">\n    <div class=\"tc-container\">\n      <button\n        class=\"tc-close--button\"\n        aria-label=\"Close traffic-control deployment user interface.\"\n      >&times;</button>\n    </div>\n  </div>\n</div>\n";

  var styles = "/*\n  Note: there is a lot of repetition going on in this CSS.\n  This is intentional, in order to keep specificity low\n  enough that custom styles are easier to implement.\n */\n\ntraffic-control {\n  box-sizing: border-box;\n}\n\ntraffic-control *,\ntraffic-control *:before,\ntraffic-control *:after {\n  box-sizing: inherit;\n}\n\ntraffic-control {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  z-index: 10000;\n}\n\ntraffic-control .tc-container {\n  position: relative;\n}\n\ntraffic-control .tc-bar {\n  display: none;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  table-layout: fixed;\n  font-family: sans-serif;\n  background: #eee;\n  color: #aaa;\n  transition: all .2s ease;\n  min-height: 60px;\n}\n\ntraffic-control.is-loading .tc-bar {\n  background: #eee;\n  color: #aaa;\n}\n\ntraffic-control.is-instruction .tc-bar {\n  background: #333;\n  color: #fff;\n}\n\ntraffic-control.is-unauthorized .tc-bar {\n  background: #E02D2D;\n  color: #fff;\n}\n\ntraffic-control.is-conflict .tc-bar {\n  background: #E02D2D;\n  color: #fff;\n}\n\ntraffic-control.is-diverged .tc-bar {\n  background: #FFC72F;\n  color: #784E4E;\n}\n\ntraffic-control.is-ahead .tc-bar {\n  background: #B8D5E9;\n  color: #505050;\n}\n\ntraffic-control.is-synchronized .tc-bar {\n  background: #BAE9B8;\n  color: #505050;\n}\n\ntraffic-control.is-success .tc-bar {\n  background: #BAE9B8;\n  color: #505050;\n}\n\ntraffic-control .tc-bar.is-entering {\n  animation: slideInUp .6s ease both;\n  animation-delay: .6s;\n}\n\ntraffic-control .tc-bar.is-leaving {\n  animation: slideOutDown .6s ease both;\n}\n\ntraffic-control .tc-message {\n  display: table-cell;\n  vertical-align: middle;\n  height: 100%;\n}\n\ntraffic-control .tc-action {\n  display: table-cell;\n  vertical-align: middle;\n  height: 100%;\n  width: 100px;\n}\n\ntraffic-control .tc-action--button {\n  margin: 0 auto;\n  width: 80%;\n  padding: 8px 0;\n  text-transform: uppercase;\n  color: #eee;\n  background: transparent;\n  border: 1px solid;\n  border-radius: 4px;\n  outline: none;\n  cursor: pointer;\n  overflow: hidden;\n  transition: .5s ease;\n}\n\ntraffic-control .tc-action--button:hover {\n  background: rgba(255, 255, 255, 0.2);\n}\n\ntraffic-control .tc-action--button:active {\n  transform: scale(0.2);\n}\n\ntraffic-control.is-diverged .tc-action--button {\n  color: #BB8800;\n}\n\ntraffic-control.is-ahead .tc-action--button {\n  color: #678BA3;\n}\n\ntraffic-control .tc-close {\n  display: table-cell;\n  vertical-align: middle;\n  height: 100%;\n  width: 60px;\n  border-left: 1px solid #eee;\n  transition: all .25s ease;\n}\n\ntraffic-control .tc-close:hover {\n  background: rgba(0, 0, 0, 0.1);\n}\n\ntraffic-control.is-loading .tc-close {\n  border-color: #ccc;\n}\n\ntraffic-control.is-diverged .tc-close {\n  border-color: #FFDA77;\n}\n\ntraffic-control.is-instruction .tc-close {\n  border-color: #888;\n}\n\ntraffic-control.is-unauthorized .tc-close {\n  border-color: #ED5252;\n}\n\ntraffic-control.is-conflict .tc-close {\n  border-color: #ED5252;\n}\n\ntraffic-control.is-ahead .tc-close {\n  border-color: #C4DEF0;\n}\n\ntraffic-control.is-synchronized .tc-close {\n  border-color: #C6F5C4;\n}\n\ntraffic-control.is-success .tc-close {\n  border-color: #C6F5C4;\n}\n\ntraffic-control .tc-message--text {\n  font-size: 14px;\n  position: relative;\n  padding: 16px;\n  backface-visibility: hidden;\n}\n\ntraffic-control .tc-message--text a {\n  font-weight: bold;\n}\n\ntraffic-control.is-diverged .tc-message--text a {\n  color: #BB8800;\n}\n\ntraffic-control.is-ahead .tc-message--text a {\n  color: #678BA3;\n}\n\ntraffic-control .tc-message--loading {\n  display: none;\n}\n\ntraffic-control .tc-message--loading:after {\n  margin-left: -2px;\n  content: ' ';\n  animation: ellipsis 1s linear infinite;\n}\n\ntraffic-control .tc-message--loading.is-entering {\n  animation: slideInUp .6s cubic-bezier(0.19, 1, 0.22, 1) both;\n}\n\ntraffic-control .tc-message--loading.is-leaving {\n  animation: slideOutUp .6s cubic-bezier(0.95, 0.05, 0.795, 0.035) both;\n}\n\ntraffic-control .tc-message--instruction {\n  display: none;\n  font-family: monospace;\n}\n\ntraffic-control .tc-message--instruction.is-entering {\n  animation: slideInUp .6s cubic-bezier(0.19, 1, 0.22, 1) both;\n}\n\ntraffic-control .tc-message--instruction.is-leaving {\n  animation: slideOutUp .6s cubic-bezier(0.95, 0.05, 0.795, 0.035) both;\n}\n\ntraffic-control .tc-message--synchronized {\n  display: none;\n}\n\ntraffic-control .tc-message--synchronized.is-entering {\n  animation: slideInUp .6s cubic-bezier(0.19, 1, 0.22, 1) both;\n}\n\ntraffic-control .tc-message--synchronized.is-leaving {\n  animation: slideOutUp .6s cubic-bezier(0.95, 0.05, 0.795, 0.035) both;\n}\n\ntraffic-control .tc-message--diverged {\n  display: none;\n}\n\ntraffic-control .tc-message--diverged.is-entering {\n  animation: slideInUp .6s cubic-bezier(0.19, 1, 0.22, 1) both;\n}\n\ntraffic-control .tc-message--diverged.is-leaving {\n  animation: slideOutUp .6s cubic-bezier(0.95, 0.05, 0.795, 0.035) both;\n}\n\ntraffic-control .tc-message--unauthorized {\n  display: none;\n}\n\ntraffic-control .tc-message--unauthorized.is-entering {\n  animation: slideInUp .6s cubic-bezier(0.19, 1, 0.22, 1) both;\n}\n\ntraffic-control .tc-message--unauthorized.is-leaving {\n  animation: slideOutUp .6s cubic-bezier(0.95, 0.05, 0.795, 0.035) both;\n}\n\ntraffic-control .tc-message--conflict {\n  display: none;\n}\n\ntraffic-control .tc-message--conflict.is-entering {\n  animation: slideInUp .6s cubic-bezier(0.19, 1, 0.22, 1) both;\n}\n\ntraffic-control .tc-message--conflict.is-leaving {\n  animation: slideOutUp .6s cubic-bezier(0.95, 0.05, 0.795, 0.035) both;\n}\n\ntraffic-control .tc-message--success {\n  display: none;\n}\n\ntraffic-control .tc-message--success.is-entering {\n  animation: slideInUp .6s cubic-bezier(0.19, 1, 0.22, 1) both;\n}\n\ntraffic-control .tc-message--success.is-leaving {\n  animation: slideOutUp .6s cubic-bezier(0.95, 0.05, 0.795, 0.035) both;\n}\n\ntraffic-control .tc-message--ahead {\n  display: none;\n}\n\ntraffic-control .tc-message--ahead.is-entering {\n  animation: slideInUp .6s cubic-bezier(0.19, 1, 0.22, 1) both;\n}\n\ntraffic-control .tc-message--ahead.is-leaving {\n  animation: slideOutUp .6s cubic-bezier(0.95, 0.05, 0.795, 0.035) both;\n}\n\ntraffic-control .tc-action--deploy {\n  display: none;\n}\n\ntraffic-control .tc-action--deploy.is-entering {\n  animation: slideInUp .6s ease both;\n}\n\ntraffic-control .tc-action--deploy.is-leaving {\n  animation: slideOutUp .6s ease both;\n}\n\ntraffic-control .tc-action--ok {\n  display: none;\n}\n\ntraffic-control .tc-action--ok.is-entering {\n  animation: slideInUp .6s ease both;\n}\n\ntraffic-control .tc-action--ok.is-leaving {\n  animation: slideOutUp .6s ease both;\n}\n\ntraffic-control .tc-action--info {\n  display: none;\n}\n\ntraffic-control .tc-action--info.is-entering {\n  animation: slideInUp .6s ease both;\n}\n\ntraffic-control .tc-action--info.is-leaving {\n  animation: slideOutUp .6s ease both;\n}\n\ntraffic-control .tc-action--authorize {\n  display: none;\n}\n\ntraffic-control .tc-action--authorize.is-entering {\n  animation: slideInUp .6s ease both;\n}\n\ntraffic-control .tc-action--authorize.is-leaving {\n  animation: slideOutUp .6s ease both;\n}\n\ntraffic-control .tc-action--conflict {\n  display: none;\n}\n\ntraffic-control .tc-action--conflict.is-entering {\n  animation: slideInUp .6s ease both;\n}\n\ntraffic-control .tc-action--conflict.is-leaving {\n  animation: slideOutUp .6s ease both;\n}\n\ntraffic-control .tc-action--success {\n  display: none;\n}\n\ntraffic-control .tc-action--success.is-entering {\n  animation: slideInUp .6s ease both;\n}\n\ntraffic-control .tc-action--success.is-leaving {\n  animation: slideOutUp .6s ease both;\n}\n\ntraffic-control .tc-close--button {\n  display: none;\n  margin: 0 auto;\n  padding: 16px;\n  width: 100%;\n  border: none;\n  outline: none;\n  background: none;\n  color: #eee;\n  font-size: 24px;\n  font-family: Arial, sans-serif;\n  cursor: pointer;\n  height: 100%;\n  position: relative;\n  transition: all .2s ease;\n  text-align: center;\n}\n\ntraffic-control.is-loading .tc-close--button {\n  color: #ccc;\n}\n\ntraffic-control.is-diverged .tc-close--button {\n  color: #FFDA77;\n}\n\ntraffic-control.is-instruction .tc-close--button {\n  color: #888;\n}\n\ntraffic-control.is-unauthorized .tc-close--button {\n  color: #ED5252;\n}\n\ntraffic-control.is-conflict .tc-close--button {\n  color: #ED5252;\n}\n\ntraffic-control.is-ahead .tc-close--button {\n  color: #C4DEF0;\n}\n\ntraffic-control.is-synchronized .tc-close--button {\n  color: #C6F5C4;\n}\n\ntraffic-control.is-success .tc-close--button {\n  color: #C6F5C4;\n}\n\ntraffic-control .tc-close--button.is-entering {\n  animation: slideInUp .6s cubic-bezier(0.19, 1, 0.22, 1) both;\n}\n\ntraffic-control .tc-close--button.is-leaving {\n  animation: slideOutUp .6s cubic-bezier(0.95, 0.05, 0.795, 0.035) both;\n}\n\ntraffic-control .tc-bar.is-active {\n  display: table;\n}\n\ntraffic-control .tc-message--loading.is-active {\n  display: block;\n}\n\ntraffic-control .tc-message--synchronized.is-active {\n  display: block;\n}\n\ntraffic-control .tc-message--diverged.is-active {\n  display: block;\n}\n\ntraffic-control .tc-message--unauthorized.is-active {\n  display: block;\n}\n\ntraffic-control .tc-message--conflict.is-active {\n  display: block;\n}\n\ntraffic-control .tc-message--success.is-active {\n  display: block;\n}\n\ntraffic-control .tc-message--instruction.is-active {\n  display: block;\n}\n\ntraffic-control .tc-message--ahead.is-active {\n  display: block;\n}\n\ntraffic-control .tc-action--deploy.is-active {\n  display: block;\n}\n\ntraffic-control .tc-action--ok.is-active {\n  display: block;\n}\n\ntraffic-control .tc-action--conflict.is-active {\n  display: block;\n}\n\ntraffic-control .tc-action--success.is-active {\n  display: block;\n}\n\ntraffic-control .tc-action--info.is-active {\n  display: block;\n}\n\ntraffic-control .tc-action--authorize.is-active {\n  display: block;\n}\n\ntraffic-control .tc-close--button.is-active {\n  display: block;\n}\n\n@keyframes slideInUp {\n  0% {\n    transform: translateY(100%);\n    opacity: 0;\n  }\n  100% {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n\n@keyframes slideOutUp {\n  0% {\n    transform: translateY(0);\n    opacity: 1;\n  }\n  100% {\n    transform: translateY(-100%);\n    opacity: 0;\n  }\n}\n\n@keyframes slideOutDown {\n  0% {\n    transform: translateY(0);\n    opacity: 1;\n  }\n  100% {\n    transform: translateY(100%);\n    opacity: 0;\n  }\n}\n\n@keyframes ellipsis {\n  0% {\n    content: ' '\n  }\n  33% {\n    content: '.'\n  }\n  66% {\n    content: '..'\n  }\n  99% {\n    content: '...'\n  }\n}\n";

  /**
   * Adds an event listener to an element
   * @param  {HTMLElement} el        - the element to add the listener on
   * @param  {String}      eventName - the name of the event
   * @param  {Function}    func      - the listener to add
   */

  function on(el, eventName, func) {
    el.addEventListener(eventName, func, false);
  }

  /**
   * Adds CSS to the page
   * @param {String} css - a block of CSS
   */

  function addCSS(css) {
    var style = document.createElement('style');
    var head = document.head || document.getElementsByTagName('head')[0];
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }

  /**
   * Determines if an element has a classname.
   * @param  {HTMLElement}  el            - the element to check
   * @param  {String}       ...classNames - an argument list of classnames
   * @return {Boolean}                    - true if element has class
   */

  function hasClass(el) {
    var _el$classList;

    for (var _len = arguments.length, classNames = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      classNames[_key - 1] = arguments[_key];
    }

    return (_el$classList = el.classList).contains.apply(_el$classList, classNames);
  }

  /**
   * adds a list of classnames to an html element
   * @param {HTMLElement} el            - the element to add the classnames to
   * @param {String}      ...classNames - an argument list of classnames
   */

  function addClass(el) {
    var _el$classList;

    for (var _len = arguments.length, classNames = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      classNames[_key - 1] = arguments[_key];
    }

    (_el$classList = el.classList).add.apply(_el$classList, classNames);
  }

  /**
   * removes a list of classnames from an html element
   * @param {HTMLElement} el            - the element to remove the classnames from
   * @param {String}      ...classNames - an argument list of classnames
   */

  function removeClass(el) {
    var _el$classList;

    for (var _len = arguments.length, classNames = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      classNames[_key - 1] = arguments[_key];
    }

    (_el$classList = el.classList).remove.apply(_el$classList, classNames);
  }

  /**
   * fetches an uncached JSON response
   * @param  {String} url - the URL to grab json from
   * @return {Promise}    - a promise for the json data
   */

  function getJSON (url) {
    return new Promise(function (resolve, reject) {
      window.fetch(url, {
        cache: 'no-cache'
      }).then(function (response) {
        return response.ok ? response : Promise.reject(response.statusText);
      }).then(function (response) {
        return response.json();
      }).then(resolve).catch(reject);
    });
  }

  /**
   * Posts JSON to an endpoint, does not cache responses
   * @param  {String} url  - the URL to POST to
   * @param  {Object} json - the unserialized data to POST
   * @return {Promise}     - a promise for the response
   */

  function postJSON (url, json) {
    return new Promise(function (resolve, reject) {
      window.fetch(url, {
        method: 'POST',
        body: JSON.stringify(json),
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        return response.ok ? response : Promise.reject(response.statusText);
      }).then(resolve).catch(reject);
    });
  }

  /**
   * Normalizes `animationend` event accross different browsers.
   * @return {String} - the event name for thecurrent vendor
   */

  var animationEnd = (function () {
    var el = document.createElement('fakeelement');
    var animations = {
      'animation': 'animationend',
      'OAnimation': 'oanimationend',
      'MozAnimation': 'animationend',
      'WebkitAnimation': 'webkitAnimationEnd',
      'MSAnimation': 'MSAnimationEnd'
    };
    for (var t in animations) {
      if (!el.style[t] != null) {
        return animations[t];
      }
    }
  })();

  /**
   * Removes an event listener.
   * @param  {HTMLElement} el        - the element to remove the event listener from
   * @param  {String}      eventName - the name of the event
   * @param  {Function}    func      - the listener to remove
   */

  function off(el, eventName, func) {
    el.removeEventListener(eventName, func);
  }

  /**
   * Adds a one-time-only event listener to an element
   * @param {HTMLElement} el        - the element to add the listener to
   * @param {String}      eventName - the name of the event
   * @param {Function}    func      - the listener to add
   */
  function once(el, eventName, func) {
    var cb = function cb() {
      func.apply(undefined, arguments);
      off(el, eventName, cb);
    };
    on(el, eventName, cb);
  }

  /**
   * Adds classes to an html element one by one
   * @param {HTMLElement} el            - the element to add the classes to
   * @param {String}      ...classNames - an argument list of class names
   */
  function addClassesInSequence(el) {
    for (var _len = arguments.length, classNames = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      classNames[_key - 1] = arguments[_key];
    }

    for (var i = 0, len = classNames.length; i < len; i++) {
      addClass(el, classNames[i]);
    }
  }

  /**
   * Removes classes from an html element one by one
   * @param {HTMLElement} el            - the element to remove the classes from
   * @param {String}      ...classNames - an argument list of class names
   */
  function removeClassesInSequence(el) {
    for (var _len = arguments.length, classNames = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      classNames[_key - 1] = arguments[_key];
    }

    for (var i = 0, len = classNames.length; i < len; i++) {
      removeClass(el, classNames[i]);
    }
  }

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  /**
   * @class AnimationEngine
   * @classdesc a tiny fake animation engine that works by setting enter & leave classes that trigger @keyframe animations
   */

  var AnimationEngine = function () {
    /**
     * @constructs AnimationEngine
     * @param  {Object} opts             - settings for animations
     * @param  {String} opts.enterClass  - the class to add when animating element is entering
     * @param  {String} opts.leaveClass  - the class to add when animating element is leaving
     * @param  {String} opts.activeClass - the class to add when animated element is active
     * @return {Object}                  - an instance of the animation engine
     */

    function AnimationEngine() {
      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      classCallCheck(this, AnimationEngine);

      this.opts = Object.assign({
        enterClass: 'is-entering',
        activeClass: 'is-active',
        leaveClass: 'is-leaving'
      }, opts);
    }

    /**
     * Adds class that triggers enter animation for any number of elements.
     * @param  {HTMLElement} ...els - an argument list of elements
     * @return {Promise}            - a promise for the completed animation
     */


    createClass(AnimationEngine, [{
      key: 'animateIn',
      value: function animateIn() {
        var _this = this;

        for (var _len = arguments.length, els = Array(_len), _key = 0; _key < _len; _key++) {
          els[_key] = arguments[_key];
        }

        return Promise.all(els.map(function (el) {
          return new Promise(function (resolve) {
            once(el, animationEnd, resolve);
            addClassesInSequence(el, _this.opts.activeClass, _this.opts.enterClass);
          });
        }));
      }

      /**
       * Adds class that triggers leave animation for any number of elements.
       * @param  {HTMLElement} ...els - an argument list of elements
       * @return {Promise}            - a promise for the completed animation
       */

    }, {
      key: 'animateOut',
      value: function animateOut() {
        var _this2 = this;

        for (var _len2 = arguments.length, els = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          els[_key2] = arguments[_key2];
        }

        return Promise.all(els.map(function (el) {
          return new Promise(function (resolve) {
            once(el, animationEnd, function () {
              removeClassesInSequence(el, _this2.opts.leaveClass, _this2.opts.activeClass);
              resolve();
            });
            removeClass(el, _this2.opts.enterClass);
            addClass(el, _this2.opts.leaveClass);
          });
        }));
      }
    }]);
    return AnimationEngine;
  }();

  var animator = new AnimationEngine();
  var netlify = window.netlify;
  var localStorage = window.localStorage;

  /**
   * @class TrafficControl
   * @classdesc adds a bar to a website that allows one-click deploys
   */

  var TrafficControl = function () {
    /**
     * @constructs TrafficControl
     * @param  {Object}      opts = {}                             - Settings
     * @param  {HTMLElement} opts.containerEl = document.body      - the container element on which you want to append TrafficControl
     * @param  {String}      opts.ghAPI = 'https://api.github.com' - the Github API endpoint (differs for enterprise)
     * @param  {String}      opts.repo                             - the repo e.g. 'declandewet/traffic-control'
     * @param  {String}      opts.productionBranch = 'master'      - the GIT branch on which your production code is stored
     * @param  {String}      opts.stagingBranch = 'develop'        - the GIT branch on which your staging code is stored
     * @return {Object}                                            - An instance of TrafficControl
     */

    function TrafficControl() {
      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      classCallCheck(this, TrafficControl);

      opts = Object.assign({}, this.getDefaultOpts(), opts);
      opts.repoURL = opts.ghAPI + '/repos/' + opts.repo;
      opts.compareURL = opts.repoURL + '/compare';
      opts.compareBranchesURL = opts.compareURL + '/' + opts.productionBranch + '...' + opts.stagingBranch;
      this.opts = this.validateOpts(opts);
      this.init();
    }

    /**
     * Simply returns default settings.
     * @return {Object} - the default settings for traffic-control
     */


    createClass(TrafficControl, [{
      key: 'getDefaultOpts',
      value: function getDefaultOpts() {
        return {
          stagingBranch: 'develop',
          productionBranch: 'master',
          ghAPI: 'https://api.github.com',
          containerEl: document.body
        };
      }

      /**
       * Validates user-supplied options.
       * Throws on invalid options.
       * @param  {Object} opts - the options to validate
       * @return {Object}      - if validation is passed, the original options.
       */

    }, {
      key: 'validateOpts',
      value: function validateOpts(opts) {
        if (opts.repo == null) {
          throw new Error('You need to specify a repository.');
        }
        return opts;
      }

      /**
       * Initializes traffic-control. Adds necessary CSS to the page and fills
       * default UI with necessary markup.
       */

    }, {
      key: 'init',
      value: function init() {
        var _this = this;

        addCSS(styles);
        this.initializeElementWithMarkup();
        this.instantiateElementWithDefaultState().then(function () {
          return _this.computeAndAnimateState();
        }).catch(function (error) {
          return console.error(error);
        });
      }

      /**
       * Creates the initial element, registers events and fills
       * necessary text.
       */

    }, {
      key: 'initializeElementWithMarkup',
      value: function initializeElementWithMarkup() {
        this.el = document.createElement('traffic-control');
        this.el.id = 'traffic-control';
        this.el.innerHTML = initialMarkup;
        this.addDomRefs();
        this.els.instructionMsg.innerHTML = '\n      git checkout ' + this.opts.stagingBranch + ' &&\n      git pull -r origin ' + this.opts.productionBranch + ' &&\n      git push origin ' + this.opts.stagingBranch + ' --force\n    ';
        this.addEventHooks();
        this.addStates();
      }

      /**
       * Registers `traffic-control` related DOM elements.
       */

    }, {
      key: 'addDomRefs',
      value: function addDomRefs() {
        this.els = this.getDOMReferences({
          bar: 'tc-bar',
          loadingMsg: 'tc-message--loading',
          syncedMsg: 'tc-message--synchronized',
          aheadMsg: 'tc-message--ahead',
          divergedMsg: 'tc-message--diverged',
          unauthedMsg: 'tc-message--unauthorized',
          instructionMsg: 'tc-message--instruction',
          conflictMsg: 'tc-message--conflict',
          successMsg: 'tc-message--success',
          deployBtn: 'tc-action--deploy',
          authBtn: 'tc-action--authorize',
          infoBtn: 'tc-action--info',
          okBtn: 'tc-action--ok',
          conflictBtn: 'tc-action--conflict',
          closeBtn: 'tc-close--button'
        });
      }

      /**
       * Registers a state with `traffic-control`. A state is
       * a different variation of UI.
       * @param {String}                    name - name of the state
       * @param {Object|Array<HTMLElement>} opts - a list of this state's elements or an object containing a `ui` list and a `persist` boolean. Persistence protects the el from being hidden/removed.
       */

    }, {
      key: 'addState',
      value: function addState(name, opts) {
        var _this2 = this;

        var state = void 0;
        this.states = this.states || {};
        if (Array.isArray(opts)) {
          state = { ui: opts };
        } else {
          state = opts;
        }
        state.ui = state.ui.map(function (el) {
          return _this2.els[el];
        });
        this.states[name] = state;
      }

      /**
       * Registers all of `traffic-control`'s default states.
       */

    }, {
      key: 'addStates',
      value: function addStates() {
        this.addState('mounted', {
          ui: ['bar'],
          persist: true
        });
        this.addState('loading', ['loadingMsg', 'closeBtn']);
        this.addState('unauthorized', ['unauthedMsg', 'authBtn', 'closeBtn']);
        this.addState('ahead', ['aheadMsg', 'deployBtn', 'closeBtn']);
        this.addState('diverged', ['divergedMsg', 'infoBtn', 'closeBtn']);
        this.addState('synchronized', ['syncedMsg', 'closeBtn']);
        this.addState('instruction', ['instructionMsg', 'okBtn', 'closeBtn']);
        this.addState('conflict', ['conflictMsg', 'conflictBtn', 'closeBtn']);
        this.addState('success', ['successMsg', 'closeBtn']);
      }

      /**
       * Registers interaction events.
       */

    }, {
      key: 'addEventHooks',
      value: function addEventHooks() {
        var _this3 = this;

        on(this.els.infoBtn, 'click', function () {
          return _this3.renderState('instruction');
        });
        on(this.els.okBtn, 'click', function () {
          return _this3.renderState('diverged');
        });
        on(this.els.closeBtn, 'click', function () {
          return _this3.unRenderState('mounted');
        });
        on(this.els.authBtn, 'click', function () {
          return _this3.authenticateGithub().then(function (_ref) {
            var token = _ref.token;

            localStorage.gh_token = token;
            return _this3.computeAndAnimateState();
          }).catch(function (error) {
            return console.error(error);
          });
        });
        on(this.els.conflictBtn, 'click', function () {
          return _this3.computeAndAnimateState();
        });
        on(this.els.deployBtn, 'click', function () {
          _this3.renderState('loading').then(function () {
            return _this3.merge();
          }).then(function (data) {
            return _this3.renderMergeStatus(data);
          }).catch(function (error) {
            return console.error(error);
          });
        });
      }

      /**
       * Called when `deploy` is clicked, renders the state of the deploy.
       * i.e. was it a success or were there conflicts?
       * @param  {Object} response        - the response from the git remote
       * @param  {Number} response.status - the response status code
       * @return {Promise}                - a promise for the rendered state
       */

    }, {
      key: 'renderMergeStatus',
      value: function renderMergeStatus(_ref2) {
        var _this4 = this;

        var status = _ref2.status;

        if (status === 201) {
          return this.renderState('success').then(function () {
            return _this4.computeAndAnimateState();
          });
        } else if (status === 409) {
          return this.renderState('conflict');
        }
      }

      /**
       * Triggers a deploy from staging to production.
       * @return {Promise} - a promise for the merge response.
       */

    }, {
      key: 'merge',
      value: function merge() {
        return postJSON(this.opts.repoURL + '/merges?access_token=' + localStorage.gh_token, {
          base: this.opts.productionBranch,
          head: this.opts.stagingBranch,
          commit_message: ':vertical_traffic_light: Production deploy triggered from traffic-control'
        });
      }

      /**
       * References a dictonary of name: class elements
       * as a dictionary of name: HTMLElement.
       * @param  {Object} classes - the classes of elements to reference
       * @return {Object}         - a dictionary reference of actual HTML elements
       */

    }, {
      key: 'getDOMReferences',
      value: function getDOMReferences(classes) {
        var o = {};
        for (var el in classes) {
          if (classes.hasOwnProperty(el)) {
            o[el] = this.el.getElementsByClassName(classes[el])[0];
          }
        }
        return o;
      }

      /**
       * Renders the initial state after appending traffic-control
       * to the containing element.
       * @return {Promise} - a promise for a mounted `traffic-control`.
       */

    }, {
      key: 'instantiateElementWithDefaultState',
      value: function instantiateElementWithDefaultState() {
        this.opts.containerEl.appendChild(this.el);
        return this.renderState('mounted');
      }

      /**
       * Computes what state traffic-control should render.
       * @return {Promise} - a promise for the final state, after animation completion.
       */

    }, {
      key: 'computeAndAnimateState',
      value: function computeAndAnimateState() {
        var _this5 = this;

        return this.renderState('loading').then(function () {
          return !localStorage.gh_token ? _this5.renderState('unauthorized') : _this5.getBranchComparison().then(function (data) {
            return _this5.renderDeploymentState(data);
          });
        }).catch(function (error) {
          return console.error(error);
        });
      }

      /**
       * Renders deployment state - can be ahead or diverged
       * @param  {Object} resp               - the JSON response of the git remote branch comparison
       * @param  {String} resp.status        - the status of the comparison. "ahead", "behind" or "diverged"
       * @param  {Number} resp.ahead_by      - the number of commits that are ahead.
       * @param  {Number} resp.behind_by     - the number of commits that are behind.
       * @param  {String} resp.permalink_url - a link to the remote's diff view.
       * @return {Promise}                   - a promise for the rendered deployment state.
       */

    }, {
      key: 'renderDeploymentState',
      value: function renderDeploymentState(_ref3) {
        var status = _ref3.status;
        var ahead_by = _ref3.ahead_by;
        var behind_by = _ref3.behind_by;
        var permalink_url = _ref3.permalink_url;

        switch (status) {
          case 'ahead':
          case 'diverged':
            this.els[status + 'Msg'].innerHTML = status === 'ahead' ? this.getAheadMessage(ahead_by, permalink_url) : this.getDivergedMessage(behind_by, permalink_url);
            return this.renderState(status);
          default:
            return this.renderState('synchronized');
        }
      }

      /**
       * Gets a comparison between branches from the git remote.
       * @return {Promise} - a promise for the JSON response.
       */

    }, {
      key: 'getBranchComparison',
      value: function getBranchComparison() {
        var cacheBuster = new Date().getTime();
        return getJSON(this.opts.compareBranchesURL + '?access_token=' + localStorage.gh_token + '&cache_buster=' + cacheBuster);
      }

      /**
       * Gets a list of the current modifiable traffic-control states.
       * @param {String} opts.filter - filter this state from the result set
       * @return {Array}             - a list of states
       */

    }, {
      key: 'getCurrentStates',
      value: function getCurrentStates(_ref4) {
        var _this6 = this;

        var filter = _ref4.filter;

        return Object.keys(this.states).filter(function (state) {
          return state !== filter && !_this6.states[state].persist;
        });
      }

      /**
       * Renders the given state after unrendering current states.
       * @param  {String}  state - the name of the state to render
       * @return {Promise}       - a promise for the rendered state
       */

    }, {
      key: 'renderState',
      value: function renderState(state) {
        var _this7 = this;

        // get a list of all states
        return Promise.all(this.getCurrentStates({ filter: state }).map(function (previousState) {
          return new Promise(function (resolve) {
            return hasClass(_this7.el, 'is-' + previousState) ? _this7.unRenderState(previousState).then(resolve) : resolve();
          });
        })).then(function () {
          addClass(_this7.el, 'is-' + state);
          return animator.animateIn.apply(animator, toConsumableArray(_this7.states[state].ui));
        });
      }

      /**
       * Unrenders a state.
       * @param  {String}  state - the name of the state to unrender.
       * @return {Promise}       - a promise for the unrendered state
       */

    }, {
      key: 'unRenderState',
      value: function unRenderState(state) {
        var _this8 = this;

        return animator.animateOut.apply(animator, toConsumableArray(this.states[state].ui)).then(function () {
          return removeClass(_this8.el, 'is-' + state);
        });
      }

      /**
       * Returns a message for ahead state.
       * @param  {Number} count - the number of commits ahead.
       * @param  {String} link  - link to diff view
       * @return {String}       - the compiled message
       */

    }, {
      key: 'getAheadMessage',
      value: function getAheadMessage(count, link) {
        return '\n      You are viewing the staging site.\n      There ' + (count > 1 ? 'have' : 'has') + ' been\n      <a href="' + link + '" target="_blank">' + count + '</a>\n      ' + (count > 1 ? 'changes' : 'change') + ' since the last production build. 🚢\n    ';
      }

      /**
       * Returns a message for diverged state.
       * @param  {Number} count - the number of commits behind.
       * @param  {String} link  - link to diff view
       * @return {String}       - the compiled message
       */

    }, {
      key: 'getDivergedMessage',
      value: function getDivergedMessage(count, link) {
        return '\n      You are viewing the staging site.\n      Staging has diverged behind production by\n      <a href="' + link + '" target="_blank">' + count + '</a>\n      ' + (count > 1 ? 'commits' : 'commit') + '. Please rebase.\n    ';
      }

      /**
       * Authenticates viewer via their Github account.
       * @return {Promise} - promise for the authenticated session.
       */

    }, {
      key: 'authenticateGithub',
      value: function authenticateGithub() {
        return new Promise(function (resolve, reject) {
          netlify.authenticate({ provider: 'github', scope: 'repo' }, function (error, data) {
            return error ? reject(error) : resolve(data);
          });
        });
      }
    }]);
    return TrafficControl;
  }();

  /**
   * [trafficControl description]
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   */
  function trafficControl(opts) {
    var netlify = window.netlify;

    /**
     * Initialises traffic-control
     * @return {Promise} - a promise for the initialized traffic-control instance
     */
    var init = function init() {
      return new TrafficControl(opts);
    };

    /**
     * Conditionally loads Netlify if not present on page
     * before initialising traffic-control
     */
    var conditionallyLoadNetlify = function conditionallyLoadNetlify() {
      if (netlify == null) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = script.onreadystatechange = init;
        script.src = 'https://app.netlify.com/authentication.js';
        return document.body.appendChild(script);
      } else {
        return init();
      }
    };

    // conditionally load netlify script and bootstrap traffic-control
    if (window.addEventListener) {
      window.addEventListener('load', conditionallyLoadNetlify, false);
    } else if (window.attachEvent) {
      window.attachEvent('onload', conditionallyLoadNetlify);
    }
  }

  return trafficControl;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhZmZpYy1jb250cm9sLmRldi5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL3doYXR3Zy1mZXRjaC9mZXRjaC5qcyIsIi4uL3NyYy90ZW1wbGF0ZS5odG1sIiwiLi4vc3JjL3N0eWxlcy5jc3MiLCIuLi9zcmMvb24uanMiLCIuLi9zcmMvYWRkQ1NTLmpzIiwiLi4vc3JjL2hhc0NsYXNzLmpzIiwiLi4vc3JjL2FkZENsYXNzLmpzIiwiLi4vc3JjL3JlbW92ZUNsYXNzLmpzIiwiLi4vc3JjL2dldEpTT04uanMiLCIuLi9zcmMvcG9zdEpTT04uanMiLCIuLi9zcmMvYW5pbWF0aW9uRW5kLmpzIiwiLi4vc3JjL29mZi5qcyIsIi4uL3NyYy9vbmNlLmpzIiwiLi4vc3JjL2FkZENsYXNzZXNJblNlcXVlbmNlLmpzIiwiLi4vc3JjL3JlbW92ZUNsYXNzZXNJblNlcXVlbmNlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vX19iYWJlbEhlbHBlcnNfXyIsIi4uL3NyYy9hbmltYXRpb24tZW5naW5lLmpzIiwiLi4vc3JjL3RyYWZmaWMtY29udHJvbC5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oc2VsZikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgaWYgKHNlbGYuZmV0Y2gpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIHZhciBzdXBwb3J0ID0ge1xuICAgIHNlYXJjaFBhcmFtczogJ1VSTFNlYXJjaFBhcmFtcycgaW4gc2VsZixcbiAgICBpdGVyYWJsZTogJ1N5bWJvbCcgaW4gc2VsZiAmJiAnaXRlcmF0b3InIGluIFN5bWJvbCxcbiAgICBibG9iOiAnRmlsZVJlYWRlcicgaW4gc2VsZiAmJiAnQmxvYicgaW4gc2VsZiAmJiAoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSkoKSxcbiAgICBmb3JtRGF0YTogJ0Zvcm1EYXRhJyBpbiBzZWxmLFxuICAgIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWUgPSBTdHJpbmcobmFtZSlcbiAgICB9XG4gICAgaWYgKC9bXmEtejAtOVxcLSMkJSYnKisuXFxeX2B8fl0vaS50ZXN0KG5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNoYXJhY3RlciBpbiBoZWFkZXIgZmllbGQgbmFtZScpXG4gICAgfVxuICAgIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIC8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG4gIGZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0ge1xuICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgICAgcmV0dXJuIHtkb25lOiB2YWx1ZSA9PT0gdW5kZWZpbmVkLCB2YWx1ZTogdmFsdWV9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZXJhdG9yXG4gIH1cblxuICBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLm1hcCA9IHt9XG5cbiAgICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcbiAgICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCB2YWx1ZSlcbiAgICAgIH0sIHRoaXMpXG5cbiAgICB9IGVsc2UgaWYgKGhlYWRlcnMpIHtcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxuICAgICAgfSwgdGhpcylcbiAgICB9XG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gICAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgICB2YXIgbGlzdCA9IHRoaXMubWFwW25hbWVdXG4gICAgaWYgKCFsaXN0KSB7XG4gICAgICBsaXN0ID0gW11cbiAgICAgIHRoaXMubWFwW25hbWVdID0gbGlzdFxuICAgIH1cbiAgICBsaXN0LnB1c2godmFsdWUpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIHZhbHVlcyA9IHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldXG4gICAgcmV0dXJuIHZhbHVlcyA/IHZhbHVlc1swXSA6IG51bGxcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmdldEFsbCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gfHwgW11cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAuaGFzT3duUHJvcGVydHkobm9ybWFsaXplTmFtZShuYW1lKSlcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gPSBbbm9ybWFsaXplVmFsdWUodmFsdWUpXVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy5tYXApLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgdGhpcy5tYXBbbmFtZV0uZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbHVlLCBuYW1lLCB0aGlzKVxuICAgICAgfSwgdGhpcylcbiAgICB9LCB0aGlzKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2gobmFtZSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkgeyBpdGVtcy5wdXNoKHZhbHVlKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkgeyBpdGVtcy5wdXNoKFtuYW1lLCB2YWx1ZV0pIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gSGVhZGVycy5wcm90b3R5cGUuZW50cmllc1xuICB9XG5cbiAgZnVuY3Rpb24gY29uc3VtZWQoYm9keSkge1xuICAgIGlmIChib2R5LmJvZHlVc2VkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gICAgfVxuICAgIGJvZHkuYm9keVVzZWQgPSB0cnVlXG4gIH1cblxuICBmdW5jdGlvbiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpXG4gICAgICB9XG4gICAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QocmVhZGVyLmVycm9yKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gICAgcmV0dXJuIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzVGV4dChibG9iKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxuICAgIHJldHVybiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICB9XG5cbiAgZnVuY3Rpb24gQm9keSgpIHtcbiAgICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcblxuICAgIHRoaXMuX2luaXRCb2R5ID0gZnVuY3Rpb24oYm9keSkge1xuICAgICAgdGhpcy5fYm9keUluaXQgPSBib2R5XG4gICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5QmxvYiA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5mb3JtRGF0YSAmJiBGb3JtRGF0YS5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKVxuICAgICAgfSBlbHNlIGlmICghYm9keSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9ICcnXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgQXJyYXlCdWZmZXIucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgLy8gT25seSBzdXBwb3J0IEFycmF5QnVmZmVycyBmb3IgUE9TVCBtZXRob2QuXG4gICAgICAgIC8vIFJlY2VpdmluZyBBcnJheUJ1ZmZlcnMgaGFwcGVucyB2aWEgQmxvYnMsIGluc3RlYWQuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Vuc3VwcG9ydGVkIEJvZHlJbml0IHR5cGUnKVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04JylcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgdGhpcy5fYm9keUJsb2IudHlwZSlcbiAgICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuYmxvYikge1xuICAgICAgdGhpcy5ibG9iID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QmxvYilcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keVRleHRdKSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmFycmF5QnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcilcbiAgICAgIH1cblxuICAgICAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyB0ZXh0JylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgICByZXR1cm4gcmVqZWN0ZWQgPyByZWplY3RlZCA6IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5VGV4dClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5mb3JtRGF0YSkge1xuICAgICAgdGhpcy5mb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihkZWNvZGUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihKU09OLnBhcnNlKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvLyBIVFRQIG1ldGhvZHMgd2hvc2UgY2FwaXRhbGl6YXRpb24gc2hvdWxkIGJlIG5vcm1hbGl6ZWRcbiAgdmFyIG1ldGhvZHMgPSBbJ0RFTEVURScsICdHRVQnLCAnSEVBRCcsICdPUFRJT05TJywgJ1BPU1QnLCAnUFVUJ11cblxuICBmdW5jdGlvbiBub3JtYWxpemVNZXRob2QobWV0aG9kKSB7XG4gICAgdmFyIHVwY2FzZWQgPSBtZXRob2QudG9VcHBlckNhc2UoKVxuICAgIHJldHVybiAobWV0aG9kcy5pbmRleE9mKHVwY2FzZWQpID4gLTEpID8gdXBjYXNlZCA6IG1ldGhvZFxuICB9XG5cbiAgZnVuY3Rpb24gUmVxdWVzdChpbnB1dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHlcbiAgICBpZiAoUmVxdWVzdC5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihpbnB1dCkpIHtcbiAgICAgIGlmIChpbnB1dC5ib2R5VXNlZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgICAgfVxuICAgICAgdGhpcy51cmwgPSBpbnB1dC51cmxcbiAgICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFsc1xuICAgICAgaWYgKCFvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5wdXQuaGVhZGVycylcbiAgICAgIH1cbiAgICAgIHRoaXMubWV0aG9kID0gaW5wdXQubWV0aG9kXG4gICAgICB0aGlzLm1vZGUgPSBpbnB1dC5tb2RlXG4gICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgYm9keSA9IGlucHV0Ll9ib2R5SW5pdFxuICAgICAgICBpbnB1dC5ib2R5VXNlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cmwgPSBpbnB1dFxuICAgIH1cblxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ29taXQnXG4gICAgaWYgKG9wdGlvbnMuaGVhZGVycyB8fCAhdGhpcy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gICAgfVxuICAgIHRoaXMubWV0aG9kID0gbm9ybWFsaXplTWV0aG9kKG9wdGlvbnMubWV0aG9kIHx8IHRoaXMubWV0aG9kIHx8ICdHRVQnKVxuICAgIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbFxuICAgIHRoaXMucmVmZXJyZXIgPSBudWxsXG5cbiAgICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb2R5IG5vdCBhbGxvd2VkIGZvciBHRVQgb3IgSEVBRCByZXF1ZXN0cycpXG4gICAgfVxuICAgIHRoaXMuX2luaXRCb2R5KGJvZHkpXG4gIH1cblxuICBSZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzKVxuICB9XG5cbiAgZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgYm9keS50cmltKCkuc3BsaXQoJyYnKS5mb3JFYWNoKGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBpZiAoYnl0ZXMpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKVxuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBmb3JtXG4gIH1cblxuICBmdW5jdGlvbiBoZWFkZXJzKHhocikge1xuICAgIHZhciBoZWFkID0gbmV3IEhlYWRlcnMoKVxuICAgIHZhciBwYWlycyA9ICh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpLnRyaW0oKS5zcGxpdCgnXFxuJylcbiAgICBwYWlycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgdmFyIHNwbGl0ID0gaGVhZGVyLnRyaW0oKS5zcGxpdCgnOicpXG4gICAgICB2YXIga2V5ID0gc3BsaXQuc2hpZnQoKS50cmltKClcbiAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJzonKS50cmltKClcbiAgICAgIGhlYWQuYXBwZW5kKGtleSwgdmFsdWUpXG4gICAgfSlcbiAgICByZXR1cm4gaGVhZFxuICB9XG5cbiAgQm9keS5jYWxsKFJlcXVlc3QucHJvdG90eXBlKVxuXG4gIGZ1bmN0aW9uIFJlc3BvbnNlKGJvZHlJbml0LCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge31cbiAgICB9XG5cbiAgICB0aGlzLnR5cGUgPSAnZGVmYXVsdCdcbiAgICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMuc3RhdHVzXG4gICAgdGhpcy5vayA9IHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMFxuICAgIHRoaXMuc3RhdHVzVGV4dCA9IG9wdGlvbnMuc3RhdHVzVGV4dFxuICAgIHRoaXMuaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMgPyBvcHRpb25zLmhlYWRlcnMgOiBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gICAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnJ1xuICAgIHRoaXMuX2luaXRCb2R5KGJvZHlJbml0KVxuICB9XG5cbiAgQm9keS5jYWxsKFJlc3BvbnNlLnByb3RvdHlwZSlcblxuICBSZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2JvZHlJbml0LCB7XG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKSxcbiAgICAgIHVybDogdGhpcy51cmxcbiAgICB9KVxuICB9XG5cbiAgUmVzcG9uc2UuZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogMCwgc3RhdHVzVGV4dDogJyd9KVxuICAgIHJlc3BvbnNlLnR5cGUgPSAnZXJyb3InXG4gICAgcmV0dXJuIHJlc3BvbnNlXG4gIH1cblxuICB2YXIgcmVkaXJlY3RTdGF0dXNlcyA9IFszMDEsIDMwMiwgMzAzLCAzMDcsIDMwOF1cblxuICBSZXNwb25zZS5yZWRpcmVjdCA9IGZ1bmN0aW9uKHVybCwgc3RhdHVzKSB7XG4gICAgaWYgKHJlZGlyZWN0U3RhdHVzZXMuaW5kZXhPZihzdGF0dXMpID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgc3RhdHVzIGNvZGUnKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogc3RhdHVzLCBoZWFkZXJzOiB7bG9jYXRpb246IHVybH19KVxuICB9XG5cbiAgc2VsZi5IZWFkZXJzID0gSGVhZGVyc1xuICBzZWxmLlJlcXVlc3QgPSBSZXF1ZXN0XG4gIHNlbGYuUmVzcG9uc2UgPSBSZXNwb25zZVxuXG4gIHNlbGYuZmV0Y2ggPSBmdW5jdGlvbihpbnB1dCwgaW5pdCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZXF1ZXN0XG4gICAgICBpZiAoUmVxdWVzdC5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihpbnB1dCkgJiYgIWluaXQpIHtcbiAgICAgICAgcmVxdWVzdCA9IGlucHV0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoaW5wdXQsIGluaXQpXG4gICAgICB9XG5cbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgICBmdW5jdGlvbiByZXNwb25zZVVSTCgpIHtcbiAgICAgICAgaWYgKCdyZXNwb25zZVVSTCcgaW4geGhyKSB7XG4gICAgICAgICAgcmV0dXJuIHhoci5yZXNwb25zZVVSTFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXZvaWQgc2VjdXJpdHkgd2FybmluZ3Mgb24gZ2V0UmVzcG9uc2VIZWFkZXIgd2hlbiBub3QgYWxsb3dlZCBieSBDT1JTXG4gICAgICAgIGlmICgvXlgtUmVxdWVzdC1VUkw6L20udGVzdCh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpKSB7XG4gICAgICAgICAgcmV0dXJuIHhoci5nZXRSZXNwb25zZUhlYWRlcignWC1SZXF1ZXN0LVVSTCcpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgaGVhZGVyczogaGVhZGVycyh4aHIpLFxuICAgICAgICAgIHVybDogcmVzcG9uc2VVUkwoKVxuICAgICAgICB9XG4gICAgICAgIHZhciBib2R5ID0gJ3Jlc3BvbnNlJyBpbiB4aHIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0XG4gICAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIG9wdGlvbnMpKVxuICAgICAgfVxuXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfVxuXG4gICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCByZXF1ZXN0LnVybCwgdHJ1ZSlcblxuICAgICAgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdpbmNsdWRlJykge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyICYmIHN1cHBvcnQuYmxvYikge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InXG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgICAgfSlcblxuICAgICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdClcbiAgICB9KVxuICB9XG4gIHNlbGYuZmV0Y2gucG9seWZpbGwgPSB0cnVlXG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcyk7XG4iLCI8ZGl2IGNsYXNzPVwidGMtYmFyXCI+XG4gIDxkaXYgY2xhc3M9XCJ0Yy1tZXNzYWdlXCI+XG4gICAgPGRpdiBjbGFzcz1cInRjLWNvbnRhaW5lclwiPlxuICAgICAgPGRpdiBjbGFzcz1cInRjLW1lc3NhZ2UtLXRleHQgdGMtbWVzc2FnZS0tbG9hZGluZ1wiPlxuICAgICAgICBMb2FkaW5nIGdpdCBpbmZvXG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0Yy1tZXNzYWdlLS10ZXh0IHRjLW1lc3NhZ2UtLXN5bmNocm9uaXplZFwiPlxuICAgICAgICBZb3UgYXJlIHZpZXdpbmcgdGhlIHN0YWdpbmcgc2l0ZS5cbiAgICAgICAgRXZlcnl0aGluZyBpcyBpbiBzeW5jLCBwcm9kdWN0aW9uIGlzIGV2ZW4gd2l0aCBzdGFnaW5nLiDwn5GMXG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0Yy1tZXNzYWdlLS10ZXh0IHRjLW1lc3NhZ2UtLWFoZWFkXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwidGMtbWVzc2FnZS0tdGV4dCB0Yy1tZXNzYWdlLS1kaXZlcmdlZFwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInRjLW1lc3NhZ2UtLXRleHQgdGMtbWVzc2FnZS0taW5zdHJ1Y3Rpb25cIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0Yy1tZXNzYWdlLS10ZXh0IHRjLW1lc3NhZ2UtLXVuYXV0aG9yaXplZFwiPlxuICAgICAgICBZb3UgYXJlIHZpZXdpbmcgdGhlIHN0YWdpbmcgc2l0ZSxcbiAgICAgICAgYnV0IHlvdSBjYW5ub3QgZGVwbG95IG9yIHZpZXcgY2hhbmdlc1xuICAgICAgICB1bnRpbCB5b3UgYXV0aG9yaXplIHJlYWQvd3JpdGUgYWNjZXNzXG4gICAgICAgIHRvIHlvdXIgR2l0aHViIHJlcG9zaXRvcnkuXG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0Yy1tZXNzYWdlLS10ZXh0IHRjLW1lc3NhZ2UtLWNvbmZsaWN0XCI+XG4gICAgICAgIENvdWxkIG5vdCBwZXJmb3JtIG1lcmdlIGR1ZSB0byBhIG1lcmdlIGNvbmZsaWN0LlxuICAgICAgICBZb3UnbGwgaGF2ZSB0byBkbyB0aGlzIHVwZGF0ZSBtYW51YWxseS4g8J+YlVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwidGMtbWVzc2FnZS0tdGV4dCB0Yy1tZXNzYWdlLS1zdWNjZXNzXCI+XG4gICAgICAgIE1lcmdlIHN1Y2Nlc3NmdWwhIOKcqPCfjopcbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInRjLWFjdGlvblwiPlxuICAgIDxkaXYgY2xhc3M9XCJ0Yy1jb250YWluZXJcIj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3M9XCJ0Yy1hY3Rpb24tLWJ1dHRvbiB0Yy1hY3Rpb24tLWRlcGxveVwiXG4gICAgICAgIGFyaWEtbGFiZWw9XCJQZXJmb3JtIGEgZGVwbG95bWVudCB0byB0aGUgcHJvZHVjdGlvbiBicmFuY2guXCJcbiAgICAgID5EZXBsb3k8L2J1dHRvbj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3M9XCJ0Yy1hY3Rpb24tLWJ1dHRvbiB0Yy1hY3Rpb24tLWF1dGhvcml6ZVwiXG4gICAgICAgIGFyaWEtbGFiZWw9XCJBdXRob3JpemUgdHJhZmZpYy1jb250cm9sIHRvIGFjY2VzcyB5b3VyIEdpdGh1YiBhY2NvdW50LlwiXG4gICAgICA+QXV0aG9yaXplPC9idXR0b24+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzPVwidGMtYWN0aW9uLS1idXR0b24gdGMtYWN0aW9uLS1pbmZvXCJcbiAgICAgICAgYXJpYS1sYWJlbD1cIkZpbmQgb3V0IG1vcmUgaW5mb3JtYXRpb24uXCJcbiAgICAgID5Ib3c/PC9idXR0b24+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzPVwidGMtYWN0aW9uLS1idXR0b24gdGMtYWN0aW9uLS1va1wiXG4gICAgICAgIGFyaWEtbGFiZWw9XCJDbG9zZSBnaXQgaW5zdHJ1Y3Rpb25zXCJcbiAgICAgID5PazwvYnV0dG9uPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzcz1cInRjLWFjdGlvbi0tYnV0dG9uIHRjLWFjdGlvbi0tY29uZmxpY3RcIlxuICAgICAgICBhcmlhLWxhYmVsPVwiQ2xvc2UgbWVyZ2UgY29uZmxpY3QgbWVzc2FnZVwiXG4gICAgICA+T2s8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJ0Yy1jbG9zZVwiPlxuICAgIDxkaXYgY2xhc3M9XCJ0Yy1jb250YWluZXJcIj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3M9XCJ0Yy1jbG9zZS0tYnV0dG9uXCJcbiAgICAgICAgYXJpYS1sYWJlbD1cIkNsb3NlIHRyYWZmaWMtY29udHJvbCBkZXBsb3ltZW50IHVzZXIgaW50ZXJmYWNlLlwiXG4gICAgICA+JnRpbWVzOzwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuIiwiLypcbiAgTm90ZTogdGhlcmUgaXMgYSBsb3Qgb2YgcmVwZXRpdGlvbiBnb2luZyBvbiBpbiB0aGlzIENTUy5cbiAgVGhpcyBpcyBpbnRlbnRpb25hbCwgaW4gb3JkZXIgdG8ga2VlcCBzcGVjaWZpY2l0eSBsb3dcbiAgZW5vdWdoIHRoYXQgY3VzdG9tIHN0eWxlcyBhcmUgZWFzaWVyIHRvIGltcGxlbWVudC5cbiAqL1xuXG50cmFmZmljLWNvbnRyb2wge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG50cmFmZmljLWNvbnRyb2wgKixcbnRyYWZmaWMtY29udHJvbCAqOmJlZm9yZSxcbnRyYWZmaWMtY29udHJvbCAqOmFmdGVyIHtcbiAgYm94LXNpemluZzogaW5oZXJpdDtcbn1cblxudHJhZmZpYy1jb250cm9sIHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICBib3R0b206IDA7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICB6LWluZGV4OiAxMDAwMDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1jb250YWluZXIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYmFyIHtcbiAgZGlzcGxheTogbm9uZTtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgdGFibGUtbGF5b3V0OiBmaXhlZDtcbiAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XG4gIGJhY2tncm91bmQ6ICNlZWU7XG4gIGNvbG9yOiAjYWFhO1xuICB0cmFuc2l0aW9uOiBhbGwgLjJzIGVhc2U7XG4gIG1pbi1oZWlnaHQ6IDYwcHg7XG59XG5cbnRyYWZmaWMtY29udHJvbC5pcy1sb2FkaW5nIC50Yy1iYXIge1xuICBiYWNrZ3JvdW5kOiAjZWVlO1xuICBjb2xvcjogI2FhYTtcbn1cblxudHJhZmZpYy1jb250cm9sLmlzLWluc3RydWN0aW9uIC50Yy1iYXIge1xuICBiYWNrZ3JvdW5kOiAjMzMzO1xuICBjb2xvcjogI2ZmZjtcbn1cblxudHJhZmZpYy1jb250cm9sLmlzLXVuYXV0aG9yaXplZCAudGMtYmFyIHtcbiAgYmFja2dyb3VuZDogI0UwMkQyRDtcbiAgY29sb3I6ICNmZmY7XG59XG5cbnRyYWZmaWMtY29udHJvbC5pcy1jb25mbGljdCAudGMtYmFyIHtcbiAgYmFja2dyb3VuZDogI0UwMkQyRDtcbiAgY29sb3I6ICNmZmY7XG59XG5cbnRyYWZmaWMtY29udHJvbC5pcy1kaXZlcmdlZCAudGMtYmFyIHtcbiAgYmFja2dyb3VuZDogI0ZGQzcyRjtcbiAgY29sb3I6ICM3ODRFNEU7XG59XG5cbnRyYWZmaWMtY29udHJvbC5pcy1haGVhZCAudGMtYmFyIHtcbiAgYmFja2dyb3VuZDogI0I4RDVFOTtcbiAgY29sb3I6ICM1MDUwNTA7XG59XG5cbnRyYWZmaWMtY29udHJvbC5pcy1zeW5jaHJvbml6ZWQgLnRjLWJhciB7XG4gIGJhY2tncm91bmQ6ICNCQUU5Qjg7XG4gIGNvbG9yOiAjNTA1MDUwO1xufVxuXG50cmFmZmljLWNvbnRyb2wuaXMtc3VjY2VzcyAudGMtYmFyIHtcbiAgYmFja2dyb3VuZDogI0JBRTlCODtcbiAgY29sb3I6ICM1MDUwNTA7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYmFyLmlzLWVudGVyaW5nIHtcbiAgYW5pbWF0aW9uOiBzbGlkZUluVXAgLjZzIGVhc2UgYm90aDtcbiAgYW5pbWF0aW9uLWRlbGF5OiAuNnM7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYmFyLmlzLWxlYXZpbmcge1xuICBhbmltYXRpb246IHNsaWRlT3V0RG93biAuNnMgZWFzZSBib3RoO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2Uge1xuICBkaXNwbGF5OiB0YWJsZS1jZWxsO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYWN0aW9uIHtcbiAgZGlzcGxheTogdGFibGUtY2VsbDtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwcHg7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYWN0aW9uLS1idXR0b24ge1xuICBtYXJnaW46IDAgYXV0bztcbiAgd2lkdGg6IDgwJTtcbiAgcGFkZGluZzogOHB4IDA7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGNvbG9yOiAjZWVlO1xuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgYm9yZGVyOiAxcHggc29saWQ7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgb3V0bGluZTogbm9uZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB0cmFuc2l0aW9uOiAuNXMgZWFzZTtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLWJ1dHRvbjpob3ZlciB7XG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKTtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLWJ1dHRvbjphY3RpdmUge1xuICB0cmFuc2Zvcm06IHNjYWxlKDAuMik7XG59XG5cbnRyYWZmaWMtY29udHJvbC5pcy1kaXZlcmdlZCAudGMtYWN0aW9uLS1idXR0b24ge1xuICBjb2xvcjogI0JCODgwMDtcbn1cblxudHJhZmZpYy1jb250cm9sLmlzLWFoZWFkIC50Yy1hY3Rpb24tLWJ1dHRvbiB7XG4gIGNvbG9yOiAjNjc4QkEzO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLWNsb3NlIHtcbiAgZGlzcGxheTogdGFibGUtY2VsbDtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogNjBweDtcbiAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCAjZWVlO1xuICB0cmFuc2l0aW9uOiBhbGwgLjI1cyBlYXNlO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLWNsb3NlOmhvdmVyIHtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjEpO1xufVxuXG50cmFmZmljLWNvbnRyb2wuaXMtbG9hZGluZyAudGMtY2xvc2Uge1xuICBib3JkZXItY29sb3I6ICNjY2M7XG59XG5cbnRyYWZmaWMtY29udHJvbC5pcy1kaXZlcmdlZCAudGMtY2xvc2Uge1xuICBib3JkZXItY29sb3I6ICNGRkRBNzc7XG59XG5cbnRyYWZmaWMtY29udHJvbC5pcy1pbnN0cnVjdGlvbiAudGMtY2xvc2Uge1xuICBib3JkZXItY29sb3I6ICM4ODg7XG59XG5cbnRyYWZmaWMtY29udHJvbC5pcy11bmF1dGhvcml6ZWQgLnRjLWNsb3NlIHtcbiAgYm9yZGVyLWNvbG9yOiAjRUQ1MjUyO1xufVxuXG50cmFmZmljLWNvbnRyb2wuaXMtY29uZmxpY3QgLnRjLWNsb3NlIHtcbiAgYm9yZGVyLWNvbG9yOiAjRUQ1MjUyO1xufVxuXG50cmFmZmljLWNvbnRyb2wuaXMtYWhlYWQgLnRjLWNsb3NlIHtcbiAgYm9yZGVyLWNvbG9yOiAjQzRERUYwO1xufVxuXG50cmFmZmljLWNvbnRyb2wuaXMtc3luY2hyb25pemVkIC50Yy1jbG9zZSB7XG4gIGJvcmRlci1jb2xvcjogI0M2RjVDNDtcbn1cblxudHJhZmZpYy1jb250cm9sLmlzLXN1Y2Nlc3MgLnRjLWNsb3NlIHtcbiAgYm9yZGVyLWNvbG9yOiAjQzZGNUM0O1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLXRleHQge1xuICBmb250LXNpemU6IDE0cHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgcGFkZGluZzogMTZweDtcbiAgYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLXRleHQgYSB7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuXG50cmFmZmljLWNvbnRyb2wuaXMtZGl2ZXJnZWQgLnRjLW1lc3NhZ2UtLXRleHQgYSB7XG4gIGNvbG9yOiAjQkI4ODAwO1xufVxuXG50cmFmZmljLWNvbnRyb2wuaXMtYWhlYWQgLnRjLW1lc3NhZ2UtLXRleHQgYSB7XG4gIGNvbG9yOiAjNjc4QkEzO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLWxvYWRpbmcge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLWxvYWRpbmc6YWZ0ZXIge1xuICBtYXJnaW4tbGVmdDogLTJweDtcbiAgY29udGVudDogJyAnO1xuICBhbmltYXRpb246IGVsbGlwc2lzIDFzIGxpbmVhciBpbmZpbml0ZTtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1sb2FkaW5nLmlzLWVudGVyaW5nIHtcbiAgYW5pbWF0aW9uOiBzbGlkZUluVXAgLjZzIGN1YmljLWJlemllcigwLjE5LCAxLCAwLjIyLCAxKSBib3RoO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLWxvYWRpbmcuaXMtbGVhdmluZyB7XG4gIGFuaW1hdGlvbjogc2xpZGVPdXRVcCAuNnMgY3ViaWMtYmV6aWVyKDAuOTUsIDAuMDUsIDAuNzk1LCAwLjAzNSkgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1pbnN0cnVjdGlvbiB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2U7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0taW5zdHJ1Y3Rpb24uaXMtZW50ZXJpbmcge1xuICBhbmltYXRpb246IHNsaWRlSW5VcCAuNnMgY3ViaWMtYmV6aWVyKDAuMTksIDEsIDAuMjIsIDEpIGJvdGg7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0taW5zdHJ1Y3Rpb24uaXMtbGVhdmluZyB7XG4gIGFuaW1hdGlvbjogc2xpZGVPdXRVcCAuNnMgY3ViaWMtYmV6aWVyKDAuOTUsIDAuMDUsIDAuNzk1LCAwLjAzNSkgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1zeW5jaHJvbml6ZWQge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLXN5bmNocm9uaXplZC5pcy1lbnRlcmluZyB7XG4gIGFuaW1hdGlvbjogc2xpZGVJblVwIC42cyBjdWJpYy1iZXppZXIoMC4xOSwgMSwgMC4yMiwgMSkgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1zeW5jaHJvbml6ZWQuaXMtbGVhdmluZyB7XG4gIGFuaW1hdGlvbjogc2xpZGVPdXRVcCAuNnMgY3ViaWMtYmV6aWVyKDAuOTUsIDAuMDUsIDAuNzk1LCAwLjAzNSkgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1kaXZlcmdlZCB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0tZGl2ZXJnZWQuaXMtZW50ZXJpbmcge1xuICBhbmltYXRpb246IHNsaWRlSW5VcCAuNnMgY3ViaWMtYmV6aWVyKDAuMTksIDEsIDAuMjIsIDEpIGJvdGg7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0tZGl2ZXJnZWQuaXMtbGVhdmluZyB7XG4gIGFuaW1hdGlvbjogc2xpZGVPdXRVcCAuNnMgY3ViaWMtYmV6aWVyKDAuOTUsIDAuMDUsIDAuNzk1LCAwLjAzNSkgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS11bmF1dGhvcml6ZWQge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLXVuYXV0aG9yaXplZC5pcy1lbnRlcmluZyB7XG4gIGFuaW1hdGlvbjogc2xpZGVJblVwIC42cyBjdWJpYy1iZXppZXIoMC4xOSwgMSwgMC4yMiwgMSkgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS11bmF1dGhvcml6ZWQuaXMtbGVhdmluZyB7XG4gIGFuaW1hdGlvbjogc2xpZGVPdXRVcCAuNnMgY3ViaWMtYmV6aWVyKDAuOTUsIDAuMDUsIDAuNzk1LCAwLjAzNSkgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1jb25mbGljdCB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0tY29uZmxpY3QuaXMtZW50ZXJpbmcge1xuICBhbmltYXRpb246IHNsaWRlSW5VcCAuNnMgY3ViaWMtYmV6aWVyKDAuMTksIDEsIDAuMjIsIDEpIGJvdGg7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0tY29uZmxpY3QuaXMtbGVhdmluZyB7XG4gIGFuaW1hdGlvbjogc2xpZGVPdXRVcCAuNnMgY3ViaWMtYmV6aWVyKDAuOTUsIDAuMDUsIDAuNzk1LCAwLjAzNSkgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1zdWNjZXNzIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1zdWNjZXNzLmlzLWVudGVyaW5nIHtcbiAgYW5pbWF0aW9uOiBzbGlkZUluVXAgLjZzIGN1YmljLWJlemllcigwLjE5LCAxLCAwLjIyLCAxKSBib3RoO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLXN1Y2Nlc3MuaXMtbGVhdmluZyB7XG4gIGFuaW1hdGlvbjogc2xpZGVPdXRVcCAuNnMgY3ViaWMtYmV6aWVyKDAuOTUsIDAuMDUsIDAuNzk1LCAwLjAzNSkgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1haGVhZCB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0tYWhlYWQuaXMtZW50ZXJpbmcge1xuICBhbmltYXRpb246IHNsaWRlSW5VcCAuNnMgY3ViaWMtYmV6aWVyKDAuMTksIDEsIDAuMjIsIDEpIGJvdGg7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0tYWhlYWQuaXMtbGVhdmluZyB7XG4gIGFuaW1hdGlvbjogc2xpZGVPdXRVcCAuNnMgY3ViaWMtYmV6aWVyKDAuOTUsIDAuMDUsIDAuNzk1LCAwLjAzNSkgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLWRlcGxveSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYWN0aW9uLS1kZXBsb3kuaXMtZW50ZXJpbmcge1xuICBhbmltYXRpb246IHNsaWRlSW5VcCAuNnMgZWFzZSBib3RoO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLWFjdGlvbi0tZGVwbG95LmlzLWxlYXZpbmcge1xuICBhbmltYXRpb246IHNsaWRlT3V0VXAgLjZzIGVhc2UgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLW9rIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLW9rLmlzLWVudGVyaW5nIHtcbiAgYW5pbWF0aW9uOiBzbGlkZUluVXAgLjZzIGVhc2UgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLW9rLmlzLWxlYXZpbmcge1xuICBhbmltYXRpb246IHNsaWRlT3V0VXAgLjZzIGVhc2UgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLWluZm8ge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLWFjdGlvbi0taW5mby5pcy1lbnRlcmluZyB7XG4gIGFuaW1hdGlvbjogc2xpZGVJblVwIC42cyBlYXNlIGJvdGg7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYWN0aW9uLS1pbmZvLmlzLWxlYXZpbmcge1xuICBhbmltYXRpb246IHNsaWRlT3V0VXAgLjZzIGVhc2UgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLWF1dGhvcml6ZSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYWN0aW9uLS1hdXRob3JpemUuaXMtZW50ZXJpbmcge1xuICBhbmltYXRpb246IHNsaWRlSW5VcCAuNnMgZWFzZSBib3RoO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLWFjdGlvbi0tYXV0aG9yaXplLmlzLWxlYXZpbmcge1xuICBhbmltYXRpb246IHNsaWRlT3V0VXAgLjZzIGVhc2UgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLWNvbmZsaWN0IHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLWNvbmZsaWN0LmlzLWVudGVyaW5nIHtcbiAgYW5pbWF0aW9uOiBzbGlkZUluVXAgLjZzIGVhc2UgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLWNvbmZsaWN0LmlzLWxlYXZpbmcge1xuICBhbmltYXRpb246IHNsaWRlT3V0VXAgLjZzIGVhc2UgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLXN1Y2Nlc3Mge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLWFjdGlvbi0tc3VjY2Vzcy5pcy1lbnRlcmluZyB7XG4gIGFuaW1hdGlvbjogc2xpZGVJblVwIC42cyBlYXNlIGJvdGg7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYWN0aW9uLS1zdWNjZXNzLmlzLWxlYXZpbmcge1xuICBhbmltYXRpb246IHNsaWRlT3V0VXAgLjZzIGVhc2UgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1jbG9zZS0tYnV0dG9uIHtcbiAgZGlzcGxheTogbm9uZTtcbiAgbWFyZ2luOiAwIGF1dG87XG4gIHBhZGRpbmc6IDE2cHg7XG4gIHdpZHRoOiAxMDAlO1xuICBib3JkZXI6IG5vbmU7XG4gIG91dGxpbmU6IG5vbmU7XG4gIGJhY2tncm91bmQ6IG5vbmU7XG4gIGNvbG9yOiAjZWVlO1xuICBmb250LXNpemU6IDI0cHg7XG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgc2Fucy1zZXJpZjtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBoZWlnaHQ6IDEwMCU7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdHJhbnNpdGlvbjogYWxsIC4ycyBlYXNlO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbnRyYWZmaWMtY29udHJvbC5pcy1sb2FkaW5nIC50Yy1jbG9zZS0tYnV0dG9uIHtcbiAgY29sb3I6ICNjY2M7XG59XG5cbnRyYWZmaWMtY29udHJvbC5pcy1kaXZlcmdlZCAudGMtY2xvc2UtLWJ1dHRvbiB7XG4gIGNvbG9yOiAjRkZEQTc3O1xufVxuXG50cmFmZmljLWNvbnRyb2wuaXMtaW5zdHJ1Y3Rpb24gLnRjLWNsb3NlLS1idXR0b24ge1xuICBjb2xvcjogIzg4ODtcbn1cblxudHJhZmZpYy1jb250cm9sLmlzLXVuYXV0aG9yaXplZCAudGMtY2xvc2UtLWJ1dHRvbiB7XG4gIGNvbG9yOiAjRUQ1MjUyO1xufVxuXG50cmFmZmljLWNvbnRyb2wuaXMtY29uZmxpY3QgLnRjLWNsb3NlLS1idXR0b24ge1xuICBjb2xvcjogI0VENTI1Mjtcbn1cblxudHJhZmZpYy1jb250cm9sLmlzLWFoZWFkIC50Yy1jbG9zZS0tYnV0dG9uIHtcbiAgY29sb3I6ICNDNERFRjA7XG59XG5cbnRyYWZmaWMtY29udHJvbC5pcy1zeW5jaHJvbml6ZWQgLnRjLWNsb3NlLS1idXR0b24ge1xuICBjb2xvcjogI0M2RjVDNDtcbn1cblxudHJhZmZpYy1jb250cm9sLmlzLXN1Y2Nlc3MgLnRjLWNsb3NlLS1idXR0b24ge1xuICBjb2xvcjogI0M2RjVDNDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1jbG9zZS0tYnV0dG9uLmlzLWVudGVyaW5nIHtcbiAgYW5pbWF0aW9uOiBzbGlkZUluVXAgLjZzIGN1YmljLWJlemllcigwLjE5LCAxLCAwLjIyLCAxKSBib3RoO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLWNsb3NlLS1idXR0b24uaXMtbGVhdmluZyB7XG4gIGFuaW1hdGlvbjogc2xpZGVPdXRVcCAuNnMgY3ViaWMtYmV6aWVyKDAuOTUsIDAuMDUsIDAuNzk1LCAwLjAzNSkgYm90aDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1iYXIuaXMtYWN0aXZlIHtcbiAgZGlzcGxheTogdGFibGU7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0tbG9hZGluZy5pcy1hY3RpdmUge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1zeW5jaHJvbml6ZWQuaXMtYWN0aXZlIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0tZGl2ZXJnZWQuaXMtYWN0aXZlIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0tdW5hdXRob3JpemVkLmlzLWFjdGl2ZSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLWNvbmZsaWN0LmlzLWFjdGl2ZSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLXN1Y2Nlc3MuaXMtYWN0aXZlIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0taW5zdHJ1Y3Rpb24uaXMtYWN0aXZlIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0tYWhlYWQuaXMtYWN0aXZlIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYWN0aW9uLS1kZXBsb3kuaXMtYWN0aXZlIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYWN0aW9uLS1vay5pcy1hY3RpdmUge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLWNvbmZsaWN0LmlzLWFjdGl2ZSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLWFjdGlvbi0tc3VjY2Vzcy5pcy1hY3RpdmUge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLWluZm8uaXMtYWN0aXZlIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYWN0aW9uLS1hdXRob3JpemUuaXMtYWN0aXZlIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtY2xvc2UtLWJ1dHRvbi5pcy1hY3RpdmUge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuQGtleWZyYW1lcyBzbGlkZUluVXAge1xuICAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDEwMCUpO1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cbn1cblxuQGtleWZyYW1lcyBzbGlkZU91dFVwIHtcbiAgMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgICBvcGFjaXR5OiAxO1xuICB9XG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMTAwJSk7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIHNsaWRlT3V0RG93biB7XG4gIDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMTAwJSk7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIGVsbGlwc2lzIHtcbiAgMCUge1xuICAgIGNvbnRlbnQ6ICcgJ1xuICB9XG4gIDMzJSB7XG4gICAgY29udGVudDogJy4nXG4gIH1cbiAgNjYlIHtcbiAgICBjb250ZW50OiAnLi4nXG4gIH1cbiAgOTklIHtcbiAgICBjb250ZW50OiAnLi4uJ1xuICB9XG59XG4iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBBZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIGFuIGVsZW1lbnRcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbCAgICAgICAgLSB0aGUgZWxlbWVudCB0byBhZGQgdGhlIGxpc3RlbmVyIG9uXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgZXZlbnROYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGV2ZW50XG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICAgZnVuYyAgICAgIC0gdGhlIGxpc3RlbmVyIHRvIGFkZFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvbiAoZWwsIGV2ZW50TmFtZSwgZnVuYykge1xuICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZnVuYywgZmFsc2UpXG59XG4iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBBZGRzIENTUyB0byB0aGUgcGFnZVxuICogQHBhcmFtIHtTdHJpbmd9IGNzcyAtIGEgYmxvY2sgb2YgQ1NTXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZENTUyAoY3NzKSB7XG4gIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuICBjb25zdCBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdXG4gIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzXG4gIH0gZWxzZSB7XG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSlcbiAgfVxuICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiBhbiBlbGVtZW50IGhhcyBhIGNsYXNzbmFtZS5cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgZWwgICAgICAgICAgICAtIHRoZSBlbGVtZW50IHRvIGNoZWNrXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgIC4uLmNsYXNzTmFtZXMgLSBhbiBhcmd1bWVudCBsaXN0IG9mIGNsYXNzbmFtZXNcbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgICAgICAgICAtIHRydWUgaWYgZWxlbWVudCBoYXMgY2xhc3NcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaGFzQ2xhc3MgKGVsLCAuLi5jbGFzc05hbWVzKSB7XG4gIHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoLi4uY2xhc3NOYW1lcylcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIGFkZHMgYSBsaXN0IG9mIGNsYXNzbmFtZXMgdG8gYW4gaHRtbCBlbGVtZW50XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAgICAgICAgICAgIC0gdGhlIGVsZW1lbnQgdG8gYWRkIHRoZSBjbGFzc25hbWVzIHRvXG4gKiBAcGFyYW0ge1N0cmluZ30gICAgICAuLi5jbGFzc05hbWVzIC0gYW4gYXJndW1lbnQgbGlzdCBvZiBjbGFzc25hbWVzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZENsYXNzIChlbCwgLi4uY2xhc3NOYW1lcykge1xuICBlbC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzTmFtZXMpXG59XG4iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiByZW1vdmVzIGEgbGlzdCBvZiBjbGFzc25hbWVzIGZyb20gYW4gaHRtbCBlbGVtZW50XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAgICAgICAgICAgIC0gdGhlIGVsZW1lbnQgdG8gcmVtb3ZlIHRoZSBjbGFzc25hbWVzIGZyb21cbiAqIEBwYXJhbSB7U3RyaW5nfSAgICAgIC4uLmNsYXNzTmFtZXMgLSBhbiBhcmd1bWVudCBsaXN0IG9mIGNsYXNzbmFtZXNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVtb3ZlQ2xhc3MgKGVsLCAuLi5jbGFzc05hbWVzKSB7XG4gIGVsLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2xhc3NOYW1lcylcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIGZldGNoZXMgYW4gdW5jYWNoZWQgSlNPTiByZXNwb25zZVxuICogQHBhcmFtICB7U3RyaW5nfSB1cmwgLSB0aGUgVVJMIHRvIGdyYWIganNvbiBmcm9tXG4gKiBAcmV0dXJuIHtQcm9taXNlfSAgICAtIGEgcHJvbWlzZSBmb3IgdGhlIGpzb24gZGF0YVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAodXJsKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgd2luZG93LmZldGNoKHVybCwge1xuICAgICAgY2FjaGU6ICduby1jYWNoZSdcbiAgICB9KVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5va1xuICAgICAgICAgID8gcmVzcG9uc2VcbiAgICAgICAgICA6IFByb21pc2UucmVqZWN0KHJlc3BvbnNlLnN0YXR1c1RleHQpXG4gICAgICApXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAuY2F0Y2gocmVqZWN0KVxuICB9KVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogUG9zdHMgSlNPTiB0byBhbiBlbmRwb2ludCwgZG9lcyBub3QgY2FjaGUgcmVzcG9uc2VzXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHVybCAgLSB0aGUgVVJMIHRvIFBPU1QgdG9cbiAqIEBwYXJhbSAge09iamVjdH0ganNvbiAtIHRoZSB1bnNlcmlhbGl6ZWQgZGF0YSB0byBQT1NUXG4gKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgLSBhIHByb21pc2UgZm9yIHRoZSByZXNwb25zZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAodXJsLCBqc29uKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgd2luZG93LmZldGNoKHVybCwge1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShqc29uKSxcbiAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9XG4gICAgfSlcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2Uub2tcbiAgICAgICAgICA/IHJlc3BvbnNlXG4gICAgICAgICAgOiBQcm9taXNlLnJlamVjdChyZXNwb25zZS5zdGF0dXNUZXh0KVxuICAgICAgKVxuICAgICAgLnRoZW4ocmVzb2x2ZSlcbiAgICAgIC5jYXRjaChyZWplY3QpXG4gIH0pXG59XG4iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBOb3JtYWxpemVzIGBhbmltYXRpb25lbmRgIGV2ZW50IGFjY3Jvc3MgZGlmZmVyZW50IGJyb3dzZXJzLlxuICogQHJldHVybiB7U3RyaW5nfSAtIHRoZSBldmVudCBuYW1lIGZvciB0aGVjdXJyZW50IHZlbmRvclxuICovXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zha2VlbGVtZW50JylcbiAgY29uc3QgYW5pbWF0aW9ucyA9IHtcbiAgICAnYW5pbWF0aW9uJzogJ2FuaW1hdGlvbmVuZCcsXG4gICAgJ09BbmltYXRpb24nOiAnb2FuaW1hdGlvbmVuZCcsXG4gICAgJ01vekFuaW1hdGlvbic6ICdhbmltYXRpb25lbmQnLFxuICAgICdXZWJraXRBbmltYXRpb24nOiAnd2Via2l0QW5pbWF0aW9uRW5kJyxcbiAgICAnTVNBbmltYXRpb24nOiAnTVNBbmltYXRpb25FbmQnXG4gIH1cbiAgZm9yIChsZXQgdCBpbiBhbmltYXRpb25zKSB7XG4gICAgaWYgKCFlbC5zdHlsZVt0XSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gYW5pbWF0aW9uc1t0XVxuICAgIH1cbiAgfVxufSkoKVxuIiwiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogUmVtb3ZlcyBhbiBldmVudCBsaXN0ZW5lci5cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbCAgICAgICAgLSB0aGUgZWxlbWVudCB0byByZW1vdmUgdGhlIGV2ZW50IGxpc3RlbmVyIGZyb21cbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICBldmVudE5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZXZlbnRcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgICBmdW5jICAgICAgLSB0aGUgbGlzdGVuZXIgdG8gcmVtb3ZlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9mZiAoZWwsIGV2ZW50TmFtZSwgZnVuYykge1xuICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZnVuYylcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgb24gZnJvbSAnLi9vbidcbmltcG9ydCBvZmYgZnJvbSAnLi9vZmYnXG5cbi8qKlxuICogQWRkcyBhIG9uZS10aW1lLW9ubHkgZXZlbnQgbGlzdGVuZXIgdG8gYW4gZWxlbWVudFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgICAgICAgIC0gdGhlIGVsZW1lbnQgdG8gYWRkIHRoZSBsaXN0ZW5lciB0b1xuICogQHBhcmFtIHtTdHJpbmd9ICAgICAgZXZlbnROYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICBmdW5jICAgICAgLSB0aGUgbGlzdGVuZXIgdG8gYWRkXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9uY2UgKGVsLCBldmVudE5hbWUsIGZ1bmMpIHtcbiAgY29uc3QgY2IgPSAoLi4uYXJncykgPT4ge1xuICAgIGZ1bmMoLi4uYXJncylcbiAgICBvZmYoZWwsIGV2ZW50TmFtZSwgY2IpXG4gIH1cbiAgb24oZWwsIGV2ZW50TmFtZSwgY2IpXG59XG4iLCIndXNlIHN0cmljdCdcblxuaW1wb3J0IGFkZENsYXNzIGZyb20gJy4vYWRkQ2xhc3MnXG5cbi8qKlxuICogQWRkcyBjbGFzc2VzIHRvIGFuIGh0bWwgZWxlbWVudCBvbmUgYnkgb25lXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAgICAgICAgICAgIC0gdGhlIGVsZW1lbnQgdG8gYWRkIHRoZSBjbGFzc2VzIHRvXG4gKiBAcGFyYW0ge1N0cmluZ30gICAgICAuLi5jbGFzc05hbWVzIC0gYW4gYXJndW1lbnQgbGlzdCBvZiBjbGFzcyBuYW1lc1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRDbGFzc2VzSW5TZXF1ZW5jZSAoZWwsIC4uLmNsYXNzTmFtZXMpIHtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNsYXNzTmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBhZGRDbGFzcyhlbCwgY2xhc3NOYW1lc1tpXSlcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCByZW1vdmVDbGFzcyBmcm9tICcuL3JlbW92ZUNsYXNzJ1xuXG4vKipcbiAqIFJlbW92ZXMgY2xhc3NlcyBmcm9tIGFuIGh0bWwgZWxlbWVudCBvbmUgYnkgb25lXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAgICAgICAgICAgIC0gdGhlIGVsZW1lbnQgdG8gcmVtb3ZlIHRoZSBjbGFzc2VzIGZyb21cbiAqIEBwYXJhbSB7U3RyaW5nfSAgICAgIC4uLmNsYXNzTmFtZXMgLSBhbiBhcmd1bWVudCBsaXN0IG9mIGNsYXNzIG5hbWVzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlbW92ZUNsYXNzZXNJblNlcXVlbmNlIChlbCwgLi4uY2xhc3NOYW1lcykge1xuICBmb3IgKGxldCBpID0gMCwgbGVuID0gY2xhc3NOYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHJlbW92ZUNsYXNzKGVsLCBjbGFzc05hbWVzW2ldKVxuICB9XG59XG4iLCJ2YXIgYmFiZWxIZWxwZXJzID0ge307XG5leHBvcnQgdmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmo7XG59IDogZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xufTtcblxuZXhwb3J0IHZhciBqc3ggPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLmZvciAmJiBTeW1ib2wuZm9yKFwicmVhY3QuZWxlbWVudFwiKSB8fCAweGVhYzc7XG4gIHJldHVybiBmdW5jdGlvbiBjcmVhdGVSYXdSZWFjdEVsZW1lbnQodHlwZSwgcHJvcHMsIGtleSwgY2hpbGRyZW4pIHtcbiAgICB2YXIgZGVmYXVsdFByb3BzID0gdHlwZSAmJiB0eXBlLmRlZmF1bHRQcm9wcztcbiAgICB2YXIgY2hpbGRyZW5MZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoIC0gMztcblxuICAgIGlmICghcHJvcHMgJiYgY2hpbGRyZW5MZW5ndGggIT09IDApIHtcbiAgICAgIHByb3BzID0ge307XG4gICAgfVxuXG4gICAgaWYgKHByb3BzICYmIGRlZmF1bHRQcm9wcykge1xuICAgICAgZm9yICh2YXIgcHJvcE5hbWUgaW4gZGVmYXVsdFByb3BzKSB7XG4gICAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT09IHZvaWQgMCkge1xuICAgICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGRlZmF1bHRQcm9wc1twcm9wTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFwcm9wcykge1xuICAgICAgcHJvcHMgPSBkZWZhdWx0UHJvcHMgfHwge307XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkcmVuTGVuZ3RoID09PSAxKSB7XG4gICAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgIH0gZWxzZSBpZiAoY2hpbGRyZW5MZW5ndGggPiAxKSB7XG4gICAgICB2YXIgY2hpbGRBcnJheSA9IEFycmF5KGNoaWxkcmVuTGVuZ3RoKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNoaWxkQXJyYXlbaV0gPSBhcmd1bWVudHNbaSArIDNdO1xuICAgICAgfVxuXG4gICAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkQXJyYXk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICQkdHlwZW9mOiBSRUFDVF9FTEVNRU5UX1RZUEUsXG4gICAgICB0eXBlOiB0eXBlLFxuICAgICAga2V5OiBrZXkgPT09IHVuZGVmaW5lZCA/IG51bGwgOiAnJyArIGtleSxcbiAgICAgIHJlZjogbnVsbCxcbiAgICAgIHByb3BzOiBwcm9wcyxcbiAgICAgIF9vd25lcjogbnVsbFxuICAgIH07XG4gIH07XG59KCk7XG5cbmV4cG9ydCB2YXIgYXN5bmNUb0dlbmVyYXRvciA9IGZ1bmN0aW9uIChmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBnZW4gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBmdW5jdGlvbiBzdGVwKGtleSwgYXJnKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIGluZm8gPSBnZW5ba2V5XShhcmcpO1xuICAgICAgICAgIHZhciB2YWx1ZSA9IGluZm8udmFsdWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGVwKFwibmV4dFwiLCB2YWx1ZSk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ZXAoXCJ0aHJvd1wiLCBlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdGVwKFwibmV4dFwiKTtcbiAgICB9KTtcbiAgfTtcbn07XG5cbmV4cG9ydCB2YXIgY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTtcblxuZXhwb3J0IHZhciBjcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgfTtcbn0oKTtcblxuZXhwb3J0IHZhciBkZWZpbmVFbnVtZXJhYmxlUHJvcGVydGllcyA9IGZ1bmN0aW9uIChvYmosIGRlc2NzKSB7XG4gIGZvciAodmFyIGtleSBpbiBkZXNjcykge1xuICAgIHZhciBkZXNjID0gZGVzY3Nba2V5XTtcbiAgICBkZXNjLmNvbmZpZ3VyYWJsZSA9IGRlc2MuZW51bWVyYWJsZSA9IHRydWU7XG4gICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjKSBkZXNjLndyaXRhYmxlID0gdHJ1ZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIGRlc2MpO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cbmV4cG9ydCB2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbiAob2JqLCBkZWZhdWx0cykge1xuICB2YXIga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGRlZmF1bHRzKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICB2YXIgdmFsdWUgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGRlZmF1bHRzLCBrZXkpO1xuXG4gICAgaWYgKHZhbHVlICYmIHZhbHVlLmNvbmZpZ3VyYWJsZSAmJiBvYmpba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxuZXhwb3J0IHZhciBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIChvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxuZXhwb3J0IHZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59O1xuXG5leHBvcnQgdmFyIGdldCA9IGZ1bmN0aW9uIGdldChvYmplY3QsIHByb3BlcnR5LCByZWNlaXZlcikge1xuICBpZiAob2JqZWN0ID09PSBudWxsKSBvYmplY3QgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4gIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTtcblxuICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuXG4gICAgaWYgKHBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGdldChwYXJlbnQsIHByb3BlcnR5LCByZWNlaXZlcik7XG4gICAgfVxuICB9IGVsc2UgaWYgKFwidmFsdWVcIiBpbiBkZXNjKSB7XG4gICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGdldHRlciA9IGRlc2MuZ2V0O1xuXG4gICAgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7XG4gIH1cbn07XG5cbmV4cG9ydCB2YXIgaW5oZXJpdHMgPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59O1xuXG5leHBvcnQgdmFyIF9pbnN0YW5jZW9mID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7XG4gIGlmIChyaWdodCAhPSBudWxsICYmIHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgcmlnaHRbU3ltYm9sLmhhc0luc3RhbmNlXSkge1xuICAgIHJldHVybiByaWdodFtTeW1ib2wuaGFzSW5zdGFuY2VdKGxlZnQpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBsZWZ0IGluc3RhbmNlb2YgcmlnaHQ7XG4gIH1cbn07XG5cbmV4cG9ydCB2YXIgaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDoge1xuICAgIGRlZmF1bHQ6IG9ialxuICB9O1xufTtcblxuZXhwb3J0IHZhciBpbnRlcm9wUmVxdWlyZVdpbGRjYXJkID0gZnVuY3Rpb24gKG9iaikge1xuICBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbmV3T2JqID0ge307XG5cbiAgICBpZiAob2JqICE9IG51bGwpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmV3T2JqLmRlZmF1bHQgPSBvYmo7XG4gICAgcmV0dXJuIG5ld09iajtcbiAgfVxufTtcblxuZXhwb3J0IHZhciBuZXdBcnJvd0NoZWNrID0gZnVuY3Rpb24gKGlubmVyVGhpcywgYm91bmRUaGlzKSB7XG4gIGlmIChpbm5lclRoaXMgIT09IGJvdW5kVGhpcykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgaW5zdGFudGlhdGUgYW4gYXJyb3cgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cbmV4cG9ydCB2YXIgb2JqZWN0RGVzdHJ1Y3R1cmluZ0VtcHR5ID0gZnVuY3Rpb24gKG9iaikge1xuICBpZiAob2JqID09IG51bGwpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgZGVzdHJ1Y3R1cmUgdW5kZWZpbmVkXCIpO1xufTtcblxuZXhwb3J0IHZhciBvYmplY3RXaXRob3V0UHJvcGVydGllcyA9IGZ1bmN0aW9uIChvYmosIGtleXMpIHtcbiAgdmFyIHRhcmdldCA9IHt9O1xuXG4gIGZvciAodmFyIGkgaW4gb2JqKSB7XG4gICAgaWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBjb250aW51ZTtcbiAgICB0YXJnZXRbaV0gPSBvYmpbaV07XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufTtcblxuZXhwb3J0IHZhciBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuID0gZnVuY3Rpb24gKHNlbGYsIGNhbGwpIHtcbiAgaWYgKCFzZWxmKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7XG59O1xuXG5leHBvcnQgdmFyIHNlbGZHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IGdsb2JhbDtcblxuZXhwb3J0IHZhciBzZXQgPSBmdW5jdGlvbiBzZXQob2JqZWN0LCBwcm9wZXJ0eSwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTtcblxuICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuXG4gICAgaWYgKHBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgc2V0KHBhcmVudCwgcHJvcGVydHksIHZhbHVlLCByZWNlaXZlcik7XG4gICAgfVxuICB9IGVsc2UgaWYgKFwidmFsdWVcIiBpbiBkZXNjICYmIGRlc2Mud3JpdGFibGUpIHtcbiAgICBkZXNjLnZhbHVlID0gdmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHNldHRlciA9IGRlc2Muc2V0O1xuXG4gICAgaWYgKHNldHRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzZXR0ZXIuY2FsbChyZWNlaXZlciwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbmV4cG9ydCB2YXIgc2xpY2VkVG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gc2xpY2VJdGVyYXRvcihhcnIsIGkpIHtcbiAgICB2YXIgX2FyciA9IFtdO1xuICAgIHZhciBfbiA9IHRydWU7XG4gICAgdmFyIF9kID0gZmFsc2U7XG4gICAgdmFyIF9lID0gdW5kZWZpbmVkO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9pID0gYXJyW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHtcbiAgICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgICBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBfZCA9IHRydWU7XG4gICAgICBfZSA9IGVycjtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSkgX2lbXCJyZXR1cm5cIl0oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIF9hcnI7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKGFyciwgaSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgIHJldHVybiBhcnI7XG4gICAgfSBlbHNlIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGFycikpIHtcbiAgICAgIHJldHVybiBzbGljZUl0ZXJhdG9yKGFyciwgaSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpO1xuICAgIH1cbiAgfTtcbn0oKTtcblxuZXhwb3J0IHZhciBzbGljZWRUb0FycmF5TG9vc2UgPSBmdW5jdGlvbiAoYXJyLCBpKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICByZXR1cm4gYXJyO1xuICB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkge1xuICAgIHZhciBfYXJyID0gW107XG5cbiAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDsgIShfc3RlcCA9IF9pdGVyYXRvci5uZXh0KCkpLmRvbmU7KSB7XG4gICAgICBfYXJyLnB1c2goX3N0ZXAudmFsdWUpO1xuXG4gICAgICBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIF9hcnI7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIik7XG4gIH1cbn07XG5cbmV4cG9ydCB2YXIgdGFnZ2VkVGVtcGxhdGVMaXRlcmFsID0gZnVuY3Rpb24gKHN0cmluZ3MsIHJhdykge1xuICByZXR1cm4gT2JqZWN0LmZyZWV6ZShPYmplY3QuZGVmaW5lUHJvcGVydGllcyhzdHJpbmdzLCB7XG4gICAgcmF3OiB7XG4gICAgICB2YWx1ZTogT2JqZWN0LmZyZWV6ZShyYXcpXG4gICAgfVxuICB9KSk7XG59O1xuXG5leHBvcnQgdmFyIHRhZ2dlZFRlbXBsYXRlTGl0ZXJhbExvb3NlID0gZnVuY3Rpb24gKHN0cmluZ3MsIHJhdykge1xuICBzdHJpbmdzLnJhdyA9IHJhdztcbiAgcmV0dXJuIHN0cmluZ3M7XG59O1xuXG5leHBvcnQgdmFyIHRlbXBvcmFsUmVmID0gZnVuY3Rpb24gKHZhbCwgbmFtZSwgdW5kZWYpIHtcbiAgaWYgKHZhbCA9PT0gdW5kZWYpIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IobmFtZSArIFwiIGlzIG5vdCBkZWZpbmVkIC0gdGVtcG9yYWwgZGVhZCB6b25lXCIpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWw7XG4gIH1cbn07XG5cbmV4cG9ydCB2YXIgdGVtcG9yYWxVbmRlZmluZWQgPSB7fTtcblxuZXhwb3J0IHZhciB0b0FycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcnIpID8gYXJyIDogQXJyYXkuZnJvbShhcnIpO1xufTtcblxuZXhwb3J0IHZhciB0b0NvbnN1bWFibGVBcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIGFycjJbaV0gPSBhcnJbaV07XG5cbiAgICByZXR1cm4gYXJyMjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShhcnIpO1xuICB9XG59O1xuXG5iYWJlbEhlbHBlcnM7XG5cbmV4cG9ydCB7IF90eXBlb2YgYXMgdHlwZW9mLCBfZXh0ZW5kcyBhcyBleHRlbmRzLCBfaW5zdGFuY2VvZiBhcyBpbnN0YW5jZW9mIH0iLCIndXNlIHN0cmljdCdcblxuaW1wb3J0IGFuaW1hdGlvbkVuZCBmcm9tICcuL2FuaW1hdGlvbkVuZCdcbmltcG9ydCBvbmNlIGZyb20gJy4vb25jZSdcbmltcG9ydCBhZGRDbGFzcyBmcm9tICcuL2FkZENsYXNzJ1xuaW1wb3J0IHJlbW92ZUNsYXNzIGZyb20gJy4vcmVtb3ZlQ2xhc3MnXG5pbXBvcnQgYWRkQ2xhc3Nlc0luU2VxdWVuY2UgZnJvbSAnLi9hZGRDbGFzc2VzSW5TZXF1ZW5jZSdcbmltcG9ydCByZW1vdmVDbGFzc2VzSW5TZXF1ZW5jZSBmcm9tICcuL3JlbW92ZUNsYXNzZXNJblNlcXVlbmNlJ1xuXG4vKipcbiAqIEBjbGFzcyBBbmltYXRpb25FbmdpbmVcbiAqIEBjbGFzc2Rlc2MgYSB0aW55IGZha2UgYW5pbWF0aW9uIGVuZ2luZSB0aGF0IHdvcmtzIGJ5IHNldHRpbmcgZW50ZXIgJiBsZWF2ZSBjbGFzc2VzIHRoYXQgdHJpZ2dlciBAa2V5ZnJhbWUgYW5pbWF0aW9uc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmltYXRpb25FbmdpbmUge1xuICAvKipcbiAgICogQGNvbnN0cnVjdHMgQW5pbWF0aW9uRW5naW5lXG4gICAqIEBwYXJhbSAge09iamVjdH0gb3B0cyAgICAgICAgICAgICAtIHNldHRpbmdzIGZvciBhbmltYXRpb25zXG4gICAqIEBwYXJhbSAge1N0cmluZ30gb3B0cy5lbnRlckNsYXNzICAtIHRoZSBjbGFzcyB0byBhZGQgd2hlbiBhbmltYXRpbmcgZWxlbWVudCBpcyBlbnRlcmluZ1xuICAgKiBAcGFyYW0gIHtTdHJpbmd9IG9wdHMubGVhdmVDbGFzcyAgLSB0aGUgY2xhc3MgdG8gYWRkIHdoZW4gYW5pbWF0aW5nIGVsZW1lbnQgaXMgbGVhdmluZ1xuICAgKiBAcGFyYW0gIHtTdHJpbmd9IG9wdHMuYWN0aXZlQ2xhc3MgLSB0aGUgY2xhc3MgdG8gYWRkIHdoZW4gYW5pbWF0ZWQgZWxlbWVudCBpcyBhY3RpdmVcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgIC0gYW4gaW5zdGFuY2Ugb2YgdGhlIGFuaW1hdGlvbiBlbmdpbmVcbiAgICovXG4gIGNvbnN0cnVjdG9yIChvcHRzID0ge30pIHtcbiAgICB0aGlzLm9wdHMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGVudGVyQ2xhc3M6ICdpcy1lbnRlcmluZycsXG4gICAgICBhY3RpdmVDbGFzczogJ2lzLWFjdGl2ZScsXG4gICAgICBsZWF2ZUNsYXNzOiAnaXMtbGVhdmluZydcbiAgICB9LCBvcHRzKVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgY2xhc3MgdGhhdCB0cmlnZ2VycyBlbnRlciBhbmltYXRpb24gZm9yIGFueSBudW1iZXIgb2YgZWxlbWVudHMuXG4gICAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAuLi5lbHMgLSBhbiBhcmd1bWVudCBsaXN0IG9mIGVsZW1lbnRzXG4gICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgLSBhIHByb21pc2UgZm9yIHRoZSBjb21wbGV0ZWQgYW5pbWF0aW9uXG4gICAqL1xuICBhbmltYXRlSW4gKC4uLmVscykge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChlbHMubWFwKChlbCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIG9uY2UoZWwsIGFuaW1hdGlvbkVuZCwgcmVzb2x2ZSlcbiAgICAgIGFkZENsYXNzZXNJblNlcXVlbmNlKGVsLCB0aGlzLm9wdHMuYWN0aXZlQ2xhc3MsIHRoaXMub3B0cy5lbnRlckNsYXNzKVxuICAgIH0pKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGNsYXNzIHRoYXQgdHJpZ2dlcnMgbGVhdmUgYW5pbWF0aW9uIGZvciBhbnkgbnVtYmVyIG9mIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gLi4uZWxzIC0gYW4gYXJndW1lbnQgbGlzdCBvZiBlbGVtZW50c1xuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgIC0gYSBwcm9taXNlIGZvciB0aGUgY29tcGxldGVkIGFuaW1hdGlvblxuICAgKi9cbiAgYW5pbWF0ZU91dCAoLi4uZWxzKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKGVscy5tYXAoKGVsKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgb25jZShlbCwgYW5pbWF0aW9uRW5kLCAoKSA9PiB7XG4gICAgICAgIHJlbW92ZUNsYXNzZXNJblNlcXVlbmNlKGVsLCB0aGlzLm9wdHMubGVhdmVDbGFzcywgdGhpcy5vcHRzLmFjdGl2ZUNsYXNzKVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH0pXG4gICAgICByZW1vdmVDbGFzcyhlbCwgdGhpcy5vcHRzLmVudGVyQ2xhc3MpXG4gICAgICBhZGRDbGFzcyhlbCwgdGhpcy5vcHRzLmxlYXZlQ2xhc3MpXG4gICAgfSkpKVxuICB9XG59XG4iLCIndXNlIHN0cmljdCdcblxuLyogY29tcG9uZW50IEhUTUwgJiBjc3MgKi9cbmltcG9ydCBpbml0aWFsTWFya3VwIGZyb20gJy4vdGVtcGxhdGUuaHRtbCdcbmltcG9ydCBzdHlsZXMgZnJvbSAnLi9zdHlsZXMuY3NzJ1xuXG4vKiBtb2R1bGVzICovXG5pbXBvcnQgb24gZnJvbSAnLi9vbidcbmltcG9ydCBhZGRDU1MgZnJvbSAnLi9hZGRDU1MnXG5pbXBvcnQgaGFzQ2xhc3MgZnJvbSAnLi9oYXNDbGFzcydcbmltcG9ydCBhZGRDbGFzcyBmcm9tICcuL2FkZENsYXNzJ1xuaW1wb3J0IHJlbW92ZUNsYXNzIGZyb20gJy4vcmVtb3ZlQ2xhc3MnXG5pbXBvcnQgZ2V0SlNPTiBmcm9tICcuL2dldEpTT04nXG5pbXBvcnQgcG9zdEpTT04gZnJvbSAnLi9wb3N0SlNPTidcbmltcG9ydCBBbmltYXRpb25FbmdpbmUgZnJvbSAnLi9hbmltYXRpb24tZW5naW5lJ1xuXG5jb25zdCBhbmltYXRvciA9IG5ldyBBbmltYXRpb25FbmdpbmUoKVxuY29uc3QgbmV0bGlmeSA9IHdpbmRvdy5uZXRsaWZ5XG5jb25zdCBsb2NhbFN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlXG5cbi8qKlxuICogQGNsYXNzIFRyYWZmaWNDb250cm9sXG4gKiBAY2xhc3NkZXNjIGFkZHMgYSBiYXIgdG8gYSB3ZWJzaXRlIHRoYXQgYWxsb3dzIG9uZS1jbGljayBkZXBsb3lzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWZmaWNDb250cm9sIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzIFRyYWZmaWNDb250cm9sXG4gICAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRzID0ge30gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gU2V0dGluZ3NcbiAgICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IG9wdHMuY29udGFpbmVyRWwgPSBkb2N1bWVudC5ib2R5ICAgICAgLSB0aGUgY29udGFpbmVyIGVsZW1lbnQgb24gd2hpY2ggeW91IHdhbnQgdG8gYXBwZW5kIFRyYWZmaWNDb250cm9sXG4gICAqIEBwYXJhbSAge1N0cmluZ30gICAgICBvcHRzLmdoQVBJID0gJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20nIC0gdGhlIEdpdGh1YiBBUEkgZW5kcG9pbnQgKGRpZmZlcnMgZm9yIGVudGVycHJpc2UpXG4gICAqIEBwYXJhbSAge1N0cmluZ30gICAgICBvcHRzLnJlcG8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gdGhlIHJlcG8gZS5nLiAnZGVjbGFuZGV3ZXQvdHJhZmZpYy1jb250cm9sJ1xuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgb3B0cy5wcm9kdWN0aW9uQnJhbmNoID0gJ21hc3RlcicgICAgICAtIHRoZSBHSVQgYnJhbmNoIG9uIHdoaWNoIHlvdXIgcHJvZHVjdGlvbiBjb2RlIGlzIHN0b3JlZFxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgb3B0cy5zdGFnaW5nQnJhbmNoID0gJ2RldmVsb3AnICAgICAgICAtIHRoZSBHSVQgYnJhbmNoIG9uIHdoaWNoIHlvdXIgc3RhZ2luZyBjb2RlIGlzIHN0b3JlZFxuICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIEFuIGluc3RhbmNlIG9mIFRyYWZmaWNDb250cm9sXG4gICAqL1xuICBjb25zdHJ1Y3RvciAob3B0cyA9IHt9KSB7XG4gICAgb3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0RGVmYXVsdE9wdHMoKSwgb3B0cylcbiAgICBvcHRzLnJlcG9VUkwgPSBgJHtvcHRzLmdoQVBJfS9yZXBvcy8ke29wdHMucmVwb31gXG4gICAgb3B0cy5jb21wYXJlVVJMID0gYCR7b3B0cy5yZXBvVVJMfS9jb21wYXJlYFxuICAgIG9wdHMuY29tcGFyZUJyYW5jaGVzVVJMID0gYCR7b3B0cy5jb21wYXJlVVJMfS8ke29wdHMucHJvZHVjdGlvbkJyYW5jaH0uLi4ke29wdHMuc3RhZ2luZ0JyYW5jaH1gXG4gICAgdGhpcy5vcHRzID0gdGhpcy52YWxpZGF0ZU9wdHMob3B0cylcbiAgICB0aGlzLmluaXQoKVxuICB9XG5cbiAgLyoqXG4gICAqIFNpbXBseSByZXR1cm5zIGRlZmF1bHQgc2V0dGluZ3MuXG4gICAqIEByZXR1cm4ge09iamVjdH0gLSB0aGUgZGVmYXVsdCBzZXR0aW5ncyBmb3IgdHJhZmZpYy1jb250cm9sXG4gICAqL1xuICBnZXREZWZhdWx0T3B0cyAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YWdpbmdCcmFuY2g6ICdkZXZlbG9wJyxcbiAgICAgIHByb2R1Y3Rpb25CcmFuY2g6ICdtYXN0ZXInLFxuICAgICAgZ2hBUEk6ICdodHRwczovL2FwaS5naXRodWIuY29tJyxcbiAgICAgIGNvbnRhaW5lckVsOiBkb2N1bWVudC5ib2R5XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlcyB1c2VyLXN1cHBsaWVkIG9wdGlvbnMuXG4gICAqIFRocm93cyBvbiBpbnZhbGlkIG9wdGlvbnMuXG4gICAqIEBwYXJhbSAge09iamVjdH0gb3B0cyAtIHRoZSBvcHRpb25zIHRvIHZhbGlkYXRlXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgICAtIGlmIHZhbGlkYXRpb24gaXMgcGFzc2VkLCB0aGUgb3JpZ2luYWwgb3B0aW9ucy5cbiAgICovXG4gIHZhbGlkYXRlT3B0cyAob3B0cykge1xuICAgIGlmIChvcHRzLnJlcG8gPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbmVlZCB0byBzcGVjaWZ5IGEgcmVwb3NpdG9yeS4nKVxuICAgIH1cbiAgICByZXR1cm4gb3B0c1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRyYWZmaWMtY29udHJvbC4gQWRkcyBuZWNlc3NhcnkgQ1NTIHRvIHRoZSBwYWdlIGFuZCBmaWxsc1xuICAgKiBkZWZhdWx0IFVJIHdpdGggbmVjZXNzYXJ5IG1hcmt1cC5cbiAgICovXG4gIGluaXQgKCkge1xuICAgIGFkZENTUyhzdHlsZXMpXG4gICAgdGhpcy5pbml0aWFsaXplRWxlbWVudFdpdGhNYXJrdXAoKVxuICAgIHRoaXMuaW5zdGFudGlhdGVFbGVtZW50V2l0aERlZmF1bHRTdGF0ZSgpXG4gICAgICAudGhlbigoKSA9PiB0aGlzLmNvbXB1dGVBbmRBbmltYXRlU3RhdGUoKSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGluaXRpYWwgZWxlbWVudCwgcmVnaXN0ZXJzIGV2ZW50cyBhbmQgZmlsbHNcbiAgICogbmVjZXNzYXJ5IHRleHQuXG4gICAqL1xuICBpbml0aWFsaXplRWxlbWVudFdpdGhNYXJrdXAgKCkge1xuICAgIHRoaXMuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cmFmZmljLWNvbnRyb2wnKVxuICAgIHRoaXMuZWwuaWQgPSAndHJhZmZpYy1jb250cm9sJ1xuICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gaW5pdGlhbE1hcmt1cFxuICAgIHRoaXMuYWRkRG9tUmVmcygpXG4gICAgdGhpcy5lbHMuaW5zdHJ1Y3Rpb25Nc2cuaW5uZXJIVE1MID0gYFxuICAgICAgZ2l0IGNoZWNrb3V0ICR7dGhpcy5vcHRzLnN0YWdpbmdCcmFuY2h9ICYmXG4gICAgICBnaXQgcHVsbCAtciBvcmlnaW4gJHt0aGlzLm9wdHMucHJvZHVjdGlvbkJyYW5jaH0gJiZcbiAgICAgIGdpdCBwdXNoIG9yaWdpbiAke3RoaXMub3B0cy5zdGFnaW5nQnJhbmNofSAtLWZvcmNlXG4gICAgYFxuICAgIHRoaXMuYWRkRXZlbnRIb29rcygpXG4gICAgdGhpcy5hZGRTdGF0ZXMoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBgdHJhZmZpYy1jb250cm9sYCByZWxhdGVkIERPTSBlbGVtZW50cy5cbiAgICovXG4gIGFkZERvbVJlZnMgKCkge1xuICAgIHRoaXMuZWxzID0gdGhpcy5nZXRET01SZWZlcmVuY2VzKHtcbiAgICAgIGJhcjogJ3RjLWJhcicsXG4gICAgICBsb2FkaW5nTXNnOiAndGMtbWVzc2FnZS0tbG9hZGluZycsXG4gICAgICBzeW5jZWRNc2c6ICd0Yy1tZXNzYWdlLS1zeW5jaHJvbml6ZWQnLFxuICAgICAgYWhlYWRNc2c6ICd0Yy1tZXNzYWdlLS1haGVhZCcsXG4gICAgICBkaXZlcmdlZE1zZzogJ3RjLW1lc3NhZ2UtLWRpdmVyZ2VkJyxcbiAgICAgIHVuYXV0aGVkTXNnOiAndGMtbWVzc2FnZS0tdW5hdXRob3JpemVkJyxcbiAgICAgIGluc3RydWN0aW9uTXNnOiAndGMtbWVzc2FnZS0taW5zdHJ1Y3Rpb24nLFxuICAgICAgY29uZmxpY3RNc2c6ICd0Yy1tZXNzYWdlLS1jb25mbGljdCcsXG4gICAgICBzdWNjZXNzTXNnOiAndGMtbWVzc2FnZS0tc3VjY2VzcycsXG4gICAgICBkZXBsb3lCdG46ICd0Yy1hY3Rpb24tLWRlcGxveScsXG4gICAgICBhdXRoQnRuOiAndGMtYWN0aW9uLS1hdXRob3JpemUnLFxuICAgICAgaW5mb0J0bjogJ3RjLWFjdGlvbi0taW5mbycsXG4gICAgICBva0J0bjogJ3RjLWFjdGlvbi0tb2snLFxuICAgICAgY29uZmxpY3RCdG46ICd0Yy1hY3Rpb24tLWNvbmZsaWN0JyxcbiAgICAgIGNsb3NlQnRuOiAndGMtY2xvc2UtLWJ1dHRvbidcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIHN0YXRlIHdpdGggYHRyYWZmaWMtY29udHJvbGAuIEEgc3RhdGUgaXNcbiAgICogYSBkaWZmZXJlbnQgdmFyaWF0aW9uIG9mIFVJLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gICAgICAgICAgICAgICAgICAgIG5hbWUgLSBuYW1lIG9mIHRoZSBzdGF0ZVxuICAgKiBAcGFyYW0ge09iamVjdHxBcnJheTxIVE1MRWxlbWVudD59IG9wdHMgLSBhIGxpc3Qgb2YgdGhpcyBzdGF0ZSdzIGVsZW1lbnRzIG9yIGFuIG9iamVjdCBjb250YWluaW5nIGEgYHVpYCBsaXN0IGFuZCBhIGBwZXJzaXN0YCBib29sZWFuLiBQZXJzaXN0ZW5jZSBwcm90ZWN0cyB0aGUgZWwgZnJvbSBiZWluZyBoaWRkZW4vcmVtb3ZlZC5cbiAgICovXG4gIGFkZFN0YXRlIChuYW1lLCBvcHRzKSB7XG4gICAgbGV0IHN0YXRlXG4gICAgdGhpcy5zdGF0ZXMgPSB0aGlzLnN0YXRlcyB8fCB7fVxuICAgIGlmIChBcnJheS5pc0FycmF5KG9wdHMpKSB7XG4gICAgICBzdGF0ZSA9IHsgdWk6IG9wdHMgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZSA9IG9wdHNcbiAgICB9XG4gICAgc3RhdGUudWkgPSBzdGF0ZS51aS5tYXAoKGVsKSA9PiB0aGlzLmVsc1tlbF0pXG4gICAgdGhpcy5zdGF0ZXNbbmFtZV0gPSBzdGF0ZVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbGwgb2YgYHRyYWZmaWMtY29udHJvbGAncyBkZWZhdWx0IHN0YXRlcy5cbiAgICovXG4gIGFkZFN0YXRlcyAoKSB7XG4gICAgdGhpcy5hZGRTdGF0ZSgnbW91bnRlZCcsIHtcbiAgICAgIHVpOiBbJ2JhciddLFxuICAgICAgcGVyc2lzdDogdHJ1ZVxuICAgIH0pXG4gICAgdGhpcy5hZGRTdGF0ZSgnbG9hZGluZycsIFsnbG9hZGluZ01zZycsICdjbG9zZUJ0biddKVxuICAgIHRoaXMuYWRkU3RhdGUoJ3VuYXV0aG9yaXplZCcsIFsndW5hdXRoZWRNc2cnLCAnYXV0aEJ0bicsICdjbG9zZUJ0biddKVxuICAgIHRoaXMuYWRkU3RhdGUoJ2FoZWFkJywgWydhaGVhZE1zZycsICdkZXBsb3lCdG4nLCAnY2xvc2VCdG4nXSlcbiAgICB0aGlzLmFkZFN0YXRlKCdkaXZlcmdlZCcsIFsnZGl2ZXJnZWRNc2cnLCAnaW5mb0J0bicsICdjbG9zZUJ0biddKVxuICAgIHRoaXMuYWRkU3RhdGUoJ3N5bmNocm9uaXplZCcsIFsnc3luY2VkTXNnJywgJ2Nsb3NlQnRuJ10pXG4gICAgdGhpcy5hZGRTdGF0ZSgnaW5zdHJ1Y3Rpb24nLCBbJ2luc3RydWN0aW9uTXNnJywgJ29rQnRuJywgJ2Nsb3NlQnRuJ10pXG4gICAgdGhpcy5hZGRTdGF0ZSgnY29uZmxpY3QnLCBbJ2NvbmZsaWN0TXNnJywgJ2NvbmZsaWN0QnRuJywgJ2Nsb3NlQnRuJ10pXG4gICAgdGhpcy5hZGRTdGF0ZSgnc3VjY2VzcycsIFsnc3VjY2Vzc01zZycsICdjbG9zZUJ0biddKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBpbnRlcmFjdGlvbiBldmVudHMuXG4gICAqL1xuICBhZGRFdmVudEhvb2tzICgpIHtcbiAgICBvbih0aGlzLmVscy5pbmZvQnRuLCAnY2xpY2snLCAoKSA9PiB0aGlzLnJlbmRlclN0YXRlKCdpbnN0cnVjdGlvbicpKVxuICAgIG9uKHRoaXMuZWxzLm9rQnRuLCAnY2xpY2snLCAoKSA9PiB0aGlzLnJlbmRlclN0YXRlKCdkaXZlcmdlZCcpKVxuICAgIG9uKHRoaXMuZWxzLmNsb3NlQnRuLCAnY2xpY2snLCAoKSA9PiB0aGlzLnVuUmVuZGVyU3RhdGUoJ21vdW50ZWQnKSlcbiAgICBvbih0aGlzLmVscy5hdXRoQnRuLCAnY2xpY2snLCAoKSA9PiB0aGlzLmF1dGhlbnRpY2F0ZUdpdGh1YigpXG4gICAgICAudGhlbigoeyB0b2tlbiB9KSA9PiB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5naF90b2tlbiA9IHRva2VuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXB1dGVBbmRBbmltYXRlU3RhdGUoKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKVxuICAgIClcbiAgICBvbih0aGlzLmVscy5jb25mbGljdEJ0biwgJ2NsaWNrJywgKCkgPT4gdGhpcy5jb21wdXRlQW5kQW5pbWF0ZVN0YXRlKCkpXG4gICAgb24odGhpcy5lbHMuZGVwbG95QnRuLCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlclN0YXRlKCdsb2FkaW5nJylcbiAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5tZXJnZSgpKVxuICAgICAgICAudGhlbigoZGF0YSkgPT4gdGhpcy5yZW5kZXJNZXJnZVN0YXR1cyhkYXRhKSlcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT4gY29uc29sZS5lcnJvcihlcnJvcikpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBgZGVwbG95YCBpcyBjbGlja2VkLCByZW5kZXJzIHRoZSBzdGF0ZSBvZiB0aGUgZGVwbG95LlxuICAgKiBpLmUuIHdhcyBpdCBhIHN1Y2Nlc3Mgb3Igd2VyZSB0aGVyZSBjb25mbGljdHM/XG4gICAqIEBwYXJhbSAge09iamVjdH0gcmVzcG9uc2UgICAgICAgIC0gdGhlIHJlc3BvbnNlIGZyb20gdGhlIGdpdCByZW1vdGVcbiAgICogQHBhcmFtICB7TnVtYmVyfSByZXNwb25zZS5zdGF0dXMgLSB0aGUgcmVzcG9uc2Ugc3RhdHVzIGNvZGVcbiAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgICAgLSBhIHByb21pc2UgZm9yIHRoZSByZW5kZXJlZCBzdGF0ZVxuICAgKi9cbiAgcmVuZGVyTWVyZ2VTdGF0dXMgKHsgc3RhdHVzIH0pIHtcbiAgICBpZiAoc3RhdHVzID09PSAyMDEpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlclN0YXRlKCdzdWNjZXNzJylcbiAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5jb21wdXRlQW5kQW5pbWF0ZVN0YXRlKCkpXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwOSkge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyU3RhdGUoJ2NvbmZsaWN0JylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJpZ2dlcnMgYSBkZXBsb3kgZnJvbSBzdGFnaW5nIHRvIHByb2R1Y3Rpb24uXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gYSBwcm9taXNlIGZvciB0aGUgbWVyZ2UgcmVzcG9uc2UuXG4gICAqL1xuICBtZXJnZSAoKSB7XG4gICAgcmV0dXJuIHBvc3RKU09OKGAke3RoaXMub3B0cy5yZXBvVVJMfS9tZXJnZXM/YWNjZXNzX3Rva2VuPSR7bG9jYWxTdG9yYWdlLmdoX3Rva2VufWAsIHtcbiAgICAgIGJhc2U6IHRoaXMub3B0cy5wcm9kdWN0aW9uQnJhbmNoLFxuICAgICAgaGVhZDogdGhpcy5vcHRzLnN0YWdpbmdCcmFuY2gsXG4gICAgICBjb21taXRfbWVzc2FnZTogJzp2ZXJ0aWNhbF90cmFmZmljX2xpZ2h0OiBQcm9kdWN0aW9uIGRlcGxveSB0cmlnZ2VyZWQgZnJvbSB0cmFmZmljLWNvbnRyb2wnXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2VzIGEgZGljdG9uYXJ5IG9mIG5hbWU6IGNsYXNzIGVsZW1lbnRzXG4gICAqIGFzIGEgZGljdGlvbmFyeSBvZiBuYW1lOiBIVE1MRWxlbWVudC5cbiAgICogQHBhcmFtICB7T2JqZWN0fSBjbGFzc2VzIC0gdGhlIGNsYXNzZXMgb2YgZWxlbWVudHMgdG8gcmVmZXJlbmNlXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAtIGEgZGljdGlvbmFyeSByZWZlcmVuY2Ugb2YgYWN0dWFsIEhUTUwgZWxlbWVudHNcbiAgICovXG4gIGdldERPTVJlZmVyZW5jZXMgKGNsYXNzZXMpIHtcbiAgICBsZXQgbyA9IHt9XG4gICAgZm9yIChsZXQgZWwgaW4gY2xhc3Nlcykge1xuICAgICAgaWYgKGNsYXNzZXMuaGFzT3duUHJvcGVydHkoZWwpKSB7XG4gICAgICAgIG9bZWxdID0gdGhpcy5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzZXNbZWxdKVswXVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgdGhlIGluaXRpYWwgc3RhdGUgYWZ0ZXIgYXBwZW5kaW5nIHRyYWZmaWMtY29udHJvbFxuICAgKiB0byB0aGUgY29udGFpbmluZyBlbGVtZW50LlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIGEgcHJvbWlzZSBmb3IgYSBtb3VudGVkIGB0cmFmZmljLWNvbnRyb2xgLlxuICAgKi9cbiAgaW5zdGFudGlhdGVFbGVtZW50V2l0aERlZmF1bHRTdGF0ZSAoKSB7XG4gICAgdGhpcy5vcHRzLmNvbnRhaW5lckVsLmFwcGVuZENoaWxkKHRoaXMuZWwpXG4gICAgcmV0dXJuIHRoaXMucmVuZGVyU3RhdGUoJ21vdW50ZWQnKVxuICB9XG5cbiAgLyoqXG4gICAqIENvbXB1dGVzIHdoYXQgc3RhdGUgdHJhZmZpYy1jb250cm9sIHNob3VsZCByZW5kZXIuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gYSBwcm9taXNlIGZvciB0aGUgZmluYWwgc3RhdGUsIGFmdGVyIGFuaW1hdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgY29tcHV0ZUFuZEFuaW1hdGVTdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyU3RhdGUoJ2xvYWRpbmcnKVxuICAgICAgLnRoZW4oKCkgPT4gIWxvY2FsU3RvcmFnZS5naF90b2tlblxuICAgICAgICA/IHRoaXMucmVuZGVyU3RhdGUoJ3VuYXV0aG9yaXplZCcpXG4gICAgICAgIDogdGhpcy5nZXRCcmFuY2hDb21wYXJpc29uKClcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB0aGlzLnJlbmRlckRlcGxveW1lbnRTdGF0ZShkYXRhKSlcbiAgICAgIClcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgZGVwbG95bWVudCBzdGF0ZSAtIGNhbiBiZSBhaGVhZCBvciBkaXZlcmdlZFxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHJlc3AgICAgICAgICAgICAgICAtIHRoZSBKU09OIHJlc3BvbnNlIG9mIHRoZSBnaXQgcmVtb3RlIGJyYW5jaCBjb21wYXJpc29uXG4gICAqIEBwYXJhbSAge1N0cmluZ30gcmVzcC5zdGF0dXMgICAgICAgIC0gdGhlIHN0YXR1cyBvZiB0aGUgY29tcGFyaXNvbi4gXCJhaGVhZFwiLCBcImJlaGluZFwiIG9yIFwiZGl2ZXJnZWRcIlxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHJlc3AuYWhlYWRfYnkgICAgICAtIHRoZSBudW1iZXIgb2YgY29tbWl0cyB0aGF0IGFyZSBhaGVhZC5cbiAgICogQHBhcmFtICB7TnVtYmVyfSByZXNwLmJlaGluZF9ieSAgICAgLSB0aGUgbnVtYmVyIG9mIGNvbW1pdHMgdGhhdCBhcmUgYmVoaW5kLlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHJlc3AucGVybWFsaW5rX3VybCAtIGEgbGluayB0byB0aGUgcmVtb3RlJ3MgZGlmZiB2aWV3LlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgICAgICAtIGEgcHJvbWlzZSBmb3IgdGhlIHJlbmRlcmVkIGRlcGxveW1lbnQgc3RhdGUuXG4gICAqL1xuICByZW5kZXJEZXBsb3ltZW50U3RhdGUgKHsgc3RhdHVzLCBhaGVhZF9ieSwgYmVoaW5kX2J5LCBwZXJtYWxpbmtfdXJsIH0pIHtcbiAgICBzd2l0Y2ggKHN0YXR1cykge1xuICAgICAgY2FzZSAnYWhlYWQnOlxuICAgICAgY2FzZSAnZGl2ZXJnZWQnOlxuICAgICAgICB0aGlzLmVsc1tgJHtzdGF0dXN9TXNnYF0uaW5uZXJIVE1MID0gc3RhdHVzID09PSAnYWhlYWQnXG4gICAgICAgICAgPyB0aGlzLmdldEFoZWFkTWVzc2FnZShhaGVhZF9ieSwgcGVybWFsaW5rX3VybClcbiAgICAgICAgICA6IHRoaXMuZ2V0RGl2ZXJnZWRNZXNzYWdlKGJlaGluZF9ieSwgcGVybWFsaW5rX3VybClcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyU3RhdGUoc3RhdHVzKVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyU3RhdGUoJ3N5bmNocm9uaXplZCcpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBjb21wYXJpc29uIGJldHdlZW4gYnJhbmNoZXMgZnJvbSB0aGUgZ2l0IHJlbW90ZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSBhIHByb21pc2UgZm9yIHRoZSBKU09OIHJlc3BvbnNlLlxuICAgKi9cbiAgZ2V0QnJhbmNoQ29tcGFyaXNvbiAoKSB7XG4gICAgY29uc3QgY2FjaGVCdXN0ZXIgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICAgIHJldHVybiBnZXRKU09OKFxuICAgICAgYCR7dGhpcy5vcHRzLmNvbXBhcmVCcmFuY2hlc1VSTH0/YWNjZXNzX3Rva2VuPSR7bG9jYWxTdG9yYWdlLmdoX3Rva2VufSZjYWNoZV9idXN0ZXI9JHtjYWNoZUJ1c3Rlcn1gXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBsaXN0IG9mIHRoZSBjdXJyZW50IG1vZGlmaWFibGUgdHJhZmZpYy1jb250cm9sIHN0YXRlcy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG9wdHMuZmlsdGVyIC0gZmlsdGVyIHRoaXMgc3RhdGUgZnJvbSB0aGUgcmVzdWx0IHNldFxuICAgKiBAcmV0dXJuIHtBcnJheX0gICAgICAgICAgICAgLSBhIGxpc3Qgb2Ygc3RhdGVzXG4gICAqL1xuICBnZXRDdXJyZW50U3RhdGVzICh7IGZpbHRlciB9KSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuc3RhdGVzKVxuICAgICAgLmZpbHRlcigoc3RhdGUpID0+IChcbiAgICAgICAgc3RhdGUgIT09IGZpbHRlciAmJiAhdGhpcy5zdGF0ZXNbc3RhdGVdLnBlcnNpc3RcbiAgICAgICkpXG4gIH1cblxuICAvKipcbiAgICogUmVuZGVycyB0aGUgZ2l2ZW4gc3RhdGUgYWZ0ZXIgdW5yZW5kZXJpbmcgY3VycmVudCBzdGF0ZXMuXG4gICAqIEBwYXJhbSAge1N0cmluZ30gIHN0YXRlIC0gdGhlIG5hbWUgb2YgdGhlIHN0YXRlIHRvIHJlbmRlclxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAtIGEgcHJvbWlzZSBmb3IgdGhlIHJlbmRlcmVkIHN0YXRlXG4gICAqL1xuICByZW5kZXJTdGF0ZSAoc3RhdGUpIHtcbiAgICAvLyBnZXQgYSBsaXN0IG9mIGFsbCBzdGF0ZXNcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICB0aGlzLmdldEN1cnJlbnRTdGF0ZXMoeyBmaWx0ZXI6IHN0YXRlIH0pXG4gICAgICAgIC5tYXAoKHByZXZpb3VzU3RhdGUpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGhhc0NsYXNzKHRoaXMuZWwsIGBpcy0ke3ByZXZpb3VzU3RhdGV9YClcbiAgICAgICAgICAgID8gdGhpcy51blJlbmRlclN0YXRlKHByZXZpb3VzU3RhdGUpLnRoZW4ocmVzb2x2ZSlcbiAgICAgICAgICAgIDogcmVzb2x2ZSgpXG4gICAgICAgIH0pKVxuICAgIClcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgYWRkQ2xhc3ModGhpcy5lbCwgYGlzLSR7c3RhdGV9YClcbiAgICAgICAgcmV0dXJuIGFuaW1hdG9yLmFuaW1hdGVJbiguLi50aGlzLnN0YXRlc1tzdGF0ZV0udWkpXG4gICAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFVucmVuZGVycyBhIHN0YXRlLlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBzdGF0ZSAtIHRoZSBuYW1lIG9mIHRoZSBzdGF0ZSB0byB1bnJlbmRlci5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgLSBhIHByb21pc2UgZm9yIHRoZSB1bnJlbmRlcmVkIHN0YXRlXG4gICAqL1xuICB1blJlbmRlclN0YXRlIChzdGF0ZSkge1xuICAgIHJldHVybiBhbmltYXRvci5hbmltYXRlT3V0KC4uLnRoaXMuc3RhdGVzW3N0YXRlXS51aSlcbiAgICAgIC50aGVuKCgpID0+IHJlbW92ZUNsYXNzKHRoaXMuZWwsIGBpcy0ke3N0YXRlfWApKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBtZXNzYWdlIGZvciBhaGVhZCBzdGF0ZS5cbiAgICogQHBhcmFtICB7TnVtYmVyfSBjb3VudCAtIHRoZSBudW1iZXIgb2YgY29tbWl0cyBhaGVhZC5cbiAgICogQHBhcmFtICB7U3RyaW5nfSBsaW5rICAtIGxpbmsgdG8gZGlmZiB2aWV3XG4gICAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgLSB0aGUgY29tcGlsZWQgbWVzc2FnZVxuICAgKi9cbiAgZ2V0QWhlYWRNZXNzYWdlIChjb3VudCwgbGluaykge1xuICAgIHJldHVybiBgXG4gICAgICBZb3UgYXJlIHZpZXdpbmcgdGhlIHN0YWdpbmcgc2l0ZS5cbiAgICAgIFRoZXJlICR7Y291bnQgPiAxID8gJ2hhdmUnIDogJ2hhcyd9IGJlZW5cbiAgICAgIDxhIGhyZWY9XCIke2xpbmt9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtjb3VudH08L2E+XG4gICAgICAke2NvdW50ID4gMSA/ICdjaGFuZ2VzJyA6ICdjaGFuZ2UnfSBzaW5jZSB0aGUgbGFzdCBwcm9kdWN0aW9uIGJ1aWxkLiDwn5qiXG4gICAgYFxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBtZXNzYWdlIGZvciBkaXZlcmdlZCBzdGF0ZS5cbiAgICogQHBhcmFtICB7TnVtYmVyfSBjb3VudCAtIHRoZSBudW1iZXIgb2YgY29tbWl0cyBiZWhpbmQuXG4gICAqIEBwYXJhbSAge1N0cmluZ30gbGluayAgLSBsaW5rIHRvIGRpZmYgdmlld1xuICAgKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgIC0gdGhlIGNvbXBpbGVkIG1lc3NhZ2VcbiAgICovXG4gIGdldERpdmVyZ2VkTWVzc2FnZSAoY291bnQsIGxpbmspIHtcbiAgICByZXR1cm4gYFxuICAgICAgWW91IGFyZSB2aWV3aW5nIHRoZSBzdGFnaW5nIHNpdGUuXG4gICAgICBTdGFnaW5nIGhhcyBkaXZlcmdlZCBiZWhpbmQgcHJvZHVjdGlvbiBieVxuICAgICAgPGEgaHJlZj1cIiR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2NvdW50fTwvYT5cbiAgICAgICR7Y291bnQgPiAxID8gJ2NvbW1pdHMnIDogJ2NvbW1pdCd9LiBQbGVhc2UgcmViYXNlLlxuICAgIGBcbiAgfVxuXG4gIC8qKlxuICAgKiBBdXRoZW50aWNhdGVzIHZpZXdlciB2aWEgdGhlaXIgR2l0aHViIGFjY291bnQuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gcHJvbWlzZSBmb3IgdGhlIGF1dGhlbnRpY2F0ZWQgc2Vzc2lvbi5cbiAgICovXG4gIGF1dGhlbnRpY2F0ZUdpdGh1YiAoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIG5ldGxpZnkuYXV0aGVudGljYXRlKHsgcHJvdmlkZXI6ICdnaXRodWInLCBzY29wZTogJ3JlcG8nIH0sIChlcnJvciwgZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gZXJyb3IgPyByZWplY3QoZXJyb3IpIDogcmVzb2x2ZShkYXRhKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG4vKiBwb2x5ZmlsbHMgKi9cbmltcG9ydCAnd2hhdHdnLWZldGNoJ1xuLy8gVE9ETzogZmluZCBvdXQgd2h5IHRoZXNlIGJyZWFrIHJvbGx1cC4uLlxuLy8gaW1wb3J0ICdjb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24nXG4vLyBpbXBvcnQgJ2NvcmUtanMvZm4vb2JqZWN0L2tleXMnXG4vLyBpbXBvcnQgJ2NvcmUtanMvZm4vYXJyYXkvaXMtYXJyYXknXG4vLyBpbXBvcnQgJ2NvcmUtanMvZm4vcHJvbWlzZSdcblxuLyogY29tcG9uZW50IGNsYXNzICovXG5pbXBvcnQgVHJhZmZpY0NvbnRyb2wgZnJvbSAnLi90cmFmZmljLWNvbnRyb2wnXG5cbi8qKlxuICogW3RyYWZmaWNDb250cm9sIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSBvcHRzIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRyYWZmaWNDb250cm9sIChvcHRzKSB7XG4gIGNvbnN0IG5ldGxpZnkgPSB3aW5kb3cubmV0bGlmeVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXNlcyB0cmFmZmljLWNvbnRyb2xcbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSBhIHByb21pc2UgZm9yIHRoZSBpbml0aWFsaXplZCB0cmFmZmljLWNvbnRyb2wgaW5zdGFuY2VcbiAgICovXG4gIGNvbnN0IGluaXQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBUcmFmZmljQ29udHJvbChvcHRzKVxuICB9XG5cbiAgLyoqXG4gICAqIENvbmRpdGlvbmFsbHkgbG9hZHMgTmV0bGlmeSBpZiBub3QgcHJlc2VudCBvbiBwYWdlXG4gICAqIGJlZm9yZSBpbml0aWFsaXNpbmcgdHJhZmZpYy1jb250cm9sXG4gICAqL1xuICBjb25zdCBjb25kaXRpb25hbGx5TG9hZE5ldGxpZnkgPSAoKSA9PiB7XG4gICAgaWYgKG5ldGxpZnkgPT0gbnVsbCkge1xuICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCdcbiAgICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gaW5pdFxuICAgICAgc2NyaXB0LnNyYyA9ICdodHRwczovL2FwcC5uZXRsaWZ5LmNvbS9hdXRoZW50aWNhdGlvbi5qcydcbiAgICAgIHJldHVybiBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGluaXQoKVxuICAgIH1cbiAgfVxuXG4gIC8vIGNvbmRpdGlvbmFsbHkgbG9hZCBuZXRsaWZ5IHNjcmlwdCBhbmQgYm9vdHN0cmFwIHRyYWZmaWMtY29udHJvbFxuICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGNvbmRpdGlvbmFsbHlMb2FkTmV0bGlmeSwgZmFsc2UpXG4gIH0gZWxzZSBpZiAod2luZG93LmF0dGFjaEV2ZW50KSB7XG4gICAgd2luZG93LmF0dGFjaEV2ZW50KCdvbmxvYWQnLCBjb25kaXRpb25hbGx5TG9hZE5ldGxpZnkpXG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7RUFBQSxDQUFDLFVBQVMsSUFBVCxFQUFlO0FBQ2QsRUFBQTs7QUFFQSxFQUFBLE1BQUksS0FB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