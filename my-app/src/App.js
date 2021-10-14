import logo from './logo.svg';
import './App.css';
import { Gotit, GotitContext } from "mui-gotit";
import { useContext } from 'react'
/** @jsxImportSource @emotion/react */
import { css, jsx } from '@emotion/react'
import Alert from '@mui/material/Alert'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { orange } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: orange[500]
    },
  },
});

function ExampleNotificator(){
  const gotitContext = useContext(GotitContext);
  return (
    <div>
      <div>
        example component using mui-gotit
      </div>
      <br/>
      <button onClick={() => {
        gotitContext.displayNotification({
          snackbar: {
            open: true,
            autoHideDuration: 5000000,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
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
              <Alert severity={"error"} sx={{ backgroundColor: 'primary.dark' }}>
                <div css={css`color: blue`}>
                  {`a simple mui-gotit snack `}{Math.random()}
                </div>
              </Alert>
            ),
          },
        });
      }}>
        test group A
      </button>
      <br/>
      <button onClick={() => {
        gotitContext.displayNotification({
          snackbar: {
            open: true,
            autoHideDuration: 5000000,
            anchorOrigin: { vertical: 'top', horizontal: 'left' },
          },
          gotit: {
            group: "app-secondary",
            stackDirection: "bottom",
            maxSnackbars: 5,
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
              <Alert severity={"error"} sx={{ backgroundColor: 'primary.dark' }}>
                <div css={css`color: green`}>
                  {`a simple mui-gotit snack `}{Math.random()}
                </div>
              </Alert>
            ),
          },
        });
      }}>
        test group B
      </button>
    </div>
  )
}
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          css={css`color: pink;`}
        >
          Learn React
        </a>
        <ThemeProvider theme={theme}>
          <Gotit
            debug={true}
          >
            <ExampleNotificator/>
          </Gotit>
        </ThemeProvider>
      </header>
    </div>
  );
}

export default App;
