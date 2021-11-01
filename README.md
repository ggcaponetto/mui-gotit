<p align="center">
  <img src="https://raw.githubusercontent.com/ggcaponetto/mui-gotit/main/images/gotit-logo.png">
</p>

# mui-gotit
[![forthebadge](https://forthebadge.com/images/badges/fuck-it-ship-it.svg)](https://forthebadge.com)
[![Netlify Status](https://api.netlify.com/api/v1/badges/4135c5b9-2db3-4716-800f-d0a85d93265e/deploy-status)](https://app.netlify.com/sites/nervous-leakey-dd153f/deploys)

Enhanced Snackbars for Material UI 5 and React 17 with imperative flavor.
Inpsired by [notistack](https://github.com/iamhosseindhv/notistack) - Working with Material UI 5 Theming and ``sx``
property.

This library will be kept as simple as possible to allow easy upgrades to newer versions of MUI and allow anybody to
customize this library to their need.

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

### Docs

You can access the following functions from the ``gotitContext``.

#### ``gotitContext.displayNotification(option)``

The option argument looks like this:
````jsx
let option = 
{
    // the snackbar properties passed to the MUI <Snackbar/> element.
    snackbar: {
      open: true,
      autoHideDuration: 4000,
      anchorOrigin: { vertical: "top", horizontal: "right" }
    },
    gotit: {
      // group: string. Used to logically group notifications. All notifications of a group
      // are subject to the css transitions
      group: "app-main",
      // stackDirection: string. One of "top" or "bottom". If "top" is assigned, then the notification will
      // stack upwards. If "bottom" is assigned, they will stack downwards.
      stackDirection: "bottom",
      // maxSnackbars: integer. The max number of notifications that are displayed in a group.
      // The oldest notification will be removed if the max nr of notifications is reached.
      maxSnackbars: 3,
      // zIndexBase: int. The minimum z-index. Helps to put Snackbars on top of modals. 
      zIndexBase: 9999,
      // space: number. The distance in pixels from the previous notification
      space: 15,
      // emotionCssString: string. The cssString passed to emotion as a property of the
      // Snackbar element. e.g. <Snackbar css={css`${<<theEmotionCssString>>}`}/> 
      emotionCssString: `
          color: red;
          .MuiSnackbar-root {
            color: red;
          }
          .MuiSnackbarContent-root {
            color: orange;
          }
          .MuiSnackbarContent-message {
            color: orange;
          }
          .MuiSnackbarContent-action {
            color: orange;
          }
          `,
      // component: a react component. Pass any react element as a child of the Snackbar.
      component: (
        <Alert
          severity={"error"}
          sx={{ backgroundColor: "primary.dark" }}
        >
          <div
            css={css`
              color: blue;
            `}
          >
            {`a simple mui-gotit snack `}
            {Math.random()}
          </div>
        </Alert>
      )
    }
}
````
returns the option containing the id of the notification, useful to close it later.
E.g. 
````jsx
let handleOption = gotitContext.displayNotification({...});
gotitContext.removeNotification(handleOption.gotit.id);
````

#### ``gotitContext.removeNotification(notificationHandle)``

Removes the notification. Pass in the return value of the ``displayNotification`` function.

#### ``gotitContext.removeNotificationGroup(notificationGroup)``

Removes all the notification of the group.

````jsx
let handleOption = gotitContext.displayNotification({
  // ...other code
  gotit: { group: 'myGroup'}
  // ...other code
});
gotitContext.removeNotification(handleOption.gotit.group);
// or
gotitContext.removeNotification('myGroup');
````

### Hack on it

1. Edit ``src/gotit-pragma-automatic.js``
1. Start the demo app in watch mode: ``npm run watch``
1. Run Jest and Cypress tests ``npm run test``
1. Build the library running ``npm run rollup``
1. Publish it on npm: `npm publish`

### Sponsors

This project is used and sponsored by the Cardano platform [https://141x.io](https://141x.io).
If you like it, send some ADA to the address ``addr1q9dta74g2axw39zf440w67vd0dyq7md4360q4cah3ev72q2hy6re7yfwwt4y246wh3r867l6sjnnlzwseug2t4jp97ps2ajcnh``
and text me to get listed as a sponsor.

Sponsored by [https://www.browserstack.com/](https://www.browserstack.com/).
