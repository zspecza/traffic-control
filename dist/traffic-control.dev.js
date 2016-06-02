(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('trafficControl', factory) :
  (global.trafficControl = factory());
}(this, function () { 'use strict';

  function trafficControl(opts) {
    opts = opts || {};
    opts.GH_API = opts.GH_API || 'https://api.github.com';
    opts.stagingBranch = opts.stagingBranch || 'develop';
    opts.productionBranch = opts.productionBranch || 'master';

    if (opts.repo == null) {
      throw new Error('You need to specify a repository.');
    }

    var body = document.getElementsByTagName('body')[0];
    var bar = document.createElement('div');
    bar.id = 'staging-bar';
    bar.style.backgroundColor = '#eee';
    bar.style.color = '#222';
    bar.style.fontFamily = 'sans-serif';
    bar.style.padding = '16px 8px';
    bar.style.position = 'fixed';
    bar.style.top = '0';
    bar.style.width = '100%';
    bar.innerText = 'Loading...';
    body.insertBefore(bar, body.firstChild);

    function init() {
      var $ = window.$;
      var localStorage = window.localStorage;
      var netlify = window.netlify;

      var $body = $(body);
      var $bar = $('#staging-bar');
      var $msg = $('<div />');

      function bar() {
        if (!localStorage.gh_token) {
          $bar.empty();
          var $authBtn = $('<button>Authorize</button>');
          $msg.text('You are viewing the staging site, but you cannot deploy or view changes until you authorize read/write access to your Github repository.');
          $bar.append($msg);
          $bar.css({
            backgroundColor: '#E02D2D',
            color: 'white'
          });
          $bar.append($authBtn);
          $body.prepend($bar);
          $authBtn.on('click', function () {
            netlify.authenticate({ provider: 'github', scope: 'repo' }, function (err, data) {
              if (err) {
                console.log('Error authenticating: %s', err.message);
              }
              localStorage.gh_token = data.token;
              bar();
            });
          });
        } else {
          $.getJSON(opts.GH_API + '/repos/' + opts.repo + '/compare/' + opts.productionBranch + '...' + opts.stagingBranch + 'develop?access_token=' + localStorage.gh_token, function (data) {
            $bar.empty();
            var $deployBtn = $('<button>Deploy</button>');
            if (data.status === 'ahead') {
              var have = data.ahead_by > 1 ? 'have' : 'has';
              var changes = data.ahead_by > 1 ? 'changes' : 'change';
              $msg.html('You are viewing the staging site. There ' + have + ' been <a href="' + data.permalink_url + '" target="_blank">' + data.ahead_by + '</a> ' + changes + ' since the last production build. 🚢');
              $bar.append($msg);
              $bar.css({
                backgroundColor: '#B8D5E9',
                color: '#222'
              });
              $bar.append($deployBtn);
              $body.prepend($bar);
              $deployBtn.on('click', function () {
                $.post(opts.GH_API + '/repos/' + opts.repo + '/merges?access_token=' + localStorage.gh_token, JSON.stringify({
                  base: 'master',
                  head: 'develop',
                  commit_message: ':vertical_traffic_light: Production deploy triggered from traffic-control'
                }), function () {
                  bar();
                });
              });
            } else if (data.status === 'diverged') {
              var commits = data.behind_by > 1 ? 'commits' : 'commit';
              $msg.html('You are viewing the staging site. Staging has diverged behind production by <a href="' + data.permalink_url + '" target="_blank">' + data.behind_by + '</a> ' + commits + '. Please rebase.');
              $bar.append($msg);
              $bar.css({
                backgroundColor: 'orange',
                color: '#222'
              });
              $body.prepend($bar);
            } else {
              $msg.text('You are viewing the staging site. Everything is in sync, production is even with staging. 👌');
              $bar.append($msg);
              $bar.css({
                backgroundColor: '#BAE9B8',
                color: '#222'
              });
              $body.prepend($bar);
            }
          });
        }
      }
      bar();
    }

    function conditionallyLoadJQuery() {
      var jQuery = window.jQuery;
      var protocol = '//';
      if (window.location.href.includes('file://')) {
        protocol = 'https://';
      }
      if (!(typeof jQuery !== 'undefined' && jQuery !== null)) {
        var jQ = document.createElement('script');
        jQ.type = 'text/javascript';
        jQ.onload = jQ.onreadystatechange = init;
        jQ.src = protocol + 'code.jquery.com/jquery-2.2.4.min.js';
        return document.body.appendChild(jQ);
      } else {
        return init();
      }
    };

    if (window.addEventListener) {
      window.addEventListener('load', conditionallyLoadJQuery, false);
    } else if (window.attachEvent) {
      window.attachEvent('onload', conditionallyLoadJQuery);
    }
  }

  return trafficControl;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhZmZpYy1jb250cm9sLmRldi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3RyYWZmaWMtY29udHJvbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHJhZmZpY0NvbnRyb2wgKG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge31cbiAgb3B0cy5HSF9BUEkgPSBvcHRzLkdIX0FQSSB8fCAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbSdcbiAgb3B0cy5zdGFnaW5nQnJhbmNoID0gb3B0cy5zdGFnaW5nQnJhbmNoIHx8ICdkZXZlbG9wJ1xuICBvcHRzLnByb2R1Y3Rpb25CcmFuY2ggPSBvcHRzLnByb2R1Y3Rpb25CcmFuY2ggfHwgJ21hc3RlcidcblxuICBpZiAob3B0cy5yZXBvID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBuZWVkIHRvIHNwZWNpZnkgYSByZXBvc2l0b3J5LicpXG4gIH1cblxuICB2YXIgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF1cbiAgdmFyIGJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGJhci5pZCA9ICdzdGFnaW5nLWJhcidcbiAgYmFyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZWVlJ1xuICBiYXIuc3R5bGUuY29sb3IgPSAnIzIyMidcbiAgYmFyLnN0eWxlLmZvbnRGYW1pbHkgPSAnc2Fucy1zZXJpZidcbiAgYmFyLnN0eWxlLnBhZGRpbmcgPSAnMTZweCA4cHgnXG4gIGJhci5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCdcbiAgYmFyLnN0eWxlLnRvcCA9ICcwJ1xuICBiYXIuc3R5bGUud2lkdGggPSAnMTAwJSdcbiAgYmFyLmlubmVyVGV4dCA9ICdMb2FkaW5nLi4uJ1xuICBib2R5Lmluc2VydEJlZm9yZShiYXIsIGJvZHkuZmlyc3RDaGlsZClcblxuICBmdW5jdGlvbiBpbml0ICgpIHtcbiAgICB2YXIgJCA9IHdpbmRvdy4kXG4gICAgdmFyIGxvY2FsU3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VcbiAgICB2YXIgbmV0bGlmeSA9IHdpbmRvdy5uZXRsaWZ5XG5cbiAgICB2YXIgJGJvZHkgPSAkKGJvZHkpXG4gICAgdmFyICRiYXIgPSAkKCcjc3RhZ2luZy1iYXInKVxuICAgIHZhciAkbXNnID0gJCgnPGRpdiAvPicpXG5cbiAgICBmdW5jdGlvbiBiYXIgKCkge1xuICAgICAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2hfdG9rZW4pIHtcbiAgICAgICAgJGJhci5lbXB0eSgpXG4gICAgICAgIHZhciAkYXV0aEJ0biA9ICQoJzxidXR0b24+QXV0aG9yaXplPC9idXR0b24+JylcbiAgICAgICAgJG1zZy50ZXh0KCdZb3UgYXJlIHZpZXdpbmcgdGhlIHN0YWdpbmcgc2l0ZSwgYnV0IHlvdSBjYW5ub3QgZGVwbG95IG9yIHZpZXcgY2hhbmdlcyB1bnRpbCB5b3UgYXV0aG9yaXplIHJlYWQvd3JpdGUgYWNjZXNzIHRvIHlvdXIgR2l0aHViIHJlcG9zaXRvcnkuJylcbiAgICAgICAgJGJhci5hcHBlbmQoJG1zZylcbiAgICAgICAgJGJhci5jc3Moe1xuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNFMDJEMkQnLFxuICAgICAgICAgIGNvbG9yOiAnd2hpdGUnXG4gICAgICAgIH0pXG4gICAgICAgICRiYXIuYXBwZW5kKCRhdXRoQnRuKVxuICAgICAgICAkYm9keS5wcmVwZW5kKCRiYXIpXG4gICAgICAgICRhdXRoQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBuZXRsaWZ5LmF1dGhlbnRpY2F0ZSh7IHByb3ZpZGVyOiAnZ2l0aHViJywgc2NvcGU6ICdyZXBvJyB9LCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBhdXRoZW50aWNhdGluZzogJXMnLCBlcnIubWVzc2FnZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5naF90b2tlbiA9IGRhdGEudG9rZW5cbiAgICAgICAgICAgIGJhcigpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQuZ2V0SlNPTihvcHRzLkdIX0FQSSArICcvcmVwb3MvJyArIG9wdHMucmVwbyArICcvY29tcGFyZS8nICsgb3B0cy5wcm9kdWN0aW9uQnJhbmNoICsgJy4uLicgKyBvcHRzLnN0YWdpbmdCcmFuY2ggKyAnZGV2ZWxvcD9hY2Nlc3NfdG9rZW49JyArIGxvY2FsU3RvcmFnZS5naF90b2tlbiwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAkYmFyLmVtcHR5KClcbiAgICAgICAgICB2YXIgJGRlcGxveUJ0biA9ICQoJzxidXR0b24+RGVwbG95PC9idXR0b24+JylcbiAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdhaGVhZCcpIHtcbiAgICAgICAgICAgIHZhciBoYXZlID0gZGF0YS5haGVhZF9ieSA+IDEgPyAnaGF2ZScgOiAnaGFzJ1xuICAgICAgICAgICAgdmFyIGNoYW5nZXMgPSBkYXRhLmFoZWFkX2J5ID4gMSA/ICdjaGFuZ2VzJyA6ICdjaGFuZ2UnXG4gICAgICAgICAgICAkbXNnLmh0bWwoJ1lvdSBhcmUgdmlld2luZyB0aGUgc3RhZ2luZyBzaXRlLiBUaGVyZSAnICsgaGF2ZSArICcgYmVlbiA8YSBocmVmPVwiJyArIGRhdGEucGVybWFsaW5rX3VybCArICdcIiB0YXJnZXQ9XCJfYmxhbmtcIj4nICsgZGF0YS5haGVhZF9ieSArICc8L2E+ICcgKyBjaGFuZ2VzICsgJyBzaW5jZSB0aGUgbGFzdCBwcm9kdWN0aW9uIGJ1aWxkLiDwn5qiJylcbiAgICAgICAgICAgICRiYXIuYXBwZW5kKCRtc2cpXG4gICAgICAgICAgICAkYmFyLmNzcyh7XG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNCOEQ1RTknLFxuICAgICAgICAgICAgICBjb2xvcjogJyMyMjInXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgJGJhci5hcHBlbmQoJGRlcGxveUJ0bilcbiAgICAgICAgICAgICRib2R5LnByZXBlbmQoJGJhcilcbiAgICAgICAgICAgICRkZXBsb3lCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAkLnBvc3Qob3B0cy5HSF9BUEkgKyAnL3JlcG9zLycgKyBvcHRzLnJlcG8gKyAnL21lcmdlcz9hY2Nlc3NfdG9rZW49JyArIGxvY2FsU3RvcmFnZS5naF90b2tlbiwgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIGJhc2U6ICdtYXN0ZXInLFxuICAgICAgICAgICAgICAgIGhlYWQ6ICdkZXZlbG9wJyxcbiAgICAgICAgICAgICAgICBjb21taXRfbWVzc2FnZTogJzp2ZXJ0aWNhbF90cmFmZmljX2xpZ2h0OiBQcm9kdWN0aW9uIGRlcGxveSB0cmlnZ2VyZWQgZnJvbSB0cmFmZmljLWNvbnRyb2wnXG4gICAgICAgICAgICAgIH0pLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYmFyKClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIGlmIChkYXRhLnN0YXR1cyA9PT0gJ2RpdmVyZ2VkJykge1xuICAgICAgICAgICAgdmFyIGNvbW1pdHMgPSBkYXRhLmJlaGluZF9ieSA+IDEgPyAnY29tbWl0cycgOiAnY29tbWl0J1xuICAgICAgICAgICAgJG1zZy5odG1sKCdZb3UgYXJlIHZpZXdpbmcgdGhlIHN0YWdpbmcgc2l0ZS4gU3RhZ2luZyBoYXMgZGl2ZXJnZWQgYmVoaW5kIHByb2R1Y3Rpb24gYnkgPGEgaHJlZj1cIicgKyBkYXRhLnBlcm1hbGlua191cmwgKyAnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+JyArIGRhdGEuYmVoaW5kX2J5ICsgJzwvYT4gJyArIGNvbW1pdHMgKyAnLiBQbGVhc2UgcmViYXNlLicpXG4gICAgICAgICAgICAkYmFyLmFwcGVuZCgkbXNnKVxuICAgICAgICAgICAgJGJhci5jc3Moe1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnLFxuICAgICAgICAgICAgICBjb2xvcjogJyMyMjInXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgJGJvZHkucHJlcGVuZCgkYmFyKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkbXNnLnRleHQoJ1lvdSBhcmUgdmlld2luZyB0aGUgc3RhZ2luZyBzaXRlLiBFdmVyeXRoaW5nIGlzIGluIHN5bmMsIHByb2R1Y3Rpb24gaXMgZXZlbiB3aXRoIHN0YWdpbmcuIPCfkYwnKVxuICAgICAgICAgICAgJGJhci5hcHBlbmQoJG1zZylcbiAgICAgICAgICAgICRiYXIuY3NzKHtcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI0JBRTlCOCcsXG4gICAgICAgICAgICAgIGNvbG9yOiAnIzIyMidcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAkYm9keS5wcmVwZW5kKCRiYXIpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgICBiYXIoKVxuICB9XG5cbiAgZnVuY3Rpb24gY29uZGl0aW9uYWxseUxvYWRKUXVlcnkgKCkge1xuICAgIHZhciBqUXVlcnkgPSB3aW5kb3cualF1ZXJ5XG4gICAgdmFyIHByb3RvY29sID0gJy8vJ1xuICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcygnZmlsZTovLycpKSB7XG4gICAgICBwcm90b2NvbCA9ICdodHRwczovLydcbiAgICB9XG4gICAgaWYgKCEodHlwZW9mIGpRdWVyeSAhPT0gJ3VuZGVmaW5lZCcgJiYgalF1ZXJ5ICE9PSBudWxsKSkge1xuICAgICAgdmFyIGpRID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgICAgIGpRLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0J1xuICAgICAgalEub25sb2FkID0galEub25yZWFkeXN0YXRlY2hhbmdlID0gaW5pdFxuICAgICAgalEuc3JjID0gcHJvdG9jb2wgKyAnY29kZS5qcXVlcnkuY29tL2pxdWVyeS0yLjIuNC5taW4uanMnXG4gICAgICByZXR1cm4gZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChqUSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGluaXQoKVxuICAgIH1cbiAgfTtcblxuICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGNvbmRpdGlvbmFsbHlMb2FkSlF1ZXJ5LCBmYWxzZSlcbiAgfSBlbHNlIGlmICh3aW5kb3cuYXR0YWNoRXZlbnQpIHtcbiAgICB3aW5kb3cuYXR0YWNoRXZlbnQoJ29ubG9hZCcsIGNvbmRpdGlvbmFsbHlMb2FkSlF1ZXJ5KVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0VBRWUsU0FBUyxjQUFULENBQXlCLElBQXpCLEVBQStCO0FBQzVDLEVBQUEsU0FBTyxRQUFRLEVBQWY7QUFDQSxFQUFBLE9BQUssTUFBTCxHQUFjLEtBQUssTUFBTCxJQUFlLHdCQUE3QjtBQUNBLEVBQUEsT0FBSyxhQUFMLEdBQXFCLEtBQUssYUFBTCxJQUFzQixTQUEzQztBQUNBLEVBQUEsT0FBSyxnQkFBTCxHQUF3QixLQUFLLGdCQUFMLElBQXlCLFFBQWpEOztBQUVBLEVBQUEsTUFBSSxLQUFLLElBQUwsSUFBYSxJQUFqQixFQUF1QjtBQUNyQixFQUFBLFVBQU0sSUFBSSxLQUFKLENBQVUsbUNBQVYsQ0FBTjtBQUNELEVBQUE7O0FBRUQsRUFBQSxNQUFJLE9BQU8sU0FBUyxvQkFBVCxDQUE4QixNQUE5QixFQUFzQyxDQUF0QyxDQUFYO0FBQ0EsRUFBQSxNQUFJLE1BQU0sU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVY7QUFDQSxFQUFBLE1BQUksRUFBSixHQUFTLGFBQVQ7QUFDQSxFQUFBLE1BQUksS0FBSixDQUFVLGVBQVYsR0FBNEIsTUFBNUI7QUFD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