'use strict'

/* polyfills */
import 'whatwg-fetch'
// TODO: find out why these break rollup...
// import 'core-js/fn/object/assign'
// import 'core-js/fn/object/keys'
// import 'core-js/fn/array/is-array'
// import 'core-js/fn/promise'

/* component class */
import TrafficControl from './traffic-control'

/**
 * [trafficControl description]
 * @param  {[type]} opts [description]
 * @return {[type]}      [description]
 */
export default function trafficControl (opts) {
  const netlify = window.netlify

  /**
   * Initialises traffic-control
   * @return {Promise} - a promise for the initialized traffic-control instance
   */
  const init = () => {
    return new TrafficControl(opts)
  }

  /**
   * Conditionally loads Netlify if not present on page
   * before initialising traffic-control
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

  // conditionally load netlify script and bootstrap traffic-control
  if (window.addEventListener) {
    window.addEventListener('load', conditionallyLoadNetlify, false)
  } else if (window.attachEvent) {
    window.attachEvent('onload', conditionallyLoadNetlify)
  }
}
