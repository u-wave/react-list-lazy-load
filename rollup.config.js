import babel from 'rollup-plugin-babel'

const meta = require('./package.json')

export default {
  input: './src/LazyList.js',
  output: [
    { format: 'cjs', file: meta.main, exports: 'default' },
    { format: 'es', file: meta.module }
  ],

  external: Object.keys(meta.dependencies)
    .concat(Object.keys(meta.peerDependencies)),
  plugins: [
    babel()
  ]
}
