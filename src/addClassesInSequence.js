'use strict'

import addClass from './addClass'

/**
 * [addClassesInSequence description]
 * @param {[type]} el            [description]
 * @param {[type]} ...classNames [description]
 */
export default function addClassesInSequence (el, ...classNames) {
  for (let i = 0, len = classNames.length; i < len; i++) {
    addClass(el, classNames[i])
  }
}
