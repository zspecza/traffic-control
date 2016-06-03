'use strict'

// animations: http://jsbin.com/ribivetuta/edit?css,js,output

import assign from 'core-js/library/fn/object/assign'
import initialMarkup from './template.html'
import styles from './styles.css'

/**
 *
 */
class TrafficControl {
  /**
   * [constructor description]
   * @param  {[type]} opts =             {} [description]
   * @return {[type]}      [description]
   */
  constructor (opts = {}) {
    this.opts = assign({}, this._getDefaultOpts(), opts)
    this._validateOpts(this.opts)
    this._init()
  }

  /**
   * [_getDefaultOpts description]
   * @return {[type]} [description]
   */
  _getDefaultOpts () {
    return {
      stagingBranch: 'develop',
      productionBrach: 'master',
      ghAPI: 'https://api.github.com',
      containerEl: document.body
    }
  }

  /**
   * [_validateOpts description]
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   */
  _validateOpts (opts) {
    if (opts.repo == null) {
      throw new Error('You need to specify a repository.')
    }
  }

  /**
   * [_init description]
   * @return {[type]} [description]
   */
  _init () {
    this._addCss(styles)
    this.el = document.createElement('traffic-control')
    this.el.innerHTML = initialMarkup
    this.els = {
      bar: this.el.getElementsByClassName('tc-bar')[0],
      loadingMsg: this.el.getElementsByClassName('tc-message--loading')[0],
      syncedMsg: this.el.getElementsByClassName('tc-message--synchronized')[0],
      aheadMsg: this.el.getElementsByClassName('tc-message--ahead')[0],
      divergedMsg: this.el.getElementsByClassName('tc-message--diverged')[0],
      unauthedMsg: this.el.getElementsByClassName('tc-message--unauthorized')[0],
      deployBtn: this.el.getElementsByClassName('tc-action--deploy')[0],
      authBtn: this.el.getElementsByClassName('tc-action--authorize')[0],
      infoBtn: this.el.getElementsByClassName('tc-action--info')[0],
      closeBtn: this.el.getElementsByClassName('tc-close--button')[0]
    }
    this.opts.containerEl.appendChild(this.el)
    this.animateIn(this.els.bar, () => {
      this.el.classList.add('is-loading')
    })
    this.animateIn(this.els.loadingMsg)
    this.animateIn(this.els.closeBtn)
  }

  /**
   * [_addCss description]
   * @param {[type]} css [description]
   */
  _addCss (css) {
    const style = document.createElement('style')
    const head = document.head || document.getElementsByTagName('head')[0]
    style.type = 'text/css'
    if (style.styleSheet) {
      style.styleSheet.cssText = css
    } else {
      style.appendChild(document.createTextNode(css))
    }
    head.appendChild(style)
  }

  /**
   * [animateIn description]
   * @param  {[type]} el    [description]
   * @param  {[type]} after [description]
   * @return {[type]}       [description]
   */
  animateIn (el, after, delay = 0) {
    let isAnimated = false
    const startCb = () => {
      isAnimated = true
      el.removeEventListener(animationStart, startCb)
    }
    el.addEventListener(animationStart, startCb, false)
    el.classList.add('is-active')
    el.classList.add('is-entering')
    if (after && typeof after === 'function') {
      if (isAnimated) {
        const callAfter = () => {
          setTimeout(after, delay)
          el.removeEventListener(animationEnd, callAfter)
        }
        el.addEventListener(animationEnd, callAfter, false)
      } else {
        setTimeout(after, delay)
      }
    }
  }

  /**
   * [animateOut description]
   * @param  {[type]} el    [description]
   * @param  {[type]} after [description]
   * @return {[type]}       [description]
   */
  animateOut (el, after, delay = 0) {
    let isAnimated = false
    const startCb = () => {
      isAnimated = true
      el.removeEventListener(animationStart, startCb)
    }
    el.addEventListener(animationStart, startCb, false)
    el.classList.remove('is-entering')
    el.classList.add('is-leaving')
    if (isAnimated) {
      const cb = () => {
        el.classList.remove('is-leaving')
        el.classList.remove('is-active')
        if (after && typeof after === 'function') {
          setTimeout(after, 200 + delay)
        }
        el.removeEventListener(animationEnd, cb)
      }
      el.addEventListener(animationEnd, cb, false)
    } else {
      el.classList.remove('is-leaving')
      el.classList.remove('is-active')
      if (after && typeof after === 'function') {
        setTimeout(after, delay)
      }
    }
  }

}

/**
 * [description]
 * @param  {[type]} ( [description]
 * @return {[type]}   [description]
 */
var animationEnd = (() => {
  const el = document.createElement('fakeelement')
  const animations = {
    'animation': 'animationend',
    'OAnimation': 'oanimationend',
    'MozAnimation': 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd',
    'MSAnimation': 'MSAnimationEnd'
  }
  for (let t in animations) {
    if (!el.style[t] != null) {
      return animations[t]
    }
  }
})()

/**
 * [description]
 * @param  {[type]} ( [description]
 * @return {[type]}   [description]
 */
var animationStart = (() => {
  const el = document.createElement('fakeelement')
  const animations = {
    'animation': 'animationstart',
    'OAnimation': 'oanimationstart',
    'MozAnimation': 'animationstart',
    'WebkitAnimation': 'webkitAnimationStart',
    'MSAnimation': 'MSAnimationStart'
  }
  for (let t in animations) {
    if (!el.style[t] != null) {
      return animations[t]
    }
  }
})()

export default function trafficControl (opts) {

  return new TrafficControl(opts)

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
