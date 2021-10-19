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
    removeNotificationGroup: 'removeNotificationGroup',
    updateNotification: 'updateNotification',
  },
  notifications: [],
};
const GotitContext = React.createContext(defaultContext);

function Gotit(props) {
  const fnName = 'Gotit';
  const [options, setOptions] = useState({
    debug: props.debug || false,
    ...props,
  });

  let notificationSort = useCallback((a, b) => {
    if(a.gotit.time > b.gotit.time){
      return -1;
    } else if(a.gotit.time < b.gotit.time){
      return 1
    } else {
      return 0
    }
  }, []);

  let groupBy = useCallback((objArray, gotitProperty) => {
    let grouped = objArray.reduce((acc, curr) => {
      let group = curr.gotit && curr.gotit[`${gotitProperty}`];
      if(!group){
        log.debug(`${fnName} - groupBy - pre`, {
          group, gotitProperty
        });
        throw new Error("the notification has to have a group property");
      }
      if (
        group && acc[`${group}`] === undefined
      ) {
        acc[`${group}`] = [curr];
      } else {
        acc[`${group}`].push(curr);
      }
      return acc;
    }, {});
    log.debug(`${fnName} - groupBy`, {
      grouped, objArray, gotitProperty
    });
    return grouped;
  }, []);


  const reducer = (prevState, action) => {
    const fnName = 'Gotit';
    log.debug(`${fnName} - reducer ${action.type} - old state`, { prevState, action });
    if (action.type === defaultContext.actions.replace) {
      const newState = { ...prevState, ...action.payload };
      log.debug(`${fnName} - reducer ${action.type} - new state`, { action, prevState, newState });
      return newState;
    }
    if (action.type === defaultContext.actions.addNotification) {
      let group = action.payload.notification.gotit.group;
      let grouped = groupBy(prevState.notifications, "group");

      let groupedByCurrent = grouped[`${group}`] || [];
      groupedByCurrent.sort(notificationSort).reverse();

      let max = action.payload.notification.gotit.maxSnackbars;
      if(groupedByCurrent.length >= max){
        groupedByCurrent.shift();
      }
      groupedByCurrent.push(action.payload.notification)

      const newState = {
        ...prevState,
        notifications: [
          ...prevState.notifications.filter(n => n.gotit.group !== group),
          ...groupedByCurrent,
        ],
      };
      log.debug(`${fnName} - reducer ${action.type} - new state`, { action, prevState, newState, group });
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
    if (action.type === defaultContext.actions.removeNotificationGroup) {
      const newState = {
        ...prevState,
        notifications: [
          ...prevState.notifications
            .filter((option) => option.gotit.group !== action.payload.group),
        ],
      };
      log.debug(`${fnName} - reducer ${action.type} - new state`, { action, prevState, newState });
      return newState;
    }
    throw new Error('cannot handle action in reducer');
  };

  const [state, dispatch] = useReducer(reducer, {
    ...defaultContext,
  });
  const snackbarArrayRef = useRef({});
  const displayNotification = useCallback((option) => {
    const newOption = {
      ...option,
      gotit: {
        ...option.gotit,
        id: uuidv4(),
        time: performance.now()
      },
    };
    dispatch({
      type: state.actions.addNotification,
      payload: {
        notification: newOption,
      },
    });
    return newOption;
  }, []);

  const removeNotification = useCallback((option) => {
    dispatch({
      type: state.actions.removeNotification,
      payload: {
        notification: option,
      },
    });
    return option;
  }, []);

  const removeNotificationGroup = useCallback((group) => {
    dispatch({
      type: state.actions.removeNotificationGroup,
      payload: {
        group,
      },
    });
    return group;
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
        removeNotification,
        removeNotificationGroup
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
        {(()=>{
          let grouped = groupBy(state.notifications, "group");
          return Object.keys(grouped)
            .map((groupKey, keyIndex) => {
              let notificationGroup = grouped[groupKey];
              return notificationGroup
                .sort(notificationSort)
                .map((option, optionIndex) => (
                  <Snackbar
                    ref={(ref) => { snackbarArrayRef.current[`key_${keyIndex}_option_${optionIndex}`] = { groupKey, keyIndex, optionIndex, ref }; }}
                    key={option.gotit.id}
                    className={`gotit-${option.gotit.id}`}
                    style={{
                      transform: `translateY(${(() => {
                        const sign = option.gotit.stackDirection === 'top' ? -1 : 1;
                        const groupedSnackbars = [];
                        Object.keys(snackbarArrayRef.current).forEach(key => {
                          if(snackbarArrayRef.current[`${key}`].groupKey === groupKey){
                            groupedSnackbars.push(snackbarArrayRef.current[`${key}`])
                          }
                        });
                        log.debug(`${fnName} - snacks`, {
                          snacks: snackbarArrayRef.current, groupedSnackbars
                        });
                        const shift = groupedSnackbars
                          .filter(notification => notification.ref && notification.optionIndex < optionIndex)
                          .reduce((acc, curr) => {
                            const diff = curr.ref.clientHeight;
                            return acc + diff + (option.gotit.space || 0);
                          }, 0) || 0;
                        return sign * (shift);
                      })()}px)`,
                      opacity: `${(() => {
                        if(option.gotit.fade){
                          let step = 1 / option.gotit.maxSnackbars;
                          return 1 - optionIndex * step 
                        }
                        return 1;
                      })()}`,
                      zIndex: `${(() => {
                        const groupedSnackbars = [];
                        Object.keys(snackbarArrayRef.current).forEach(key => {
                          if (snackbarArrayRef.current[
                          `${key}`].groupKey === groupKey){
                            groupedSnackbars.push(snackbarArrayRef.current[`${key}`])
                          }
                        });
                        let base = 0;
                        if(option.gotit.zIndexBase !== undefined){
                          base = option.gotit.zIndexBase;
                        }
                        return base + groupedSnackbars.length - optionIndex;
                      })()}`,
                      transition: options.transition || `${(()=>{
                        if(optionIndex == 0){
                          return 'all 0s'
                        }
                        return 'all 1s'
                      })()}`,
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
                ))
            })
        })()}
      </GotitContext.Provider>
    </div>
  );
}

export { Gotit };
export { GotitContext };
