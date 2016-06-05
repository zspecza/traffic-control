'use strict'

/* component HTML & css */
import initialMarkup from './template.html'
import styles from './styles.css'

/* modules */
import on from './on'
import off from './off'
import once from './once'
import addCSS from './addCSS'
import hasClass from './hasClass'
import addClass from './addClass'
import removeClass from './removeClass'
import addClassesInSequence from './addClassesInSequence'
import removeClassesInSequence from './removeClassesInSequence'
import animationEnd from './animationEnd'

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
    addCSS(styles)
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
