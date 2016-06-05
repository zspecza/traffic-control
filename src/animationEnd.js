'use strict'

/**
 * [description]
 * @param  {[type]} ( [description]
 * @return {[type]}   [description]
 */
export default (() => {
  const el = document.createElement('fakeelement')
  const animations = {
    'animation': 'animationend',
    'OAnimation': 'oanimationend',
    'MozAnimation': 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd',
    'MSAnimation': 'MSAnimationEnd'
  }
  for (let t in animations) {
    if (!el.style[t] != null) {
      return animations[t]
    }
  }
})()
