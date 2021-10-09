import * as React from 'react';
/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { GotitBase, GotitContext } from './gotit';

function Gotit(props) {
  return (
    <GotitBase {...props} />
  );
}
export {
  GotitContext,
  Gotit,
};
