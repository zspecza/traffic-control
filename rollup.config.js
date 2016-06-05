'use strict'

import babel from 'rollup-plugin-babel'
import string from 'rollup-plugin-string'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'src/index.js',
  dest: 'dist/traffic-control.js',
  format: 'umd',
  moduleName: 'trafficControl',
  moduleId: 'trafficControl',
  plugins: [
    string({ extensions: ['html', 'css'] }),
    babel({
      presets: 'es2015-rollup'
    }),
    nodeResolve({ browser: true }),
    commonjs()
  ]
}
