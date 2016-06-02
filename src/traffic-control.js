'use strict'

export default function trafficControl (opts) {
  opts = opts || {}
  opts.GH_API = opts.GH_API || 'https://api.github.com'
  opts.stagingBranch = opts.stagingBranch || 'develop'
  opts.productionBranch = opts.productionBranch || 'master'

  if (opts.repo == null) {
    throw new Error('You need to specify a repository.')
  }

  var body = document.getElementsByTagName('body')[0]
  var bar = document.createElement('div')
  bar.id = 'staging-bar'
  bar.style.backgroundColor = '#eee'
  bar.style.color = '#222'
  bar.style.fontFamily = 'sans-serif'
  bar.style.padding = '16px 8px'
  bar.style.position = 'fixed'
  bar.style.top = '0'
  bar.style.width = '100%'
  bar.innerText = 'Loading...'
  body.insertBefore(bar, body.firstChild)

  function init () {
    var $ = window.$
    var localStorage = window.localStorage
    var netlify = window.netlify

    var $body = $(body)
    var $bar = $('#staging-bar')
    var $msg = $('<div />')

    function bar () {
      if (!localStorage.gh_token) {
        $bar.empty()
        var $authBtn = $('<button>Authorize</button>')
        $msg.text('You are viewing the staging site, but you cannot deploy or view changes until you authorize read/write access to your Github repository.')
        $bar.append($msg)
        $bar.css({
          backgroundColor: '#E02D2D',
          color: 'white'
        })
        $bar.append($authBtn)
        $body.prepend($bar)
        $authBtn.on('click', function () {
          netlify.authenticate({ provider: 'github', scope: 'repo' }, function (err, data) {
            if (err) {
              console.log('Error authenticating: %s', err.message)
            }
            localStorage.gh_token = data.token
            bar()
          })
        })
      } else {
        $.getJSON(opts.GH_API + '/repos/' + opts.repo + '/compare/' + opts.productionBranch + '...' + opts.stagingBranch + 'develop?access_token=' + localStorage.gh_token, function (data) {
          $bar.empty()
          var $deployBtn = $('<button>Deploy</button>')
          if (data.status === 'ahead') {
            var have = data.ahead_by > 1 ? 'have' : 'has'
            var changes = data.ahead_by > 1 ? 'changes' : 'change'
            $msg.html('You are viewing the staging site. There ' + have + ' been <a href="' + data.permalink_url + '" target="_blank">' + data.ahead_by + '</a> ' + changes + ' since the last production build. 🚢')
            $bar.append($msg)
            $bar.css({
              backgroundColor: '#B8D5E9',
              color: '#222'
            })
            $bar.append($deployBtn)
            $body.prepend($bar)
            $deployBtn.on('click', function () {
              $.post(opts.GH_API + '/repos/' + opts.repo + '/merges?access_token=' + localStorage.gh_token, JSON.stringify({
                base: 'master',
                head: 'develop',
                commit_message: ':vertical_traffic_light: Production deploy triggered from traffic-control'
              }), function () {
                bar()
              })
            })
          } else if (data.status === 'diverged') {
            var commits = data.behind_by > 1 ? 'commits' : 'commit'
            $msg.html('You are viewing the staging site. Staging has diverged behind production by <a href="' + data.permalink_url + '" target="_blank">' + data.behind_by + '</a> ' + commits + '. Please rebase.')
            $bar.append($msg)
            $bar.css({
              backgroundColor: 'orange',
              color: '#222'
            })
            $body.prepend($bar)
          } else {
            $msg.text('You are viewing the staging site. Everything is in sync, production is even with staging. 👌')
            $bar.append($msg)
            $bar.css({
              backgroundColor: '#BAE9B8',
              color: '#222'
            })
            $body.prepend($bar)
          }
        })
      }
    }
    bar()
  }

  function conditionallyLoadJQuery () {
    var jQuery = window.jQuery
    var protocol = '//'
    if (window.location.href.includes('file://')) {
      protocol = 'https://'
    }
    if (!(typeof jQuery !== 'undefined' && jQuery !== null)) {
      var jQ = document.createElement('script')
      jQ.type = 'text/javascript'
      jQ.onload = jQ.onreadystatechange = init
      jQ.src = protocol + 'code.jquery.com/jquery-2.2.4.min.js'
      return document.body.appendChild(jQ)
    } else {
      return init()
    }
  };

  if (window.addEventListener) {
    window.addEventListener('load', conditionallyLoadJQuery, false)
  } else if (window.attachEvent) {
    window.attachEvent('onload', conditionallyLoadJQuery)
  }
}
