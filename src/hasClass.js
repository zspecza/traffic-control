'use strict'

/**
 * [hasClass description]
 * @param  {[type]}  el            [description]
 * @param  {[type]}  ...classNames [description]
 * @return {Boolean}               [description]
 */
export default function hasClass (el, ...classNames) {
  return el.classList.contains(...classNames)
}
