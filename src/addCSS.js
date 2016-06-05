'use strict'

/**
 * [_addCss description]
 * @param {[type]} css [description]
 */
export default function addCSS (css) {
  const style = document.createElement('style')
  const head = document.head || document.getElementsByTagName('head')[0]
  style.type = 'text/css'
  if (style.styleSheet) {
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
  head.appendChild(style)
}
