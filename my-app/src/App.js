import { Gotit, GotitContext } from "mui-gotit";
import React, { useContext } from "react";
/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import Alert from "@mui/material/Alert";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import Button from "@mui/material/Button";
import packageJson from "../package.json";
import libVersion from "mui-gotit/package.json";

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
    <div style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <div style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <div>
          example component version {packageJson.version} using mui-gotit version {libVersion.version}
        </div>
      </div>
      <br />
      <Button
        onClick={() => {
          gotitContext.displayNotification({
            snackbar: {
              open: true,
              autoHideDuration: 4000,
              anchorOrigin: { vertical: "top", horizontal: "right" }
            },
            gotit: {
              group: "app-main",
              stackDirection: "bottom",
              maxSnackbars: 3,
              space: 15,
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
              component: (
                <Alert
                  severity={"error"}
                  sx={{ backgroundColor: "primary.dark" }}
                >
                  <div
                    css={css`
                      color: white;
                    `}
                  >
                    {`a simple mui-gotit snack `}
                    {Math.random()}
                  </div>
                </Alert>
              )
            }
          });
        }}
      >
        test group app-main, top-right, 4s autohide
      </Button>
      <br />
      <Button
        onClick={() => {
          let handleOption = gotitContext.displayNotification({
            snackbar: {
              open: true,
              autoHideDuration: 4000,
              anchorOrigin: { vertical: "bottom", horizontal: "right" }
            },
            gotit: {
              group: "app-bottom-right",
              stackDirection: "top",
              maxSnackbars: 3,
              space: 5,
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
              component: (
                <Alert
                  severity={"success"}
                  sx={{ backgroundColor: "primary.light" }}
                >
                  <div
                    css={css`
                      color: red;
                    `}
                  >
                    {`something random: ${Math.random()} `}
                    <Button
                    variant={'contained'}
                    color={'success'}
                    onClick={() => {
                      gotitContext.removeNotification(handleOption);
                    }}
                  >gotit (dismiss)</Button>
                  </div>
                </Alert>
              )
            }
          });
        }}
      >
        test group app-bottom-right, up direction, 4s autohide, dismiss on click
      </Button>
      <br />
      <Button
        onClick={() => {
          gotitContext.displayNotification({
            snackbar: {
              open: true,
              autoHideDuration: 4000,
              anchorOrigin: { vertical: "top", horizontal: "left" }
            },
            gotit: {
              group: "app-fade",
              stackDirection: "bottom",
              maxSnackbars: 5,
              space: 5,
              fade: true,
              emotionCssString: `
                  color: red;
                  .MuiSnackbar-root {
                    color: red;
                  }
                  .MuiSnackbarContent-root {
                    color: red;
                  }
                  .MuiSnackbarContent-message {
                    color: red;
                  }
                  .MuiSnackbarContent-action {
                    color: red;
                  }
                  `,
              component: (
                <div>
                  <div>
                    Some other content on top of the alert
                  </div>
                  <Alert
                    severity={"success"}
                  >
                    <div>
                      {`a success alert with emotion css overrides ${Math.random()}`}
                    </div>
                  </Alert>
                </div>
              )
            }
          });
        }}>
        test group app-fade, emotion styling
      </Button>
      <br />
      <Button
        onClick={() => {
          gotitContext.removeNotificationGroup("app-fade");
        }}
      >
        remove group app-fade
      </Button>
    </div>
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
