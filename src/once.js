'use strict'

import on from './on'
import off from './off'

/**
 * [addOneEventListener description]
 * @param {[type]} el        [description]
 * @param {[type]} eventName [description]
 * @param {[type]} func      [description]
 */
export default function once (el, eventName, func) {
  const cb = (...args) => {
    func(...args)
    off(el, eventName, cb)
  }
  on(el, eventName, cb)
}
