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