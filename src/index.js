'use strict'

/* polyfills */
import 'whatwg-fetch'
import 'core-js/fn/object/assign'
import 'core-js/fn/promise'

/* component class */
import TrafficControl from './traffic-control'

/**
 * [trafficControl description]
 * @param  {[type]} opts [description]
 * @return {[type]}      [description]
 */
export default function trafficControl (opts) {
  let netlify = window.netlify

  /**
   * [description]
   * @return {[type]} [description]
   */
  const init = () => {
    return new TrafficControl(opts)
  }

  /**
   * [description]
   * @return {[type]} [description]
   */
  const conditionallyLoadNetlify = () => {
    if (netlify == null) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.onload = script.onreadystatechange = init
      script.src = 'https://app.netlify.com/authentication.js'
      return document.body.appendChild(script)
    } else {
      return init()
    }
  }

  if (window.addEventListener) {
    window.addEventListener('load', conditionallyLoadNetlify, false)
  } else if (window.attachEvent) {
    window.attachEvent('onload', conditionallyLoadNetlify)
  }
}
