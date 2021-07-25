import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.json']
const sourcemap = 'inline'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'main/index.js',
      sourcemap,
      format: 'cjs',
    },
    {
      file: 'module/index.js',
      sourcemap,
      format: 'esm',
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      rootMode: 'upward',
      extensions,
    }),
    resolve({ extensions, resolveOnly: [/src/] }),
    commonjs({
      extensions,
    }),
  ],
}
