import * as React from 'react';
import {
  useEffect, useState, useRef, useCallback, useReducer,
} from 'react';
import * as loglevel from 'loglevel';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';
import Slide from '@mui/material/Slide';
/** @jsxImportSource @emotion/react */
import { css, jsx } from '@emotion/react'

const log = loglevel.getLogger('gotit.js');

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
    let max = action.payload.notification.gotit.maxSnackbars;
    let capped = prevState.notifications;
    if(prevState.notifications.length >= max){
      capped = capped.slice(-1 * (max-1));
    }
    const newState = {
      ...prevState,
      notifications: [
        ...capped,
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
    debug: props.debug || false,
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
    if(props.debug){
      log.setLevel(log.levels.DEBUG);
    } else {
      log.setLevel(log.levels.WARN);
    }
  }, [props.debug])

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
                  const sign = option.gotit.stackDirection === 'top' ? -1 : 1;
                  const shift = snackbarArrayRef.current
                    .filter((e, index) => index < i)
                    .reduce((acc, curr) => {
                      const diff = curr.clientHeight;
                      return acc + diff;
                    }, 0) || 0;
                  return sign * (shift + options.padding);
                })()}px)`,
                transition: options.transition || 'all 1.2s',
              }}
              onClose={(event, reason) => {
                close(event, reason, option);
              }}
              {...option.snackbar}
              css={
                css`${option.gotit.emotionCssString}`
              }
            >
              {option.gotit.component}
            </Snackbar>
          ))}
      </GotitContext.Provider>
    </div>
  );
}

export { Gotit };
export { GotitContext };
