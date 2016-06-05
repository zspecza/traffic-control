'use strict'

/**
 * [on description]
 * @param  {[type]} el        [description]
 * @param  {[type]} eventName [description]
 * @param  {[type]} func      [description]
 * @return {[type]}           [description]
 */
export default function on (el, eventName, func) {
  el.addEventListener(eventName, func, false)
}
