'use strict'

import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/traffic-control.js',
  dest: 'dist/traffic-control.dev.js',
  format: 'umd',
  moduleName: 'trafficControl',
  moduleId: 'trafficControl',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: 'es2015-rollup',
      sourceMaps: 'inline'
    })
  ],
  sourceMap: 'inline'
}
