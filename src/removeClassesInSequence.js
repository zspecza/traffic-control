'use strict'

import removeClass from './removeClass'

/**
 * Removes classes from an html element one by one
 * @param {HTMLElement} el            - the element to remove the classes from
 * @param {String}      ...classNames - an argument list of class names
 */
export default function removeClassesInSequence (el, ...classNames) {
  for (let i = 0, len = classNames.length; i < len; i++) {
    removeClass(el, classNames[i])
  }
}
