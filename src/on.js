'use strict'

/**
 * Adds an event listener to an element
 * @param  {HTMLElement} el        - the element to add the listener on
 * @param  {String}      eventName - the name of the event
 * @param  {Function}    func      - the listener to add
 */
export default function on (el, eventName, func) {
  el.addEventListener(eventName, func, false)
}
