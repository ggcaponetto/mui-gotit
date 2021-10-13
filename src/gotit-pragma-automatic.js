import * as React from 'react';
import {
  useEffect, useState, useRef, useCallback, useReducer,
} from 'react';
import log from 'loglevel';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';
import Slide from '@mui/material/Slide';
/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react'

const logger = log.getLogger('gotit.js');

if (process.env.NODE_ENV === 'production') {
  logger.setLevel(log.levels.WARN);
} else {
  logger.setLevel(log.levels.DEBUG);
}

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
  const fnName = 'Gotit';
  log.debug(`${fnName} - reducer ${action.type} - old state`, { prevState, action });
  if (action.type === defaultContext.actions.replace) {
    const newState = { ...prevState, ...action.payload };
    log.debug(`${fnName} - reducer ${action.type} - new state`, { action, prevState, newState });
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
    log.debug(`${fnName} - reducer ${action.type} - new state`, { action, prevState, newState });
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
    log.debug(`${fnName} - reducer ${action.type} - new state`, { action, prevState, newState });
    return newState;
  }
  throw new Error('cannot handle action in reducer');
};

function Gotit(props) {
  const fnName = 'Gotit';
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
  const displayNotification = useCallback((option) => {
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
    log.debug(`${fnName} - useEffect - []`, props);
  }, []);

  useEffect(() => {
    log.debug(`${fnName} - useEffect - [state]`, { state });
  }, [state]);

  useEffect(() => {
    log.debug(`${fnName} - useEffect - [displayNotification]`, { displayNotification });
    dispatch({
      type: state.actions.replace,
      payload: {
        displayNotification,
      },
    });
  }, [displayNotification]);

  const getDebugUi = useCallback((ctx) => {
    if (ctx.displayNotification) {
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
              log.debug(`${fnName} - onClick`, { ctx });
              displayNotification({
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
              log.debug(`${fnName} - onClick`, { props });
              const gotitOptions = {
                snackbar: {
                  open: true,
                  autoHideDuration: 5000,
                  anchorOrigin: { vertical: 'top', horizontal: 'right' },
                  /*
                  ContentProps: {
                    style: {
                      color: 'green',
                    },
                  },
                  */
                  /* css: css``, */
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
              displayNotification(gotitOptions);
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
    log.debug(`${fnName} - close`, {
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

export { Gotit };
export { GotitContext };
