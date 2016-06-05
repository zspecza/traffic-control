'use strict'

/**
 * [off description]
 * @param  {[type]} el        [description]
 * @param  {[type]} eventName [description]
 * @param  {[type]} func      [description]
 * @return {[type]}           [description]
 */
export default function off (el, eventName, func) {
  el.removeEventListener(eventName, func)
}
