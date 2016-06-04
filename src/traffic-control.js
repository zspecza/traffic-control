'use strict'

/* polyfills */
import 'whatwg-fetch'
import 'core-js/fn/object/assign'
import 'core-js/fn/promise'

/* component HTML & css */
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
    this.opts = Object.assign({}, this._getDefaultOpts(), opts)
    this.opts.repoURL = `${this.opts.ghAPI}/repos/${this.opts.repo}`
    this.opts.compareURL = `${this.opts.repoURL}/compare`
    this.opts.compareBranchesURL = `${this.opts.compareURL}/${this.opts.productionBranch}...${this.opts.stagingBranch}`
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
      productionBranch: 'master',
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
    addCss(styles)
    this._initializeElementWithMarkup()
    this._instantiateElementWithDefaultState()
    this._authenticateAndRenderState()
  }

  /**
   * [_initializeElementWithMarkup description]
   * @return {[type]} [description]
   */
  _initializeElementWithMarkup () {
    this.el = document.createElement('traffic-control')
    this.el.id = 'traffic-control'
    this.el.innerHTML = initialMarkup
    this._addDomRefs()
    this.els.instructionMsg.innerHTML = `
      git checkout ${this.opts.stagingBranch} &&
      git pull -r origin ${this.opts.productionBranch} &&
      git push origin ${this.opts.stagingBranch}
    `
    this._addEventHooks()
    this._addStates()
  }

  /**
   * [_addDomRefs description]
   */
  _addDomRefs () {
    this.els = this._getDOMReferences({
      bar: 'tc-bar',
      loadingMsg: 'tc-message--loading',
      syncedMsg: 'tc-message--synchronized',
      aheadMsg: 'tc-message--ahead',
      divergedMsg: 'tc-message--diverged',
      unauthedMsg: 'tc-message--unauthorized',
      instructionMsg: 'tc-message--instruction',
      deployBtn: 'tc-action--deploy',
      authBtn: 'tc-action--authorize',
      infoBtn: 'tc-action--info',
      okBtn: 'tc-action--ok',
      closeBtn: 'tc-close--button'
    })
  }

  /**
   * [_addEventHooks description]
   */
  _addEventHooks () {
    on(this.els.infoBtn, 'click', () => {
      delay(0)
        .then(this._unRenderState('diverged'))
        .then(this._renderState('instruction'))
    })
    on(this.els.okBtn, 'click', () => {
      delay(0)
        .then(this._unRenderState('instruction'))
        .then(this._renderState('diverged'))
    })
  }

  /**
   * [_addStates description]
   */
  _addStates () {
    this.states = {
      mounted: [this.els.bar],
      loading: [this.els.loadingMsg, this.els.closeBtn],
      unauthorized: [this.els.unauthedMsg, this.els.authBtn, this.els.closeBtn],
      ahead: [this.els.aheadMsg, this.els.deployBtn, this.els.closeBtn],
      diverged: [this.els.divergedMsg, this.els.infoBtn, this.els.closeBtn],
      synchronized: [this.els.syncedMsg, this.els.closeBtn],
      instruction: [this.els.instructionMsg, this.els.okBtn, this.els.closeBtn]
    }
  }

  /**
   * [_referenceInnerDOM description]
   * @param  {[type]} classes [description]
   * @return {[type]}         [description]
   */
  _getDOMReferences (classes) {
    let o = {}
    for (let el in classes) {
      if (classes.hasOwnProperty(el)) {
        o[el] = this.el.getElementsByClassName(classes[el])[0]
      }
    }
    return o
  }

  /**
   * [_instantiateElement description]
   * @return {[type]} [description]
   */
  _instantiateElementWithDefaultState () {
    this.opts.containerEl.appendChild(this.el)
    delay(0)
      .then(this._renderState('mounted'))
      .then(this._renderState('loading'))
  }

  /**
   * [_authenticateAndInitialize description]
   * @return {[type]} [description]
   */
  _authenticateAndRenderState () {
    const localStorage = window.localStorage
    const netlify = window.netlify
    if (!localStorage.gh_token) {
      // fake some loading time
      delay(1500)
        .then(this._unRenderState('loading'))
        .then(this._renderState('unauthorized'))
      on(this.els.authBtn, 'click', () => {
        netlify.authenticate({ provider: 'github', scope: 'repo' }, (error, data) => {
          if (error) {
            const msg = error.err ? error.err.message : error.message
            throw new Error(`Error authenticating: ${msg}`)
          }
          localStorage.gh_token = data.token
          this._authenticateAndRenderState()
        })
      })
    } else {
      if (hasClass(this.el, 'is-unauthorized')) {
        delay(500)
          .then(this._unRenderState('unauthorized'))
          .then(this._renderState('loading'))
      }
      fetch(`${this.opts.compareBranchesURL}?access_token=${localStorage.gh_token}`)
        .then((r) => r.json())
        .then(({ status, ahead_by, behind_by, permalink_url }) => {
          // a deploy is required
          if (status === 'ahead') {
            this.els.aheadMsg.innerHTML = this._getAheadMessage(ahead_by, permalink_url)
            delay(1500)
              .then(this._unRenderState('loading'))
              .then(this._renderState('ahead'))
          // a rebase is required
          } else if (status === 'diverged') {
            this.els.divergedMsg.innerHTML = this._getDivergedMessage(behind_by, permalink_url)
            delay(1500)
              .then(this._unRenderState('loading'))
              .then(this._renderState('diverged'))
          // we're in-sync! hooray!
          } else {
            delay(1500)
              .then(this._unRenderState('loading'))
              .then(this._renderState('synchronized'))
          }
        })
    }
  }

  /**
   * [_renderState description]
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  _renderState(state) {
    return () => new Promise((resolve) => {
      addClass(this.el, `is-${state}`)
      this.animateIn(...this.states[state], resolve)
    })
  }

  /**
   * [_unRenderState description]
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  _unRenderState(state) {
    return () => new Promise((resolve) => {
      this.animateOut(...this.states[state], () => {
        removeClass(this.el, `is-${state}`)
        resolve()
      })
    })
  }

  /**
   * [_getAheadMessage description]
   * @param  {[type]} count [description]
   * @param  {[type]} link  [description]
   * @return {[type]}       [description]
   */
  _getAheadMessage (count, link) {
    return `
      You are viewing the staging site.
      There ${count > 1 ? 'have' : 'has'} been
      <a href="${link}" target="_blank">${count}</a>
      ${count > 1 ? 'changes' : 'change'} since the last production build. 🚢
    `
  }

  /**
   * [_getDivergedMessage description]
   * @param  {[type]} count [description]
   * @param  {[type]} link  [description]
   * @return {[type]}       [description]
   */
  _getDivergedMessage (count, link) {
    return `
      You are viewing the staging site.
      Staging has diverged behind production by
      <a href="${link}" target="_blank">${count}</a>
      ${count > 1 ? 'commits' : 'commit'}. Please rebase.
    `
  }

  /**
   * [animateIn description]
   * @param  {[type]} el    [description]
   * @param  {[type]} after [description]
   * @return {[type]}       [description]
   */
  animateIn (...els) {
    let after = () => {}
    if (typeof els[els.length - 1] === 'function') {
      after = els.pop()
    }
    for (let i = 0, len = els.length; i < len; i++) {
      let el = els[i]
      let isAnimated = false
      once(el, animationStart, () => isAnimated = true)
      addClassesInSequence(el, 'is-active', 'is-entering')
      if (isAnimated) {
        once(el, animationEnd, () => delay(0).then(after))
      } else {
        delay(0).then(after)
      }
    }
  }

  /**
   * [animateOut description]
   * @param  {[type]} el    [description]
   * @param  {[type]} after [description]
   * @return {[type]}       [description]
   */
  animateOut (...els) {
    let after = () => {}
    if (typeof els[els.length - 1] === 'function') {
      after = els.pop()
    }
    for (let i = 0, len = els.length; i < len; i++) {
      let el = els[i]
      let isAnimated = false
      removeClass(el, 'is-entering')
      once(el, animationStart, () => isAnimated = true)
      once(el, animationEnd, () => {
        removeClassesInSequence(el, 'is-leaving', 'is-active')
        delay(200).then(after)
      })
      addClass(el, 'is-leaving')
      // delay prevents isAnimation check being called before isAnimation is resolved... could be improved
      delay(50).then(() => {
        if (!isAnimated) {
          removeClassesInSequence(el, 'is-leaving', 'is-active')
          delay(0).then(after)
        }
      })
    }
  }

}

