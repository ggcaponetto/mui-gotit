import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import path from "path";

export default {
  input: 'src/index.js',
  output: [
    {
      exports: "auto",
      dir: "dist/cjs",
      format: 'cjs',
      sourcemap: true,
      preserveModules: true
    },
    {
      exports: "auto",
      dir: "dist/esm",
      format: 'esm',
      sourcemap: true,
      preserveModules: true
    }
  ],
  plugins: [
    babel({
      configFile: path.resolve(__dirname, 'babel.config.json'),
      babelHelpers: 'runtime'
    }),
    commonjs({
      exclude: [],
      include: [
        /node_modules/
      ]
    }),
    resolve({
      // pass custom options to the resolve plugin
      customResolveOptions: {
        moduleDirectories: [
          'node_modules'
        ]
      }
    }),
  ],
  external: [
    "react",
    /^@mui/,
    /^@emotion/,
  ]
};
