'use strict'

/* component HTML & css */
import initialMarkup from './template.html'
import styles from './styles.css'

/* modules */
import on from './on'
import addCSS from './addCSS'
import hasClass from './hasClass'
import addClass from './addClass'
import removeClass from './removeClass'
import getJSON from './getJSON'
import postJSON from './postJSON'
import AnimationEngine from './animation-engine'

const animator = new AnimationEngine()
const netlify = window.netlify
const localStorage = window.localStorage

/**
 * @class TrafficControl
 * @classdesc adds a bar to a website that allows one-click deploys
 */
export default class TrafficControl {
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
  constructor (opts = {}) {
    opts = Object.assign({}, this.getDefaultOpts(), opts)
    opts.repoURL = `${opts.ghAPI}/repos/${opts.repo}`
    opts.compareURL = `${opts.repoURL}/compare`
    opts.compareBranchesURL = `${opts.compareURL}/${opts.productionBranch}...${opts.stagingBranch}`
    this.opts = this.validateOpts(opts)
    this.init()
  }

  /**
   * Simply returns default settings.
   * @return {Object} - the default settings for traffic-control
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
   * Validates user-supplied options.
   * Throws on invalid options.
   * @param  {Object} opts - the options to validate
   * @return {Object}      - if validation is passed, the original options.
   */
  validateOpts (opts) {
    if (opts.repo == null) {
      throw new Error('You need to specify a repository.')
    }
    return opts
  }

  /**
   * Initializes traffic-control. Adds necessary CSS to the page and fills
   * default UI with necessary markup.
   */
  init () {
    addCSS(styles)
    this.initializeElementWithMarkup()
    this.instantiateElementWithDefaultState()
      .then(() => this.computeAndAnimateState())
      .catch((error) => console.error(error))
  }

  /**
   * Creates the initial element, registers events and fills
   * necessary text.
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
   * Registers `traffic-control` related DOM elements.
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
      closeBtn: 'tc-close--button'
    })
  }

  /**
   * Registers a state with `traffic-control`. A state is
   * a different variation of UI.
   * @param {String}                    name - name of the state
   * @param {Object|Array<HTMLElement>} opts - a list of this state's elements or an object containing a `ui` list and a `persist` boolean. Persistence protects the el from being hidden/removed.
   */
  addState (name, opts) {
    let state
    this.states = this.states || {}
    if (Array.isArray(opts)) {
      state = { ui: opts }
    } else {
      state = opts
    }
    state.ui = state.ui.map((el) => this.els[el])
    this.states[name] = state
  }

  /**
   * Registers all of `traffic-control`'s default states.
   */
  addStates () {
    this.addState('mounted', {
      ui: ['bar'],
      persist: true
    })
    this.addState('loading', ['loadingMsg', 'closeBtn'])
    this.addState('unauthorized', ['unauthedMsg', 'authBtn', 'closeBtn'])
    this.addState('ahead', ['aheadMsg', 'deployBtn', 'closeBtn'])
    this.addState('diverged', ['divergedMsg', 'infoBtn', 'closeBtn'])
    this.addState('synchronized', ['syncedMsg', 'closeBtn'])
    this.addState('instruction', ['instructionMsg', 'okBtn', 'closeBtn'])
    this.addState('conflict', ['conflictMsg', 'conflictBtn', 'closeBtn'])
    this.addState('success', ['successMsg', 'closeBtn'])
  }

  /**
   * Registers interaction events.
   */
  addEventHooks () {
    on(this.els.infoBtn, 'click', () => this.renderState('instruction'))
    on(this.els.okBtn, 'click', () => this.renderState('diverged'))
    on(this.els.closeBtn, 'click', () => this.unRenderState('mounted'))
    on(this.els.authBtn, 'click', () => this.authenticateGithub()
      .then(({ token }) => {
        localStorage.gh_token = token
        return this.computeAndAnimateState()
      })
      .catch((error) => console.error(error))
    )
    on(this.els.conflictBtn, 'click', () => this.computeAndAnimateState())
    on(this.els.deployBtn, 'click', () => {
      this.renderState('loading')
        .then(() => this.merge())
        .then((data) => this.renderMergeStatus(data))
        .catch((error) => console.error(error))
    })
  }

