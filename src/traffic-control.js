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
      mounted: {
        ui: [this.els.bar],
        persist: true
      },
      loading: {
        ui: [this.els.loadingMsg, this.els.closeBtn]
      },
      unauthorized: {
        ui: [this.els.unauthedMsg, this.els.authBtn, this.els.closeBtn]
      },
      ahead: {
        ui: [this.els.aheadMsg, this.els.deployBtn, this.els.closeBtn]
      },
      diverged: {
        ui: [this.els.divergedMsg, this.els.infoBtn, this.els.closeBtn]
      },
      synchronized: {
        ui: [this.els.syncedMsg, this.els.closeBtn]
      },
      instruction: {
        ui: [this.els.instructionMsg, this.els.okBtn, this.els.closeBtn]
      },
      conflict: {
        ui: [this.els.conflictMsg, this.els.conflictBtn, this.els.closeBtn]
      },
      success: {
        ui: [this.els.successMsg, this.els.successBtn, this.els.closeBtn]
      }
    }
  }

  /**
   * [_addEventHooks description]
   */
  addEventHooks () {
    on(this.els.infoBtn, 'click', () => this.renderState('instruction'))
    on(this.els.okBtn, 'click', () => this.renderState('diverged'))
    on(this.els.closeBtn, 'click', () => this.unRenderState('mounted'))
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
    on(this.els.conflictBtn, 'click', () => this.authenticateAndRenderState())
    on(this.els.successBtn, 'click', () => this.authenticateAndRenderState())
    on(this.els.deployBtn, 'click', () => {
      this.renderState('loading')
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
        .then(({ status }) => {
          if (status === 201) {
            return this.renderState('success')
          } else if (status === 409) {
            return this.renderState('conflict')
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
    this.renderState('loading')
    return (!localStorage.gh_token)
      ? this.renderState('unauthorized')
      : window.fetch(`${this.opts.compareBranchesURL}?access_token=${localStorage.gh_token}`)
        .then((response) => response.json())
        .then(({ status, ahead_by, behind_by, permalink_url }) => {
          // a deploy is required
          if (status === 'ahead') {
            this.els.aheadMsg.innerHTML = this.getAheadMessage(ahead_by, permalink_url)
            return this.renderState('ahead')
          // a rebase is required
          } else if (status === 'diverged') {
            this.els.divergedMsg.innerHTML = this.getDivergedMessage(behind_by, permalink_url)
            return this.renderState('diverged')
          // we're in-sync! hooray!
          } else {
            return this.renderState('synchronized')
          }
        })
  }

  /**
   * [_renderState description]
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  renderState (state) {
    const states = Object
      .keys(this.states)
      .filter((previousState) => (
        previousState !== state && !this.states[previousState].persist
      ))
    return Promise.all(
      states.map((previousState) => new Promise((resolve) => {
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

}
