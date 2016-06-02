'use strict'

import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'src/traffic-control.js',
  dest: 'dist/traffic-control.min.js',
  format: 'umd',
  moduleName: 'trafficControl',
  moduleId: 'trafficControl',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: 'es2015-rollup'
    }),
    uglify()
  ]
}
