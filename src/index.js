import * as React from 'react';
import {
  useEffect, useState, useRef, useCallback, useReducer,
} from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';
import Slide from '@mui/material/Slide';

const defaultContext = {
  actions: {
    replace: 'replace',
    addNotification: 'addNotification',
    removeNotification: 'removeNotification',
    updateNotification: 'updateNotification',
  },
  notifications: [],
};
const GotitContext = React.createContext(defaultContext);

const reducer = (prevState, action) => {
  console.debug(`debug gotit - reducer ${action.type}`, { prevState, action });
  if (action.type === defaultContext.actions.replace) {
    const newState = { ...prevState, ...action.payload };
    return newState;
  }
  if (action.type === defaultContext.actions.addNotification) {
    const newState = {
      ...prevState,
      notifications: [
        ...prevState.notifications,
        action.payload.notification,
      ],
    };
    return newState;
  }
  if (action.type === defaultContext.actions.removeNotification) {
    const newState = {
      ...prevState,
      notifications: [
        ...prevState.notifications
          .filter((option) => option.gotit.id !== action.payload.notification.gotit.id),
      ],
    };
    return newState;
  }
  throw new Error('cannot handle action in reducer');
};

function Gotit(props) {
  const [options, setOptions] = useState({
    debug: true,
    maxSnackbars: 5,
    padding: 5,
    stackDirection: 'bottom',
    ...props,
  });
  const [state, dispatch] = useReducer(reducer, {
    ...defaultContext,
  });
  const snackbarArrayRef = useRef([]);
  const notify = useCallback((option) => {
    const newOption = {
      ...option,
      gotit: {
        ...option.gotit,
        id: uuidv4(),
      },
    };
    dispatch({
      type: state.actions.addNotification,
      payload: {
        notification: newOption,
      },
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: state.actions.replace,
      payload: {
        notify,
      },
    });
  }, [notify]);

  const getDebugUi = useCallback((ctx) => {
    if (ctx.notify) {
      return (
        <div style={{
          position: 'fixed', top: 0, right: 0, zIndex: 999,
        }}
        >
          <span style={{ color: 'white' }}>
            {/* {JSON.stringify(ctx.notifications)} */}
          </span>
          {/* eslint-disable-next-line max-len */}
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label,react/button-has-type */}
          <button
            type="button"
            onClick={() => {
              console.debug('debug gotit - debug onClick', { ctx });
              notify({
                snackbar: {
                  open: true,
                  autoHideDuration: 5000,
                  anchorOrigin: { vertical: 'top', horizontal: 'right' },
                },
                alert: {
                  severity: 'success',
                  sx: { color: 'secondary.main' },
                },
                gotit: {
                  component: (
                    <div>
                      141x
                      {Math.random()}
                    </div>
                  ),
                },
              });
            }}
          >
            test custom component
          </button>
          <button
            type="button"
            onClick={() => {
              console.debug('debug gotit - debug onClick', { ctx });
              const style = css`
                .MuiSnackbarContent-root{
                  color: blue;
                }
                .MuiSnackbarContent-action{
                  color: purple;
                  width: 100%;
                  margin: 0;
                  padding: 0;
                }
                .MuiSnackbarContent-message{
                  color: brown";
                  width: 100%;
                  margin: 0;
                  padding: 0;
                }
              `;
              const gotitOptions = {
                snackbar: {
                  open: true,
                  autoHideDuration: 5000,
                  anchorOrigin: { vertical: 'top', horizontal: 'right' },
                  ContentProps: {
                    style: {
                      // color: 'green',
                    },
                  },
                  css: style,
                  TransitionComponent: Slide,
                  action: (
                    <div style={{
                      display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    }}
                    >
                      <Typography
                        variant="body1"
                        style={{
                          display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        some cool text
                      </Typography>
                      <Button
                        style={{
                          alignSelf: 'center',
                        }}
                        variant="outlined"
                        size="small"
                        onClick={() => { alert('gotit - action test - undo'); }}
                        sx={{ color: 'secondary.main' }}
                      >
                        UNDO
                      </Button>
                      <IconButton
                        color="primary"
                        onClick={() => { alert('gotit - action test - close'); }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  ),
                },
                alert: {
                  severity: 'success',
                  sx: { color: 'secondary.main' },
                },
                gotit: {
                  component: (
                    <div>
                      141x
                      {Math.random()}
                    </div>
                  ),
                },
              };
              notify(gotitOptions);
            }}
          >
            test action
          </button>
        </div>
      );
    }
    return null;
  }, []);

  const close = useCallback((event, reason, option) => {
    console.log('gotit - onClose', {
      reason, id: option.gotit.id, option, event,
    });
    if (reason === 'timeout') {
      dispatch({
        type: state.actions.removeNotification,
        payload: {
          notification: option,
        },
      });
    }
  }, []);

  return (
    <div className="gotit-notification" style={{ ...props.style }}>
      {options.debug ? (
        getDebugUi(state)
      ) : null}
      <GotitContext.Provider value={{ ...state, dispatch }}>
        {props.children}
        {state.notifications
          .map((option, i) => (
            <Snackbar
              ref={(ref) => { snackbarArrayRef.current[i] = ref; }}
              key={option.gotit.id}
              className={`gotit-${option.gotit.id}`}
              style={{
                transform: `translateY(${(() => {
                  const sign = options.stackDirection === 'top' ? -1 : 1;
                  const shift = snackbarArrayRef.current
                    .filter((e, index) => index < i)
                    .reduce((acc, curr) => {
                      const diff = curr.clientHeight;
                      return acc + diff;
                    }, 0) || 0;
                  return sign * (shift + options.padding);
                })()}px)`,
                transition: options.transition || 'all 1s',
              }}
              {...option.snackbar}
              onClose={(event, reason) => {
                close(event, reason, option);
              }}
            >
              {(() => {
                if (option.gotit.component && !!option.snackbar.action === false) {
                  return (
                    <Alert
                      key={option.gotit.id}
                      {...option.alert}
                    >
                      {option.gotit.component}
                    </Alert>
                  );
                }
                return null;
              })()}
            </Snackbar>
          ))}
      </GotitContext.Provider>
    </div>
  );
}

export {
  GotitContext,
  Gotit,
};