  /**
   * Called when `deploy` is clicked, renders the state of the deploy.
   * i.e. was it a success or were there conflicts?
   * @param  {Object} response        - the response from the git remote
   * @param  {Number} response.status - the response status code
   * @return {Promise}                - a promise for the rendered state
   */
  renderMergeStatus ({ status }) {
    if (status === 201) {
      return this.renderState('success')
        .then(() => this.computeAndAnimateState())
    } else if (status === 409) {
      return this.renderState('conflict')
    }
  }

  /**
   * Triggers a deploy from staging to production.
   * @return {Promise} - a promise for the merge response.
   */
  merge () {
    return postJSON(`${this.opts.repoURL}/merges?access_token=${localStorage.gh_token}`, {
      base: this.opts.productionBranch,
      head: this.opts.stagingBranch,
      commit_message: ':vertical_traffic_light: Production deploy triggered from traffic-control'
    })
  }

  /**
   * References a dictonary of name: class elements
   * as a dictionary of name: HTMLElement.
   * @param  {Object} classes - the classes of elements to reference
   * @return {Object}         - a dictionary reference of actual HTML elements
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
   * Renders the initial state after appending traffic-control
   * to the containing element.
   * @return {Promise} - a promise for a mounted `traffic-control`.
   */
  instantiateElementWithDefaultState () {
    this.opts.containerEl.appendChild(this.el)
    return this.renderState('mounted')
  }

  /**
   * Computes what state traffic-control should render.
   * @return {Promise} - a promise for the final state, after animation completion.
   */
  computeAndAnimateState () {
    return this.renderState('loading')
      .then(() => !localStorage.gh_token
        ? this.renderState('unauthorized')
        : this.getBranchComparison()
            .then((data) => this.renderDeploymentState(data))
      )
      .catch((error) => console.error(error))
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
  renderDeploymentState ({ status, ahead_by, behind_by, permalink_url }) {
    switch (status) {
      case 'ahead':
      case 'diverged':
        this.els[`${status}Msg`].innerHTML = status === 'ahead'
          ? this.getAheadMessage(ahead_by, permalink_url)
          : this.getDivergedMessage(behind_by, permalink_url)
        return this.renderState(status)
      default:
        return this.renderState('synchronized')
    }
  }

  /**
   * Gets a comparison between branches from the git remote.
   * @return {Promise} - a promise for the JSON response.
   */
  getBranchComparison () {
    const cacheBuster = new Date().getTime()
    return getJSON(
      `${this.opts.compareBranchesURL}?access_token=${localStorage.gh_token}&cache_buster=${cacheBuster}`
    )
  }

  /**
   * Gets a list of the current modifiable traffic-control states.
   * @param {String} opts.filter - filter this state from the result set
   * @return {Array}             - a list of states
   */
  getCurrentStates ({ filter }) {
    return Object.keys(this.states)
      .filter((state) => (
        state !== filter && !this.states[state].persist
      ))
  }

  /**
   * Renders the given state after unrendering current states.
   * @param  {String}  state - the name of the state to render
   * @return {Promise}       - a promise for the rendered state
   */
  renderState (state) {
    // get a list of all states
    return Promise.all(
      this.getCurrentStates({ filter: state })
        .map((previousState) => new Promise((resolve) => {
          return hasClass(this.el, `is-${previousState}`)
            ? this.unRenderState(previousState).then(resolve)
            : resolve()
        }))
    )
      .then(() => {
        addClass(this.el, `is-${state}`)
        return animator.animateIn(...this.states[state].ui)
      })
  }

  /**
   * Unrenders a state.
   * @param  {String}  state - the name of the state to unrender.
   * @return {Promise}       - a promise for the unrendered state
   */
  unRenderState (state) {
    return animator.animateOut(...this.states[state].ui)
      .then(() => removeClass(this.el, `is-${state}`))
  }

  /**
   * Returns a message for ahead state.
   * @param  {Number} count - the number of commits ahead.
   * @param  {String} link  - link to diff view
   * @return {String}       - the compiled message
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
   * Returns a message for diverged state.
   * @param  {Number} count - the number of commits behind.
   * @param  {String} link  - link to diff view
   * @return {String}       - the compiled message
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
   * Authenticates viewer via their Github account.
   * @return {Promise} - promise for the authenticated session.
   */
  authenticateGithub () {
    return new Promise((resolve, reject) => {
      netlify.authenticate({ provider: 'github', scope: 'repo' }, (error, data) => {
        return error ? reject(error) : resolve(data)
      })
    })
  }

}
