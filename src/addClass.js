'use strict'

/**
 * adds a list of classnames to an html element
 * @param {HTMLElement} el            - the element to add the classnames to
 * @param {String}      ...classNames - an argument list of classnames
 */
export default function addClass (el, ...classNames) {
  el.classList.add(...classNames)
}
