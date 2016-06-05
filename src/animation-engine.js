'use strict'

import animationEnd from './animationEnd'
import once from './once'
import addClass from './addClass'
import removeClass from './removeClass'
import addClassesInSequence from './addClassesInSequence'
import removeClassesInSequence from './removeClassesInSequence'

/**
 *
 */
export default class AnimationEngine {
  /**
   * [constructor description]
   * @param  {[type]} opts =             {} [description]
   * @return {[type]}      [description]
   */
  constructor (opts = {}) {
    this.opts = Object.assign({
      enterClass: 'is-entering',
      activeClass: 'is-active',
      leaveClass: 'is-leaving'
    }, opts)
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
      addClassesInSequence(el, this.opts.activeClass, this.opts.enterClass)
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
        removeClassesInSequence(el, this.opts.leaveClass, this.opts.activeClass)
        resolve()
      })
      removeClass(el, this.opts.enterClass)
      addClass(el, this.opts.leaveClass)
    })))
  }
}
