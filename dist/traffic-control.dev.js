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
      if (!(typeof jQuery !== 'undefined' && jQuery !== null)) {
        var jQ = document.createElement('script');
        jQ.type = 'text/javascript';
        jQ.onload = jQ.onreadystatechange = init;
        jQ.src = '//code.jquery.com/jquery-2.2.4.min.js';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhZmZpYy1jb250cm9sLmRldi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3RyYWZmaWMtY29udHJvbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0cmFmZmljQ29udHJvbCAob3B0cykge1xuICBvcHRzID0gb3B0cyB8fCB7fVxuICBvcHRzLkdIX0FQSSA9IG9wdHMuR0hfQVBJIHx8ICdodHRwczovL2FwaS5naXRodWIuY29tJ1xuICBvcHRzLnN0YWdpbmdCcmFuY2ggPSBvcHRzLnN0YWdpbmdCcmFuY2ggfHwgJ2RldmVsb3AnXG4gIG9wdHMucHJvZHVjdGlvbkJyYW5jaCA9IG9wdHMucHJvZHVjdGlvbkJyYW5jaCB8fCAnbWFzdGVyJ1xuXG4gIGlmIChvcHRzLnJlcG8gPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignWW91IG5lZWQgdG8gc3BlY2lmeSBhIHJlcG9zaXRvcnkuJylcbiAgfVxuXG4gIHZhciBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXVxuICB2YXIgYmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgYmFyLmlkID0gJ3N0YWdpbmctYmFyJ1xuICBiYXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNlZWUnXG4gIGJhci5zdHlsZS5jb2xvciA9ICcjMjIyJ1xuICBiYXIuc3R5bGUuZm9udEZhbWlseSA9ICdzYW5zLXNlcmlmJ1xuICBiYXIuc3R5bGUucGFkZGluZyA9ICcxNnB4IDhweCdcbiAgYmFyLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJ1xuICBiYXIuc3R5bGUudG9wID0gJzAnXG4gIGJhci5zdHlsZS53aWR0aCA9ICcxMDAlJ1xuICBiYXIuaW5uZXJUZXh0ID0gJ0xvYWRpbmcuLi4nXG4gIGJvZHkuaW5zZXJ0QmVmb3JlKGJhciwgYm9keS5maXJzdENoaWxkKVxuXG4gIGZ1bmN0aW9uIGluaXQgKCkge1xuICAgIHZhciAkID0gd2luZG93LiRcbiAgICB2YXIgbG9jYWxTdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZVxuICAgIHZhciBuZXRsaWZ5ID0gd2luZG93Lm5ldGxpZnlcblxuICAgIHZhciAkYm9keSA9ICQoYm9keSlcbiAgICB2YXIgJGJhciA9ICQoJyNzdGFnaW5nLWJhcicpXG4gICAgdmFyICRtc2cgPSAkKCc8ZGl2IC8+JylcblxuICAgIGZ1bmN0aW9uIGJhciAoKSB7XG4gICAgICBpZiAoIWxvY2FsU3RvcmFnZS5naF90b2tlbikge1xuICAgICAgICAkYmFyLmVtcHR5KClcbiAgICAgICAgdmFyICRhdXRoQnRuID0gJCgnPGJ1dHRvbj5BdXRob3JpemU8L2J1dHRvbj4nKVxuICAgICAgICAkbXNnLnRleHQoJ1lvdSBhcmUgdmlld2luZyB0aGUgc3RhZ2luZyBzaXRlLCBidXQgeW91IGNhbm5vdCBkZXBsb3kgb3IgdmlldyBjaGFuZ2VzIHVudGlsIHlvdSBhdXRob3JpemUgcmVhZC93cml0ZSBhY2Nlc3MgdG8geW91ciBHaXRodWIgcmVwb3NpdG9yeS4nKVxuICAgICAgICAkYmFyLmFwcGVuZCgkbXNnKVxuICAgICAgICAkYmFyLmNzcyh7XG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI0UwMkQyRCcsXG4gICAgICAgICAgY29sb3I6ICd3aGl0ZSdcbiAgICAgICAgfSlcbiAgICAgICAgJGJhci5hcHBlbmQoJGF1dGhCdG4pXG4gICAgICAgICRib2R5LnByZXBlbmQoJGJhcilcbiAgICAgICAgJGF1dGhCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIG5ldGxpZnkuYXV0aGVudGljYXRlKHsgcHJvdmlkZXI6ICdnaXRodWInLCBzY29wZTogJ3JlcG8nIH0sIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGF1dGhlbnRpY2F0aW5nOiAlcycsIGVyci5tZXNzYWdlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmdoX3Rva2VuID0gZGF0YS50b2tlblxuICAgICAgICAgICAgYmFyKClcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJC5nZXRKU09OKG9wdHMuR0hfQVBJICsgJy9yZXBvcy8nICsgb3B0cy5yZXBvICsgJy9jb21wYXJlLycgKyBvcHRzLnByb2R1Y3Rpb25CcmFuY2ggKyAnLi4uJyArIG9wdHMuc3RhZ2luZ0JyYW5jaCArICdkZXZlbG9wP2FjY2Vzc190b2tlbj0nICsgbG9jYWxTdG9yYWdlLmdoX3Rva2VuLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICRiYXIuZW1wdHkoKVxuICAgICAgICAgIHZhciAkZGVwbG95QnRuID0gJCgnPGJ1dHRvbj5EZXBsb3k8L2J1dHRvbj4nKVxuICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ2FoZWFkJykge1xuICAgICAgICAgICAgdmFyIGhhdmUgPSBkYXRhLmFoZWFkX2J5ID4gMSA/ICdoYXZlJyA6ICdoYXMnXG4gICAgICAgICAgICB2YXIgY2hhbmdlcyA9IGRhdGEuYWhlYWRfYnkgPiAxID8gJ2NoYW5nZXMnIDogJ2NoYW5nZSdcbiAgICAgICAgICAgICRtc2cuaHRtbCgnWW91IGFyZSB2aWV3aW5nIHRoZSBzdGFnaW5nIHNpdGUuIFRoZXJlICcgKyBoYXZlICsgJyBiZWVuIDxhIGhyZWY9XCInICsgZGF0YS5wZXJtYWxpbmtfdXJsICsgJ1wiIHRhcmdldD1cIl9ibGFua1wiPicgKyBkYXRhLmFoZWFkX2J5ICsgJzwvYT4gJyArIGNoYW5nZXMgKyAnIHNpbmNlIHRoZSBsYXN0IHByb2R1Y3Rpb24gYnVpbGQuIPCfmqInKVxuICAgICAgICAgICAgJGJhci5hcHBlbmQoJG1zZylcbiAgICAgICAgICAgICRiYXIuY3NzKHtcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI0I4RDVFOScsXG4gICAgICAgICAgICAgIGNvbG9yOiAnIzIyMidcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAkYmFyLmFwcGVuZCgkZGVwbG95QnRuKVxuICAgICAgICAgICAgJGJvZHkucHJlcGVuZCgkYmFyKVxuICAgICAgICAgICAgJGRlcGxveUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICQucG9zdChvcHRzLkdIX0FQSSArICcvcmVwb3MvJyArIG9wdHMucmVwbyArICcvbWVyZ2VzP2FjY2Vzc190b2tlbj0nICsgbG9jYWxTdG9yYWdlLmdoX3Rva2VuLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgYmFzZTogJ21hc3RlcicsXG4gICAgICAgICAgICAgICAgaGVhZDogJ2RldmVsb3AnLFxuICAgICAgICAgICAgICAgIGNvbW1pdF9tZXNzYWdlOiAnOnZlcnRpY2FsX3RyYWZmaWNfbGlnaHQ6IFByb2R1Y3Rpb24gZGVwbG95IHRyaWdnZXJlZCBmcm9tIHRyYWZmaWMtY29udHJvbCdcbiAgICAgICAgICAgICAgfSksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBiYXIoKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEuc3RhdHVzID09PSAnZGl2ZXJnZWQnKSB7XG4gICAgICAgICAgICB2YXIgY29tbWl0cyA9IGRhdGEuYmVoaW5kX2J5ID4gMSA/ICdjb21taXRzJyA6ICdjb21taXQnXG4gICAgICAgICAgICAkbXNnLmh0bWwoJ1lvdSBhcmUgdmlld2luZyB0aGUgc3RhZ2luZyBzaXRlLiBTdGFnaW5nIGhhcyBkaXZlcmdlZCBiZWhpbmQgcHJvZHVjdGlvbiBieSA8YSBocmVmPVwiJyArIGRhdGEucGVybWFsaW5rX3VybCArICdcIiB0YXJnZXQ9XCJfYmxhbmtcIj4nICsgZGF0YS5iZWhpbmRfYnkgKyAnPC9hPiAnICsgY29tbWl0cyArICcuIFBsZWFzZSByZWJhc2UuJylcbiAgICAgICAgICAgICRiYXIuYXBwZW5kKCRtc2cpXG4gICAgICAgICAgICAkYmFyLmNzcyh7XG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ29yYW5nZScsXG4gICAgICAgICAgICAgIGNvbG9yOiAnIzIyMidcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAkYm9keS5wcmVwZW5kKCRiYXIpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRtc2cudGV4dCgnWW91IGFyZSB2aWV3aW5nIHRoZSBzdGFnaW5nIHNpdGUuIEV2ZXJ5dGhpbmcgaXMgaW4gc3luYywgcHJvZHVjdGlvbiBpcyBldmVuIHdpdGggc3RhZ2luZy4g8J+RjCcpXG4gICAgICAgICAgICAkYmFyLmFwcGVuZCgkbXNnKVxuICAgICAgICAgICAgJGJhci5jc3Moe1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjQkFFOUI4JyxcbiAgICAgICAgICAgICAgY29sb3I6ICcjMjIyJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICRib2R5LnByZXBlbmQoJGJhcilcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICAgIGJhcigpXG4gIH1cblxuICBmdW5jdGlvbiBjb25kaXRpb25hbGx5TG9hZEpRdWVyeSAoKSB7XG4gICAgdmFyIGpRdWVyeSA9IHdpbmRvdy5qUXVlcnlcbiAgICBpZiAoISh0eXBlb2YgalF1ZXJ5ICE9PSAndW5kZWZpbmVkJyAmJiBqUXVlcnkgIT09IG51bGwpKSB7XG4gICAgICB2YXIgalEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxuICAgICAgalEudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnXG4gICAgICBqUS5vbmxvYWQgPSBqUS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBpbml0XG4gICAgICBqUS5zcmMgPSAnLy9jb2RlLmpxdWVyeS5jb20vanF1ZXJ5LTIuMi40Lm1pbi5qcydcbiAgICAgIHJldHVybiBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGpRKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaW5pdCgpXG4gICAgfVxuICB9O1xuXG4gIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgY29uZGl0aW9uYWxseUxvYWRKUXVlcnksIGZhbHNlKVxuICB9IGVsc2UgaWYgKHdpbmRvdy5hdHRhY2hFdmVudCkge1xuICAgIHdpbmRvdy5hdHRhY2hFdmVudCgnb25sb2FkJywgY29uZGl0aW9uYWxseUxvYWRKUXVlcnkpXG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7RUFBZSxTQUFTLGNBQVQsQ0FBeUIsSUFBekIsRUFBK0I7QUFDNUMsRUFBQSxTQUFPLFFBQVEsRUFBZjtBQUNBLEVBQUEsT0FBSyxNQUFMLEdBQWMsS0FBSyxNQUFMLElBQWUsd0JBQTdCO0FBQ0EsRUFBQSxPQUFLLGFBQUwsR0FBcUIsS0FBSyxhQUFMLElBQXNCLFNBQTNDO0FBQ0EsRUFBQSxPQUFLLGdCQUFMLEdBQXdCLEtBQUssZ0JBQUwsSUFBeUIsUUFBakQ7O0FBRUEsRUFBQSxNQUFJLEtBQUssSUFBTCxJQUFhLElBQWpCLEVBQXVCO0FBQ3JCLEVBQUEsVUFBTSxJQUFJLEtBQUosQ0FBVSxtQ0FBVixDQUFOO0FBQ0QsRUFBQTs7QUFFRCxFQUFBLE1BQUksT0FBTyxTQUFTLG9CQUFULENBQThCLE1BQTlCLEVBQXNDLENBQXRDLENBQVg7QUFDQSxFQUFBLE1BQUksTUFBTSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBVjtBQUNBLEVBQUEsTUFBSSxFQUFKLEdBQVMsYUFBVDtBQUNBLEVBQUEsTUFBSSxLQUFKLENBQVUsZUFBVixHQUE0QixNQUE1QjtBQUNBLEVBQUEsTUFBSSxLQUFKLENBQVUsS0FBVixHQUFrQixNQUFsQjtBQUNBLEVBQUEsTUFBSSxLQUFKLENBQVUsVUFBVixHQUF1QixZQUF2QjtBQUNBLEVBQUEsTUFBSSxLQUFKLENBQVUsT0FBVixHQUFvQixVQUFwQjtBQUNBLEVBQUEsTUFBSSxL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