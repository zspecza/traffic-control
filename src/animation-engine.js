'use strict'

import animationEnd from './animationEnd'
import once from './once'
import addClass from './addClass'
import removeClass from './removeClass'
import addClassesInSequence from './addClassesInSequence'
import removeClassesInSequence from './removeClassesInSequence'

/**
 * @class AnimationEngine
 * @classdesc a tiny fake animation engine that works by setting enter & leave classes that trigger @keyframe animations
 */
export default class AnimationEngine {
  /**
   * @constructs AnimationEngine
   * @param  {Object} opts             - settings for animations
   * @param  {String} opts.enterClass  - the class to add when animating element is entering
   * @param  {String} opts.leaveClass  - the class to add when animating element is leaving
   * @param  {String} opts.activeClass - the class to add when animated element is active
   * @return {Object}                  - an instance of the animation engine
   */
  constructor (opts = {}) {
    this.opts = Object.assign({
      enterClass: 'is-entering',
      activeClass: 'is-active',
      leaveClass: 'is-leaving'
    }, opts)
  }

  /**
   * Adds class that triggers enter animation for any number of elements.
   * @param  {HTMLElement} ...els - an argument list of elements
   * @return {Promise}            - a promise for the completed animation
   */
  animateIn (...els) {
    return Promise.all(els.map((el) => new Promise((resolve) => {
      once(el, animationEnd, resolve)
      addClassesInSequence(el, this.opts.activeClass, this.opts.enterClass)
    })))
  }

  /**
   * Adds class that triggers leave animation for any number of elements.
   * @param  {HTMLElement} ...els - an argument list of elements
   * @return {Promise}            - a promise for the completed animation
   */
  animateOut (...els) {
    return Promise.all(els.map((el) => new Promise((resolve) => {
      once(el, animationEnd, () => {
        removeClassesInSequence(el, this.opts.leaveClass, this.opts.activeClass)
        resolve()
      })
      removeClass(el, this.opts.enterClass)
      addClass(el, this.opts.leaveClass)
    })))
  }
}
