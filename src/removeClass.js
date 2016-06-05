'use strict'

/**
 * [removeClass description]
 * @param  {[type]} el            [description]
 * @param  {[type]} ...classNames [description]
 * @return {[type]}               [description]
 */
export default function removeClass (el, ...classNames) {
  el.classList.remove(...classNames)
}
