'use strict'

/**
 * Determines if an element has a classname.
 * @param  {HTMLElement}  el            - the element to check
 * @param  {String}       ...classNames - an argument list of classnames
 * @return {Boolean}                    - true if element has class
 */
export default function hasClass (el, ...classNames) {
  return el.classList.contains(...classNames)
}
