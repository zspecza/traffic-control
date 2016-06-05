'use strict'

/**
 * [description]
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
export default function (url) {
  return new Promise((resolve, reject) => {
    window.fetch(url)
      .then((response) => response.ok
          ? response
          : Promise.reject(response.statusText)
      )
      .then((response) => response.json())
      .then(resolve)
      .catch(reject)
  })
}
