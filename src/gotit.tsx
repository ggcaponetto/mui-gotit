import * as React from 'react';
import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import * as loglevel from 'loglevel';
import Snackbar, { type SnackbarProps } from '@mui/material/Snackbar';
import { v4 as uuidv4 } from 'uuid';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const log = loglevel.getLogger('mui-gotit');

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type StackDirection = 'top' | 'bottom';

export interface GotitConfig {
  /** Logical stack name. Required. */
  group: string;
  /** Direction the stack grows toward. Default `"top"`. */
  stackDirection?: StackDirection;
  /** Maximum simultaneous notifications in this group. Oldest is dropped. */
  maxSnackbars: number;
  /** Pixel gap between stacked snackbars. */
  space?: number;
  /** Fade older notifications in the stack. */
  fade?: boolean;
  /** Floor z-index — useful when above modals. */
  zIndexBase?: number;
  /** Per-notification Emotion css string. */
  emotionCssString?: string;
  /** Body of the snackbar. */
  component: ReactNode;
}

export interface GotitConfigInternal extends GotitConfig {
  /** Assigned by `displayNotification`. */
  id: string;
  /** Assigned by `displayNotification` (`performance.now()`). */
  time: number;
}

export interface NotificationOptionInput {
  snackbar: SnackbarProps;
  gotit: GotitConfig;
}

export interface NotificationOption extends NotificationOptionInput {
  gotit: GotitConfigInternal;
}

export const GotitActions = {
  replace: 'replace',
  addNotification: 'addNotification',
  removeNotification: 'removeNotification',
  removeNotificationGroup: 'removeNotificationGroup',
  updateNotification: 'updateNotification',
} as const;

export type GotitActionType = (typeof GotitActions)[keyof typeof GotitActions];

type Action =
  | { type: typeof GotitActions.replace; payload: Partial<GotitState> }
  | { type: typeof GotitActions.addNotification; payload: { notification: NotificationOption } }
  | { type: typeof GotitActions.removeNotification; payload: { notification: NotificationOption } }
  | { type: typeof GotitActions.removeNotificationGroup; payload: { group: string } };

export interface GotitState {
  actions: typeof GotitActions;
  notifications: NotificationOption[];
  displayNotification?: (option: NotificationOptionInput) => NotificationOption;
  removeNotification?: (option: NotificationOption) => NotificationOption;
  removeNotificationGroup?: (group: string) => string;
  [key: string]: unknown;
}

export interface GotitContextValue extends GotitState {
  dispatch: React.Dispatch<Action>;
}

export interface GotitProps {
  /** Enables debug logging via `loglevel`. */
  debug?: boolean;
  /** Optional style applied to the wrapper div. */
  style?: CSSProperties;
  /** Optional CSS transition shorthand for stacked snackbars. */
  transition?: string;
  children?: ReactNode;
}

/* -------------------------------------------------------------------------- */
/*  Context                                                                   */
/* -------------------------------------------------------------------------- */

const defaultState: GotitState = {
  actions: GotitActions,
  notifications: [],
};

const noopDispatch: React.Dispatch<Action> = () => {
  // intentional: invoked only when consumed outside <Gotit>.
};

export const GotitContext = createContext<GotitContextValue>({
  ...defaultState,
  dispatch: noopDispatch,
});

/* -------------------------------------------------------------------------- */
/*  Pure helpers (exported for unit tests)                                    */
/* -------------------------------------------------------------------------- */

export const notificationSort = (a: NotificationOption, b: NotificationOption): number => {
  if (a.gotit.time > b.gotit.time) return -1;
  if (a.gotit.time < b.gotit.time) return 1;
  return 0;
};

export const groupBy = <T extends NotificationOption>(
  arr: T[],
  property: keyof GotitConfigInternal,
): Record<string, T[]> => {
  return arr.reduce<Record<string, T[]>>((acc, curr) => {
    const group = curr.gotit?.[property] as unknown as string | undefined;
    if (!group) {
      throw new Error('the notification has to have a group property');
    }
    if (acc[group] === undefined) {
      acc[group] = [curr];
    } else {
      acc[group].push(curr);
    }
    return acc;
  }, {});
};

