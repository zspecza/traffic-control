'use strict'

/**
 * Normalizes `animationend` event accross different browsers.
 * @return {String} - the event name for thecurrent vendor
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
