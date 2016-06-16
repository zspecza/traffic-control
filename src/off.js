'use strict'

/**
 * Removes an event listener.
 * @param  {HTMLElement} el        - the element to remove the event listener from
 * @param  {String}      eventName - the name of the event
 * @param  {Function}    func      - the listener to remove
 */
export default function off (el, eventName, func) {
  el.removeEventListener(eventName, func)
}
