# traffic-control
:vertical_traffic_light: Get a grip on staging

## Concept

This adds a bar to the top of a website hosted on Netlify that uses the Github and Netlify APIs to visually communicate information about the staging environment and allow one-click production deploys. Here are some mockups of the concept:

![When staging is far beyond production](/concept/staging-bar--ahead.png?raw=true)
![When staging is in sync with production](/concept/staging-bar--synchronized.png?raw=true)
![When staging has diverged behind production](/concept/staging-bar--diverged.png?raw=true)
![When the user is unauthorized to view changes or deploy](/concept/staging-bar--unauthorized.png?raw=true)

## Installation

Right now, this is only available on NPM. Further distributions are under way.

```sh
$ npm i traffic-control -S
```

## Usage

First, load Netlify's OAuth helpers before your closing `</body>`:

```html
<script src="https://app.netlify.com/authentication.js"></script>
```

And then load this script (there is no dst release yet, so you might have to copy it over from your `node_modules` folder or use a bundler like Webpack or Browserify).

This script _does_ require jQuery, but it will conditionally load it in if it can't find a variable named `jQuery`.

Then, simply initiate the `trafficControl` function:

```js
trafficControl({
  repo: 'username/repo', // required. default is undefined.
  productionBranch: 'master', // required. default is 'master'
  stagingBranch: 'develop' // required. default is 'develop'
})
```

A good place to put it is on your staging site via Netlify's script injection feature:

![](https://infinit.io/_/3dSfWya.png)

## Goals

Eventually, I want to get rid of the dependency on Netlify & jQuery and have this be its own Github integration. Keep eyes peeled!
