'use strict'

/**
 * Posts JSON to an endpoint, does not cache responses
 * @param  {String} url  - the URL to POST to
 * @param  {Object} json - the unserialized data to POST
 * @return {Promise}     - a promise for the response
 */
export default function (url, json) {
  return new Promise((resolve, reject) => {
    window.fetch(url, {
      method: 'POST',
      body: JSON.stringify(json),
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.ok
          ? response
          : Promise.reject(response.statusText)
      )
      .then(resolve)
      .catch(reject)
  })
}
