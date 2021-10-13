import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import path from "path";

export default {
  input: 'src/index.js',
  output: [
    {
      dir: "dist/cjs",
      format: 'cjs',
      sourcemap: true
    },
    {
      dir: "dist/esm",
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    babel({
      configFile: path.resolve(__dirname, 'babel.config.json'),
      babelHelpers: 'runtime'
    }),
    resolve({}),
    commonjs({})
  ],
  external: [
    "react",
    /^@mui/,
  ]
};
