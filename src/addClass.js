'use strict'

/**
 * [addClass description]
 * @param {[type]} el            [description]
 * @param {[type]} ...classNames [description]
 */
export default function addClass (el, ...classNames) {
  el.classList.add(...classNames)
}
