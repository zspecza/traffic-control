'use strict'

import addClass from './addClass'

/**
 * Adds classes to an html element one by one
 * @param {HTMLElement} el            - the element to add the classes to
 * @param {String}      ...classNames - an argument list of class names
 */
export default function addClassesInSequence (el, ...classNames) {
  for (let i = 0, len = classNames.length; i < len; i++) {
    addClass(el, classNames[i])
  }
}
