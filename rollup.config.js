import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import jsx from 'rollup-plugin-jsx'
import path from "path";

const packageJson = require('./package.json');

export default {
  input: 'src/index.js',
  output: [
    {
      dir: "dist/cjs",
      format: 'cjs',
      sourcemap: true,
      name: 'MUIGotit',
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    {
      dir: "dist/esm",
      format: 'esm',
      sourcemap: true,
      name: 'MUIGotit',
      preserveModules: true,
      preserveModulesRoot: 'src'
    }
  ],
  plugins: [
    resolve({
      // pass custom options to the resolve plugin
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    babel({
      configFile: path.resolve(__dirname, '.babelrc'),
      babelHelpers: 'runtime'
    }),
    commonjs({
      dynamicRequireTargets: [
        // include using a glob pattern (either a string or an array of strings)
        'node_modules/loglevel/lib/*.js',
        'node_modules/loglevel/dist/*.js',
      ]
    })
  ],
  external: [
    "react",
    "@mui",
    "@emotion"
  ]
};
