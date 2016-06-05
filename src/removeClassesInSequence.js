'use strict'

import removeClass from './removeClass'

/**
 * [addClassesInSequence description]
 * @param {[type]} el            [description]
 * @param {[type]} ...classNames [description]
 */
export default function removeClassesInSequence (el, ...classNames) {
  for (let i = 0, len = classNames.length; i < len; i++) {
    removeClass(el, classNames[i])
  }
}
