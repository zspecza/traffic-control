'use strict'

import on from './on'
import off from './off'

/**
 * Adds a one-time-only event listener to an element
 * @param {HTMLElement} el        - the element to add the listener to
 * @param {String}      eventName - the name of the event
 * @param {Function}    func      - the listener to add
 */
export default function once (el, eventName, func) {
  const cb = (...args) => {
    func(...args)
    off(el, eventName, cb)
  }
  on(el, eventName, cb)
}