export const reducer = (prevState: GotitState, action: Action): GotitState => {
  switch (action.type) {
    case GotitActions.replace:
      return { ...prevState, ...action.payload };

    case GotitActions.addNotification: {
      const { notification } = action.payload;
      const { group, maxSnackbars } = notification.gotit;
      const grouped = groupBy(prevState.notifications, 'group');
      const groupedByCurrent = grouped[group] ?? [];
      groupedByCurrent.sort(notificationSort).reverse();
      if (groupedByCurrent.length >= maxSnackbars) {
        groupedByCurrent.shift();
      }
      groupedByCurrent.push(notification);
      return {
        ...prevState,
        notifications: [
          ...prevState.notifications.filter((n) => n.gotit.group !== group),
          ...groupedByCurrent,
        ],
      };
    }

    case GotitActions.removeNotification:
      return {
        ...prevState,
        notifications: prevState.notifications.filter(
          (n) => n.gotit.id !== action.payload.notification.gotit.id,
        ),
      };

    case GotitActions.removeNotificationGroup:
      return {
        ...prevState,
        notifications: prevState.notifications.filter(
          (n) => n.gotit.group !== action.payload.group,
        ),
      };

    default: {
      const exhaustive: never = action;
      throw new Error(`cannot handle action in reducer: ${JSON.stringify(exhaustive)}`);
    }
  }
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

interface SnackbarRefEntry {
  groupKey: string;
  keyIndex: number;
  optionIndex: number;
  ref: HTMLDivElement | null;
}

export function Gotit(props: GotitProps): JSX.Element {
  const [options] = useState({ debug: props.debug ?? false, ...props });
  const [state, dispatch] = useReducer(reducer, defaultState);
  const snackbarRefs = useRef<Record<string, SnackbarRefEntry>>({});

  const displayNotification = useCallback(
    (option: NotificationOptionInput): NotificationOption => {
      const enriched: NotificationOption = {
        ...option,
        gotit: {
          ...option.gotit,
          id: uuidv4(),
          time: performance.now(),
        },
      };
      dispatch({
        type: GotitActions.addNotification,
        payload: { notification: enriched },
      });
      return enriched;
    },
    [],
  );

  const removeNotification = useCallback(
    (option: NotificationOption): NotificationOption => {
      dispatch({
        type: GotitActions.removeNotification,
        payload: { notification: option },
      });
      return option;
    },
    [],
  );

  const removeNotificationGroup = useCallback((group: string): string => {
    dispatch({
      type: GotitActions.removeNotificationGroup,
      payload: { group },
    });
    return group;
  }, []);

  useEffect(() => {
    log.setLevel(props.debug ? log.levels.DEBUG : log.levels.WARN);
  }, [props.debug]);

  useEffect(() => {
    dispatch({
      type: GotitActions.replace,
      payload: {
        displayNotification,
        removeNotification,
        removeNotificationGroup,
      },
    });
  }, [displayNotification, removeNotification, removeNotificationGroup]);

  const close = useCallback(
    (_event: React.SyntheticEvent | Event, reason: string, option: NotificationOption) => {
      if (reason === 'timeout') {
        dispatch({
          type: GotitActions.removeNotification,
          payload: { notification: option },
        });
      }
    },
    [],
  );

  const grouped = groupBy(state.notifications, 'group');

  return (
    <div className="gotit-notification" style={{ ...props.style }}>
      <GotitContext.Provider value={{ ...state, dispatch }}>
        {props.children}
        {Object.keys(grouped).map((groupKey, keyIndex) =>
          grouped[groupKey].sort(notificationSort).map((option, optionIndex) => {
            const sign = option.gotit.stackDirection === 'top' ? -1 : 1;
            const groupedSnackbars = Object.values(snackbarRefs.current).filter(
              (s) => s.groupKey === groupKey,
            );
            const shift =
              groupedSnackbars
                .filter((n) => n.ref && n.optionIndex < optionIndex)
                .reduce((acc, curr) => acc + (curr.ref?.clientHeight ?? 0) + (option.gotit.space ?? 0), 0) || 0;
            const opacity = option.gotit.fade
              ? 1 - optionIndex * (1 / option.gotit.maxSnackbars)
              : 1;
            const zIndexBase = option.gotit.zIndexBase ?? 0;

            return (
              <Snackbar
                ref={(ref) => {
                  snackbarRefs.current[`key_${keyIndex}_option_${optionIndex}`] = {
                    groupKey,
                    keyIndex,
                    optionIndex,
                    ref: ref as HTMLDivElement | null,
                  };
                }}
                key={option.gotit.id}
                className={`gotit-${option.gotit.id}`}
                style={{
                  transform: `translateY(${sign * shift}px)`,
                  opacity: `${opacity}`,
                  zIndex: `${zIndexBase + groupedSnackbars.length - optionIndex}`,
                  transition:
                    options.transition ?? (optionIndex === 0 ? 'all 0s' : 'all 1s'),
                }}
                onClose={(event, reason) => close(event, reason, option)}
                {...option.snackbar}
                css={css`
                  ${option.gotit.emotionCssString ?? ''}
                `}
              >
                {option.gotit.component as React.ReactElement}
              </Snackbar>
            );
          }),
        )}
      </GotitContext.Provider>
    </div>
  );
}
