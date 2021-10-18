<p align="center">
  <img width="600" height="200" src="https://raw.githubusercontent.com/ggcaponetto/mui-gotit/main/images/gotit-logo.png">
</p>

# mui-gotit
[![forthebadge](https://forthebadge.com/images/badges/fuck-it-ship-it.svg)](https://forthebadge.com)
[![Netlify Status](https://api.netlify.com/api/v1/badges/4135c5b9-2db3-4716-800f-d0a85d93265e/deploy-status)](https://app.netlify.com/sites/nervous-leakey-dd153f/deploys)

A Stacked Snackbar library for Material UI >= 5 and React >=17.
Inpsired by [notistack](https://github.com/iamhosseindhv/notistack) - Working with Material UI 5 Theming and sx property.

### Installation

1. ``npm i mui-gotit``

1.
Wrap your whole application with the ``<Gotit/>`` tag.
[Codesandbox](https://codesandbox.io/s/mui-gotit-qpyrl?file=/src/App.js:0-462)
````jsx
import "./styles.css";
import { useContext } from "react";
import { Gotit, GotitContext } from "mui-gotit-test/src/gotit-jsx-pragma.js";

export default function App() {
  const gotitContext = useContext(GotitContext);

  return (
    <div className="App">
      <Gotit debug={true} maxSnackbars={5} padding={5} stackDirection="bottom">
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
      </Gotit>
    </div>
  );
}
````
