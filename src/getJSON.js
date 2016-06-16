'use strict'

/**
 * fetches an uncached JSON response
 * @param  {String} url - the URL to grab json from
 * @return {Promise}    - a promise for the json data
 */
export default function (url) {
  return new Promise((resolve, reject) => {
    window.fetch(url, {
      cache: 'no-cache'
    })
      .then((response) => response.ok
          ? response
          : Promise.reject(response.statusText)
      )
      .then((response) => response.json())
      .then(resolve)
      .catch(reject)
  })
}
