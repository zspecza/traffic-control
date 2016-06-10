'use strict'

/**
 * [description]
 * @param  {[type]} url  [description]
 * @param  {[type]} json [description]
 * @return {[type]}      [description]
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