/**
 * [delay description]
 * @param  {[type]} ms [description]
 * @return {[type]}    [description]
 */
function delay (ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

/**
 * [_addCss description]
 * @param {[type]} css [description]
 */
function addCss (css) {
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
 * [hasClass description]
 * @param  {[type]}  el            [description]
 * @param  {[type]}  ...classNames [description]
 * @return {Boolean}               [description]
 */
function hasClass (el, ...classNames) {
  return el.classList.contains(...classNames)
}

/**
 * [addClass description]
 * @param {[type]} el            [description]
 * @param {[type]} ...classNames [description]
 */
function addClass (el, ...classNames) {
  el.classList.add(...classNames)
}

/**
 * [addClassesInSequence description]
 * @param {[type]} el            [description]
 * @param {[type]} ...classNames [description]
 */
function addClassesInSequence (el, ...classNames) {
  for (let i = 0, len = classNames.length; i < len; i++) {
    addClass(el, classNames[i])
  }
}

/**
 * [removeClass description]
 * @param  {[type]} el            [description]
 * @param  {[type]} ...classNames [description]
 * @return {[type]}               [description]
 */
function removeClass (el, ...classNames) {
  el.classList.remove(...classNames)
}

/**
 * [addClassesInSequence description]
 * @param {[type]} el            [description]
 * @param {[type]} ...classNames [description]
 */
function removeClassesInSequence (el, ...classNames) {
  for (let i = 0, len = classNames.length; i < len; i++) {
    removeClass(el, classNames[i])
  }
}

/**
 * [on description]
 * @param  {[type]} el        [description]
 * @param  {[type]} eventName [description]
 * @param  {[type]} func      [description]
 * @return {[type]}           [description]
 */
function on (el, eventName, func) {
  el.addEventListener(eventName, func, false)
}

/**
 * [off description]
 * @param  {[type]} el        [description]
 * @param  {[type]} eventName [description]
 * @param  {[type]} func      [description]
 * @return {[type]}           [description]
 */
function off (el, eventName, func) {
  el.removeEventListener(eventName, func)
}

/**
 * [addOneEventListener description]
 * @param {[type]} el        [description]
 * @param {[type]} eventName [description]
 * @param {[type]} func      [description]
 */
function once (el, eventName, func) {
  const cb = (...args) => {
    func(...args)
    off(el, eventName, cb)
  }
  on(el, eventName, cb)
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

/**
 * [trafficControl description]
 * @param  {[type]} opts [description]
 * @return {[type]}      [description]
 */
export default function trafficControl (opts) {
  let netlify = window.netlify

  /**
   * [description]
   * @return {[type]} [description]
   */
  const init = () => {
    return new TrafficControl(opts)
  }

  /**
   * [description]
   * @return {[type]} [description]
   */
  const conditionallyLoadNetlify = () => {
    if (netlify == null) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.onload = script.onreadystatechange = init
      script.src = 'https://app.netlify.com/authentication.js'
      return document.body.appendChild(script)
    } else {
      return init()
    }
  }

  if (window.addEventListener) {
    window.addEventListener('load', conditionallyLoadNetlify, false)
  } else if (window.attachEvent) {
    window.attachEvent('onload', conditionallyLoadNetlify)
  }
}

// function trafficControl2 (opts) {
//
//   opts = opts || {}
//   opts.GH_API = opts.GH_API || 'https://api.github.com'
//   opts.stagingBranch = opts.stagingBranch || 'develop'
//   opts.productionBranch = opts.productionBranch || 'master'
//
//   if (opts.repo == null) {
//     throw new Error('You need to specify a repository.')
//   }
//
//   var body = document.getElementsByTagName('body')[0]
//   var bar = document.createElement('div')
//   bar.id = 'staging-bar'
//   bar.style.backgroundColor = '#eee'
//   bar.style.color = '#222'
//   bar.style.fontFamily = 'sans-serif'
//   bar.style.padding = '16px 8px'
//   bar.style.position = 'fixed'
//   bar.style.top = '0'
//   bar.style.width = '100%'
//   bar.innerText = 'Loading...'
//   body.insertBefore(bar, body.firstChild)
//
//   function init () {
//     var $ = window.$
//     var localStorage = window.localStorage
//     var netlify = window.netlify
//
//     var $body = $(body)
//     var $bar = $('#staging-bar')
//     var $msg = $('<div />')
//
//     function bar () {
//       if (!localStorage.gh_token) {
//         $bar.empty()
//         var $authBtn = $('<button>Authorize</button>')
//         $msg.text('You are viewing the staging site, but you cannot deploy or view changes until you authorize read/write access to your Github repository.')
//         $bar.append($msg)
//         $bar.css({
//           backgroundColor: '#E02D2D',
//           color: 'white'
//         })
//         $bar.append($authBtn)
//         $body.prepend($bar)
//         $authBtn.on('click', function () {
//           netlify.authenticate({ provider: 'github', scope: 'repo' }, function (err, data) {
//             if (err) {
//               console.log('Error authenticating: %s', err.message)
//             }
//             localStorage.gh_token = data.token
//             bar()
//           })
//         })
//       } else {
//         $.getJSON(opts.GH_API + '/repos/' + opts.repo + '/compare/' + opts.productionBranch + '...' + opts.stagingBranch + 'develop?access_token=' + localStorage.gh_token, function (data) {
//           $bar.empty()
//           var $deployBtn = $('<button>Deploy</button>')
//           if (data.status === 'ahead') {
//             var have = data.ahead_by > 1 ? 'have' : 'has'
//             var changes = data.ahead_by > 1 ? 'changes' : 'change'
//             $msg.html('You are viewing the staging site. There ' + have + ' been <a href="' + data.permalink_url + '" target="_blank">' + data.ahead_by + '</a> ' + changes + ' since the last production build. 🚢')
//             $bar.append($msg)
//             $bar.css({
//               backgroundColor: '#B8D5E9',
//               color: '#222'
//             })
//             $bar.append($deployBtn)
//             $body.prepend($bar)
//             $deployBtn.on('click', function () {
//               $.post(opts.GH_API + '/repos/' + opts.repo + '/merges?access_token=' + localStorage.gh_token, JSON.stringify({
//                 base: 'master',
//                 head: 'develop',
//                 commit_message: ':vertical_traffic_light: Production deploy triggered from traffic-control'
//               }), function () {
//                 bar()
//               })
//             })
//           } else if (data.status === 'diverged') {
//             var commits = data.behind_by > 1 ? 'commits' : 'commit'
//             $msg.html('You are viewing the staging site. Staging has diverged behind production by <a href="' + data.permalink_url + '" target="_blank">' + data.behind_by + '</a> ' + commits + '. Please rebase.')
//             $bar.append($msg)
//             $bar.css({
//               backgroundColor: 'orange',
//               color: '#222'
//             })
//             $body.prepend($bar)
//           } else {
//             $msg.text('You are viewing the staging site. Everything is in sync, production is even with staging. 👌')
//             $bar.append($msg)
//             $bar.css({
//               backgroundColor: '#BAE9B8',
//               color: '#222'
//             })
//             $body.prepend($bar)
//           }
//         })
//       }
//     }
//     bar()
//   }
//
//   function conditionallyLoadJQuery () {
//     var jQuery = window.jQuery
//     var protocol = '//'
//     if (window.location.href.includes('file://')) {
//       protocol = 'https://'
//     }
//     if (!(typeof jQuery !== 'undefined' && jQuery !== null)) {
//       var jQ = document.createElement('script')
//       jQ.type = 'text/javascript'
//       jQ.onload = jQ.onreadystatechange = init
//       jQ.src = protocol + 'code.jquery.com/jquery-2.2.4.min.js'
//       return document.body.appendChild(jQ)
//     } else {
//       return init()
//     }
//   };
//
//   if (window.addEventListener) {
//     window.addEventListener('load', conditionallyLoadJQuery, false)
//   } else if (window.attachEvent) {
//     window.attachEvent('onload', conditionallyLoadJQuery)
//   }
// }
