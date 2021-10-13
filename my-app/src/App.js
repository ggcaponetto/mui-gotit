import logo from './logo.svg';
import './App.css';
import { Gotit, GotitContext } from "mui-gotit";
import { useContext } from 'react'
/** @jsxImportSource @emotion/react */
import { css, jsx } from '@emotion/react'
import Alert from '@mui/material/Alert'

function ExampleNotificator(){
  const gotitContext = useContext(GotitContext);
  return (
    <div>
      example component using mui-gotit
      <button onClick={() => {
        gotitContext.displayNotification({
          snackbar: {
            open: true,
            autoHideDuration: 500000,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          },
          gotit: {
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
              <Alert severity={"error"} sx={{ backgroundColor: 'green.main' }}>
                <div css={css`color: blue`}>
                  {`a simple mui-gotit snack `}{Math.random()}
                </div>
              </Alert>
            ),
          },
        });
      }}>
        test custom
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
        <Gotit>
          <ExampleNotificator/>
        </Gotit>
      </header>
    </div>
  );
}

export default App;
