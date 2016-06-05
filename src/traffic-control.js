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
    this.opts = Object.assign({}, this.getDefaultOpts(), opts)
    this.opts.repoURL = `${this.opts.ghAPI}/repos/${this.opts.repo}`
    this.opts.compareURL = `${this.opts.repoURL}/compare`
    this.opts.compareBranchesURL = `${this.opts.compareURL}/${this.opts.productionBranch}...${this.opts.stagingBranch}`
    this.validateOpts(this.opts)
    this.init()
  }

  /**
   * [_getDefaultOpts description]
   * @return {[type]} [description]
   */
  getDefaultOpts () {
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
  validateOpts (opts) {
    if (opts.repo == null) {
      throw new Error('You need to specify a repository.')
    }
  }

  /**
   * [_init description]
   * @return {[type]} [description]
   */
  init () {
    addCss(styles)
    this.initializeElementWithMarkup()
    this.instantiateElementWithDefaultState()
      .then(() => this.authenticateAndRenderState())
  }

  /**
   * [_initializeElementWithMarkup description]
   * @return {[type]} [description]
   */
  initializeElementWithMarkup () {
    this.el = document.createElement('traffic-control')
    this.el.id = 'traffic-control'
    this.el.innerHTML = initialMarkup
    this.addDomRefs()
    this.els.instructionMsg.innerHTML = `
      git checkout ${this.opts.stagingBranch} &&
      git pull -r origin ${this.opts.productionBranch} &&
      git push origin ${this.opts.stagingBranch} --force
    `
    this.addEventHooks()
    this.addStates()
  }

  /**
   * [_addDomRefs description]
   */
  addDomRefs () {
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
      successBtn: 'tc-action--success',
      closeBtn: 'tc-close--button'
    })
  }

  /**
   * [_addEventHooks description]
   */
  addEventHooks () {
    on(this.els.infoBtn, 'click', () => {
      this.unRenderState('diverged').then(() => this.renderState('instruction'))
    })
    on(this.els.okBtn, 'click', () => {
      this.unRenderState('instruction').then(() => this.renderState('diverged'))
    })
    on(this.els.closeBtn, 'click', () => {
      this.unRenderState('mounted')
    })
    on(this.els.authBtn, 'click', () => {
      netlify.authenticate({ provider: 'github', scope: 'repo' }, (error, data) => {
        if (error) {
          const msg = error.err ? error.err.message : error.message
          throw new Error(`Error authenticating: ${msg}`)
        }
        localStorage.gh_token = data.token
        this.authenticateAndRenderState()
      })
    })
    on(this.els.conflictBtn, 'click', () => {
      this.authenticateAndRenderState()
    })
    on(this.els.successBtn, 'click', () => {
      this.authenticateAndRenderState()
    })
    on(this.els.deployBtn, 'click', () => {
      this.unRenderState('ahead')
        .then(() => this.renderState('loading'))
        .then(() => {
          return window.fetch(`${this.opts.repoURL}/merges?access_token=${localStorage.gh_token}`, {
            method: 'POST',
            body: JSON.stringify({
              base: this.opts.productionBranch,
              head: this.opts.stagingBranch,
              commit_message: ':vertical_traffic_light: Production deploy triggered from traffic-control'
            })
          })
        })
        .then((response) => {
          if (response.status === 201) {
            return this.unRenderState('loading').then(() => this.renderState('success'))
          } else if (response.status === 409) {
            return this.unRenderState('loading').then(() => this.renderState('conflict'))
          }
        })
    })
  }

  /**
   * [_addStates description]
   */
  addStates () {
    this.states = {
      mounted: [this.els.bar],
      loading: [this.els.loadingMsg, this.els.closeBtn],
      unauthorized: [this.els.unauthedMsg, this.els.authBtn, this.els.closeBtn],
      ahead: [this.els.aheadMsg, this.els.deployBtn, this.els.closeBtn],
      diverged: [this.els.divergedMsg, this.els.infoBtn, this.els.closeBtn],
      synchronized: [this.els.syncedMsg, this.els.closeBtn],
      instruction: [this.els.instructionMsg, this.els.okBtn, this.els.closeBtn],
      conflict: [this.els.conflictMsg, this.els.conflictBtn, this.els.closeBtn],
      success: [this.els.successMsg, this.els.successBtn, this.els.closeBtn]
    }
  }

  /**
   * [_referenceInnerDOM description]
   * @param  {[type]} classes [description]
   * @return {[type]}         [description]
   */
  getDOMReferences (classes) {
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
  instantiateElementWithDefaultState () {
    this.opts.containerEl.appendChild(this.el)
    return this.renderState('mounted').then(() => this.renderState('loading'))
  }

  /**
   * [_authenticateAndInitialize description]
   * @return {[type]} [description]
   */
  authenticateAndRenderState () {
    const localStorage = window.localStorage
    const netlify = window.netlify
    if (!localStorage.gh_token) {
      // fake some loading time
      return this.unRenderState('loading').then(() => this.renderState('unauthorized'))
    } else {
      if (hasClass(this.el, 'is-success')) {
        this.unRenderState('success').then(() => this.renderState('loading'))
      }
      if (hasClass(this.el, 'is-conflict')) {
        this.unRenderState('conflict').then(() => this.renderState('loading'))
      }
      if (hasClass(this.el, 'is-unauthorized')) {
        this.unRenderState('unauthorized').then(() => this.renderState('loading'))
      }
      return window.fetch(`${this.opts.compareBranchesURL}?access_token=${localStorage.gh_token}`)
        .then((r) => r.json())
        .then(({ status, ahead_by, behind_by, permalink_url }) => {
          // a deploy is required
          if (status === 'ahead') {
            this.els.aheadMsg.innerHTML = this.getAheadMessage(ahead_by, permalink_url)
            return this.unRenderState('loading').then(() => this.renderState('ahead'))
          // a rebase is required
          } else if (status === 'diverged') {
            this.els.divergedMsg.innerHTML = this.getDivergedMessage(behind_by, permalink_url)
            return this.unRenderState('loading').then(() => this.renderState('diverged'))
          // we're in-sync! hooray!
          } else {
            return this.unRenderState('loading').then(() => this.renderState('synchronized'))
          }
        })
    }
  }

  /**
   * [_renderState description]
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  renderState(state) {
    addClass(this.el, `is-${state}`)
    return this.animateIn(...this.states[state])
  }

  /**
   * [_unRenderState description]
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  unRenderState(state) {
    return this.animateOut(...this.states[state])
      .then(() => removeClass(this.el, `is-${state}`))
  }

  /**
   * [_getAheadMessage description]
   * @param  {[type]} count [description]
   * @param  {[type]} link  [description]
   * @return {[type]}       [description]
   */
  getAheadMessage (count, link) {
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
  getDivergedMessage (count, link) {
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
    return Promise.all(els.map((el) => new Promise((resolve) => {
      once(el, animationEnd, resolve)
      addClassesInSequence(el, 'is-active', 'is-entering')
    })))
  }

  /**
   * [animateOut description]
   * @param  {[type]} el    [description]
   * @param  {[type]} after [description]
   * @return {[type]}       [description]
   */
  animateOut (...els) {
    return Promise.all(els.map((el) => new Promise((resolve) => {
      once(el, animationEnd, () => {
        removeClassesInSequence(el, 'is-leaving', 'is-active')
        resolve()
      })
      removeClass(el, 'is-entering')
      addClass(el, 'is-leaving')
    })))
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

// export default function trafficControl (opts) {
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
//         $.getJSON(opts.GH_API + '/repos/' + opts.repo + '/compare/' + opts.productionBranch + '...' + opts.stagingBranch + '?access_token=' + localStorage.gh_token, function (data) {
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
//                 base: opts.productionBranch,
//                 head: opts.stagingBranch,
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
