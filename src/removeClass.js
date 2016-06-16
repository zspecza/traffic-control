'use strict'

/**
 * removes a list of classnames from an html element
 * @param {HTMLElement} el            - the element to remove the classnames from
 * @param {String}      ...classNames - an argument list of classnames
 */
export default function removeClass (el, ...classNames) {
  el.classList.remove(...classNames)
}
