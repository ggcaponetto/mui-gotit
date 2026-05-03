import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

const external = [
  'react',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  /^@mui\//,
  /^@emotion\//,
  'loglevel',
  'uuid',
];

export default [
  {
    input: 'src/index.ts',
    output: [
      { dir: 'dist/cjs', format: 'cjs', sourcemap: true, preserveModules: false, exports: 'named' },
      { dir: 'dist/esm', format: 'esm', sourcemap: true, preserveModules: false },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: undefined,
        outDir: undefined,
      }),
    ],
    external,
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external,
  },
];
