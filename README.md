# traffic-control
:vertical_traffic_light: Get a grip on staging

## Concept

This adds a bar to the top of a website hosted on Netlify that uses the Github and Netlify APIs to visually communicate information about the staging environment and allow one-click production deploys. Here are some mockups of the concept:

![When staging is far beyond production](/concept/staging-bar--ahead.png?raw=true)
![When staging is in sync with production](/concept/staging-bar--synchronized.png?raw=true)
![When staging has diverged behind production](/concept/staging-bar--diverged.png?raw=true)
![When the user is unauthorized to view changes or deploy](/concept/staging-bar--unauthorized.png?raw=true)

## Installation

You can grab the code from NPM:

```sh
$ npm i traffic-control -S
```

Or from NPM CDN:

```html
<script src="//npmcdn.com/traffic-control@0.1.1/dist/traffic-control.min.js"></script>
```

## Usage

The easiest way to get set up is by doing the following:

First, load Netlify's OAuth helpers before your closing `</body>` (`traffic-control` will load this automatically if not present, but doing this will make it much faster):

```html
<script src="https://app.netlify.com/authentication.js"></script>
```

And then load this script:

```html
<script src="//npmcdn.com/traffic-control@0.1.1/dist/traffic-control.min.js"></script>
```

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

The final step is to configure Github OAuth for your Netlify site. You can do that by following the instructions here: https://www.netlify.com/docs/authentication-providers

## Goals

Eventually, I want to get rid of the dependency on Netlify and have this be its own Github integration. Keep eyes peeled!

## Custom CSS

`traffic-control`'s default styles are designed to have as little footprint as possible.

Using CSS, you can customize just about any element - simply use the ID `#traffic-control` as a namespace before every element.

```css
#traffic-control .tc-bar { /* custom styles */ }
```

You can target specific states like so:

```css
#traffic-control.is-mounted {}
#traffic-control.is-diverged {}
#traffic-control.is-ahead {}
#traffic-control.is-unauthorized {}
/* ...etc... */
```

## Animations

`traffic-control` ships with a tiny keyframe-based animation engine.

If an element does not have an `is-active` class, it should be hidden from view.

When an element is about to be rendered, it will have an `is-entering` class.
Similarly, when an element is about to be hidden, it will have an `is-leaving` class.

You can animate enter/leave states using CSS `@keyframes`:

```css
#traffic-control .tc-bar.is-entering {
  animation: slideIn .6s ease;
}

@keyframes slideIn {
  from: {
    transform: translateY(100%);
  }
  to: {
    transform: translateY(0%);
  }
}
```

Animations are intelligent enough to detect the `animationend` event before triggering any new logic.

> **Note**: animations are mandatory. Things will break if each element is not animated. This behavior is intentional and required to keep uniform behavior.
