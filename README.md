<p align="center">
  <img src="https://raw.githubusercontent.com/ggcaponetto/mui-gotit/main/images/gotit-logo.png">
</p>

# mui-gotit
[![forthebadge](https://forthebadge.com/images/badges/fuck-it-ship-it.svg)](https://forthebadge.com)
[![Netlify Status](https://api.netlify.com/api/v1/badges/4135c5b9-2db3-4716-800f-d0a85d93265e/deploy-status)](https://app.netlify.com/sites/nervous-leakey-dd153f/deploys)

Enhanced Snackbars for Material UI 5 and React 17.
Inpsired by [notistack](https://github.com/iamhosseindhv/notistack) - Working with Material UI 5 Theming and ``sx`` property.

### Live Demo
* [Codesandbox - Simple](https://codesandbox.io/s/mui-gotit-minimal-u77gw?file=/src/App.js:0-1646)
* [Codesandbox - Customized](https://codesandbox.io/s/mui-gotit-qpyrl?file=/src/App.js:0-462)

### Installation

1. ``npm i mui-gotit``

````jsx
import { Gotit, GotitContext } from "mui-gotit";
import { useContext } from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Alert from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import Button from "@mui/material/Button";

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500]
    }
  }
});

function ExampleNotificator() {
  const gotitContext = useContext(GotitContext);
  return (
    <Button
      onClick={() => {
        gotitContext.displayNotification({
          snackbar: {
            open: true,
            autoHideDuration: 4000,
            anchorOrigin: { vertical: "bottom", horizontal: "right" }
          },
          gotit: {
            group: "main",
            stackDirection: "top",
            space: 10,
            component: (
              <Alert
                severity={"success"}
                sx={{ backgroundColor: "primary.dark" }}
              >
                <div
                  css={css`
                    color: white;
                  `}
                >
                  {`a simple mui-gotit snack wit a random number `}
                  {Math.random()}
                </div>
              </Alert>
            )
          }
        });
      }}
    >
      display a notification
    </Button>
  );
}

export default function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Gotit debug={false}>
          <ExampleNotificator />
        </Gotit>
      </ThemeProvider>
    </div>
  );
}
````
