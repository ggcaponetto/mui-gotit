import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import jsx from 'rollup-plugin-jsx'

const packageJson = require('./package.json');

export default {
  input: 'src/index.js',
  output: [
    {
      dir: "dist/cjs",
      format: 'cjs',
      sourcemap: true,
      name: 'MUIGotit'
    },
    {
      dir: "dist/esm",
      format: 'esm',
      sourcemap: true
    }
  ],
  preserveModules: true,
  plugins: [
    resolve(),
    babel({

    })
  ],
  external: [
    "react",
    "@mui",
    "@emotion"
  ]
};
