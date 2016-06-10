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
 *
 */
export default class TrafficControl {
  /**
   * [constructor description]
   * @param  {[type]} opts =             {} [description]
   * @return {[type]}      [description]
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
    return opts
  }

  /**
   * [_init description]
   * @return {[type]} [description]
   */
  init () {
    addCSS(styles)
    this.initializeElementWithMarkup()
    this.instantiateElementWithDefaultState()
      .then(() => this.computeAndAnimateState())
      .catch((error) => console.error(error))
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
   * [addState description]
   * @param {[type]} name [description]
   * @param {[type]} opts [description]
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
   * [_addStates description]
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
    this.addState('success', ['successMsg', 'successBtn', 'closeBtn'])
  }

  /**
   * [_addEventHooks description]
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
    on(this.els.successBtn, 'click', () => this.computeAndAnimateState())
    on(this.els.deployBtn, 'click', () => {
      this.renderState('loading')
        .then(() => this.merge())
        .then((data) => this.renderMergeStatus(data))
        .catch((error) => console.error(error))
    })
  }

  /**
   * [renderMergeStatus description]
   * @param  {[type]} { status        } [description]
   * @return {[type]}   [description]
   */
  renderMergeStatus ({ status }) {
    if (status === 201) {
      return this.renderState('success')
    } else if (status === 409) {
      return this.renderState('conflict')
    }
  }

  /**
   * [merge description]
   * @return {[type]} [description]
   */
  merge () {
    return postJSON(`${this.opts.repoURL}/merges?access_token=${localStorage.gh_token}`, {
      base: this.opts.productionBranch,
      head: this.opts.stagingBranch,
      commit_message: ':vertical_traffic_light: Production deploy triggered from traffic-control'
    })
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
    return this.renderState('mounted')
  }

  /**
   * [_authenticateAndInitialize description]
   * @return {[type]} [description]
   */
  computeAndAnimateState (o = {}) {
    return this.renderState('loading')
      .then(() => !localStorage.gh_token
        ? this.renderState('unauthorized')
        : this.getBranchComparison()
            .then((data) => this.renderDeploymentState(data))
      )
      .catch((error) => console.error(error))
  }

  /**
   * [renderDeploymentState description]
   * @param  {[type]} {             status        [description]
   * @param  {[type]} ahead_by      [description]
   * @param  {[type]} behind_by     [description]
   * @param  {[type]} permalink_url }             [description]
   * @return {[type]}               [description]
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
   * [getBranchComparison description]
   * @return {[type]} [description]
   */
  getBranchComparison () {
    const cacheBuster = new Date().getTime()
    return getJSON(
      `${this.opts.compareBranchesURL}?access_token=${localStorage.gh_token}&cache_buster=${cacheBuster}`
    )
  }

  /**
   * [getStates description]
   * @return {[type]} [description]
   */
  getCurrentStates ({ filter }) {
    return Object.keys(this.states)
      .filter((state) => (
        state !== filter && !this.states[state].persist
      ))
  }

  /**
   * [_renderState description]
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
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
   * [_unRenderState description]
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  unRenderState (state) {
    return animator.animateOut(...this.states[state].ui)
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
   * [authenticateGithub description]
   * @return {[type]} [description]
   */
  authenticateGithub () {
    return new Promise((resolve, reject) => {
      netlify.authenticate({ provider: 'github', scope: 'repo' }, (error, data) => {
        return error ? reject(error) : resolve(data)
      })
    })
  }

}
