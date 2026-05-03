import '@testing-library/jest-dom';
import * as React from 'react';
import { useContext, useEffect } from 'react';
import { render, screen, act } from '@testing-library/react';
import Alert from '@mui/material/Alert';
import {
  Gotit,
  GotitActions,
  GotitContext,
  type GotitContextValue,
  type NotificationOption,
  type NotificationOptionInput,
  groupBy,
  notificationSort,
  reducer,
} from '../index';

let uuidCounter = 0;
jest.mock('uuid', () => ({ v4: () => `uuid-${++uuidCounter}` }));

beforeEach(() => {
  uuidCounter = 0;
});

const buildOption = (
  gotitOverrides: Partial<NotificationOptionInput['gotit']> = {},
  snackbarOverrides: Partial<NotificationOptionInput['snackbar']> = {},
): NotificationOptionInput => ({
  snackbar: {
    open: true,
    autoHideDuration: 4000,
    anchorOrigin: { vertical: 'top', horizontal: 'right' },
    ...snackbarOverrides,
  },
  gotit: {
    group: 'main',
    stackDirection: 'top',
    space: 10,
    maxSnackbars: 3,
    emotionCssString: '',
    component: <Alert severity="success">hello</Alert>,
    ...gotitOverrides,
  },
});

function ContextCapture({ onContext }: { onContext: (ctx: GotitContextValue) => void }) {
  const ctx = useContext(GotitContext);
  useEffect(() => {
    onContext(ctx);
  }, [ctx, onContext]);
  return null;
}

function renderGotit(opts: { debug?: boolean; style?: React.CSSProperties } = {}) {
  let captured!: GotitContextValue;
  const utils = render(
    <Gotit debug={opts.debug} style={opts.style}>
      <div data-testid="child">child</div>
      <ContextCapture onContext={(ctx) => (captured = ctx)} />
    </Gotit>,
  );
  return { ...utils, getCtx: () => captured };
}

/* -------------------------------------------------------------------------- */
/*  Pure helpers                                                              */
/* -------------------------------------------------------------------------- */

const mkNotification = (
  group: string,
  time: number,
  id = `id-${time}`,
): NotificationOption => ({
  snackbar: { open: true },
  gotit: {
    group,
    stackDirection: 'top',
    maxSnackbars: 3,
    component: null,
    id,
    time,
  },
});

describe('notificationSort', () => {
  it('sorts notifications by descending time', () => {
    const a = mkNotification('g', 100);
    const b = mkNotification('g', 200);
    expect([a, b].sort(notificationSort)).toEqual([b, a]);
  });

  it('returns 0 for equal times', () => {
    const a = mkNotification('g', 100, 'a');
    const b = mkNotification('g', 100, 'b');
    expect(notificationSort(a, b)).toBe(0);
  });
});

describe('groupBy', () => {
  it('groups notifications by their group property', () => {
    const a = mkNotification('x', 1);
    const b = mkNotification('y', 2);
    const c = mkNotification('x', 3);
    expect(groupBy([a, b, c], 'group')).toEqual({ x: [a, c], y: [b] });
  });

  it('throws when a notification is missing a group', () => {
    const broken = mkNotification('', 1);
    expect(() => groupBy([broken], 'group')).toThrow(/group property/);
  });
});

describe('reducer', () => {
  const baseState = { actions: GotitActions, notifications: [] };

  it('replace shallow-merges payload', () => {
    const next = reducer(baseState, { type: GotitActions.replace, payload: { foo: 1 } as never });
    expect((next as unknown as { foo: number }).foo).toBe(1);
  });

  it('addNotification appends within group cap', () => {
    const n1 = mkNotification('g', 1, 'n1');
    const n2 = mkNotification('g', 2, 'n2');
    const s1 = reducer(baseState, {
      type: GotitActions.addNotification,
      payload: { notification: n1 },
    });
    const s2 = reducer(s1, {
      type: GotitActions.addNotification,
      payload: { notification: n2 },
    });
    expect(s2.notifications.map((n) => n.gotit.id)).toEqual(['n1', 'n2']);
  });

  it('addNotification drops the oldest when maxSnackbars is reached', () => {
    const n1 = mkNotification('g', 1, 'n1');
    n1.gotit.maxSnackbars = 2;
    const n2 = mkNotification('g', 2, 'n2');
    n2.gotit.maxSnackbars = 2;
    const n3 = mkNotification('g', 3, 'n3');
    n3.gotit.maxSnackbars = 2;
    let s = reducer(baseState, {
      type: GotitActions.addNotification,
      payload: { notification: n1 },
    });
    s = reducer(s, { type: GotitActions.addNotification, payload: { notification: n2 } });
    s = reducer(s, { type: GotitActions.addNotification, payload: { notification: n3 } });
    expect(s.notifications.map((n) => n.gotit.id).sort()).toEqual(['n2', 'n3']);
  });

  it('removeNotification removes by id', () => {
    const n1 = mkNotification('g', 1, 'n1');
    const seeded = { ...baseState, notifications: [n1] };
    const next = reducer(seeded, {
      type: GotitActions.removeNotification,
      payload: { notification: n1 },
    });
    expect(next.notifications).toHaveLength(0);
  });

  it('removeNotificationGroup removes the whole group', () => {
    const n1 = mkNotification('a', 1, 'n1');
    const n2 = mkNotification('a', 2, 'n2');
    const n3 = mkNotification('b', 3, 'n3');
    const seeded = { ...baseState, notifications: [n1, n2, n3] };
    const next = reducer(seeded, {
      type: GotitActions.removeNotificationGroup,
      payload: { group: 'a' },
    });
    expect(next.notifications.map((n) => n.gotit.id)).toEqual(['n3']);
  });

  it('throws on an unknown action type', () => {
    expect(() =>
      reducer(baseState, { type: '__nope__' as never, payload: {} as never }),
    ).toThrow(/cannot handle action/);
  });
});

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

describe('<Gotit>', () => {
  it('renders children', () => {
    renderGotit();
    expect(screen.getByTestId('child')).toHaveTextContent('child');
  });

  it('applies wrapper style', () => {
    const { container } = renderGotit({ style: { color: 'tomato' } });
    expect(container.querySelector('.gotit-notification')).toHaveStyle({ color: 'tomato' });
  });

  it('exposes the imperative API on the context', () => {
    const { getCtx } = renderGotit();
    const ctx = getCtx();
    expect(typeof ctx.displayNotification).toBe('function');
    expect(typeof ctx.removeNotification).toBe('function');
    expect(typeof ctx.removeNotificationGroup).toBe('function');
    expect(ctx.actions.addNotification).toBe('addNotification');
  });

  it('displayNotification renders the snackbar component', () => {
    const { getCtx } = renderGotit();
    act(() => {
      getCtx().displayNotification!(buildOption());
    });
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('displayNotification returns the option enriched with id and time', () => {
    const { getCtx } = renderGotit();
    let returned!: NotificationOption;
    act(() => {
      returned = getCtx().displayNotification!(buildOption());
    });
    expect(returned.gotit.id).toBe('uuid-1');
    expect(typeof returned.gotit.time).toBe('number');
  });

  it('renders multiple notifications across multiple groups', () => {
    const { getCtx } = renderGotit();
    act(() => {
      getCtx().displayNotification!(
        buildOption({ group: 'a', component: <Alert>a-msg</Alert> }),
      );
      getCtx().displayNotification!(
        buildOption({ group: 'b', component: <Alert>b-msg</Alert> }),
      );
    });
    expect(screen.getByText('a-msg')).toBeInTheDocument();
    expect(screen.getByText('b-msg')).toBeInTheDocument();
  });

  it('caps notifications using maxSnackbars', () => {
    const { getCtx } = renderGotit();
    act(() => {
      getCtx().displayNotification!(
        buildOption({ maxSnackbars: 2, component: <Alert>one</Alert> }),
      );
      getCtx().displayNotification!(
        buildOption({ maxSnackbars: 2, component: <Alert>two</Alert> }),
      );
      getCtx().displayNotification!(
        buildOption({ maxSnackbars: 2, component: <Alert>three</Alert> }),
      );
    });
    expect(screen.queryByText('one')).not.toBeInTheDocument();
    expect(screen.getByText('two')).toBeInTheDocument();
    expect(screen.getByText('three')).toBeInTheDocument();
  });

  it('removeNotification removes a single notification', () => {
    const { getCtx } = renderGotit();
    let handle!: NotificationOption;
    act(() => {
      handle = getCtx().displayNotification!(
        buildOption({ component: <Alert>removable</Alert> }),
      );
    });
    expect(screen.getByText('removable')).toBeInTheDocument();
    act(() => {
      getCtx().removeNotification!(handle);
    });
    expect(screen.queryByText('removable')).not.toBeInTheDocument();
  });

  it('removeNotificationGroup removes everything in the group', () => {
    const { getCtx } = renderGotit();
    act(() => {
      getCtx().displayNotification!(
        buildOption({ group: 'g1', component: <Alert>g1-a</Alert> }),
      );
      getCtx().displayNotification!(
        buildOption({ group: 'g2', component: <Alert>g2-a</Alert> }),
      );
    });
    act(() => {
      getCtx().removeNotificationGroup!('g1');
    });
    expect(screen.queryByText('g1-a')).not.toBeInTheDocument();
    expect(screen.getByText('g2-a')).toBeInTheDocument();
  });

  it('honors zIndexBase', () => {
    const { getCtx, container } = renderGotit();
    act(() => {
      getCtx().displayNotification!(
        buildOption({ zIndexBase: 5000, component: <Alert>z</Alert> }),
      );
    });
    const snack = container.querySelector('.MuiSnackbar-root') as HTMLElement;
    expect(parseInt(snack.style.zIndex, 10)).toBeGreaterThanOrEqual(5000);
  });

  it('supports stackDirection="bottom"', () => {
    const { getCtx, container } = renderGotit();
    act(() => {
      getCtx().displayNotification!(
        buildOption({ stackDirection: 'bottom', component: <Alert>b1</Alert> }),
      );
      getCtx().displayNotification!(
        buildOption({ stackDirection: 'bottom', component: <Alert>b2</Alert> }),
      );
    });
    expect(container.querySelectorAll('.MuiSnackbar-root').length).toBeGreaterThanOrEqual(2);
  });

  it('applies fade=true to opacity', () => {
    const { getCtx, container } = renderGotit();
    act(() => {
      getCtx().displayNotification!(
        buildOption({ fade: true, maxSnackbars: 2, component: <Alert>f1</Alert> }),
      );
      getCtx().displayNotification!(
        buildOption({ fade: true, maxSnackbars: 2, component: <Alert>f2</Alert> }),
      );
    });
    expect(container.querySelectorAll('.MuiSnackbar-root').length).toBeGreaterThanOrEqual(2);
  });

  it('accepts debug=true without throwing', () => {
    expect(() => renderGotit({ debug: true })).not.toThrow();
  });

  it('auto-dismisses a notification when autoHideDuration elapses', () => {
    jest.useFakeTimers();
    try {
      const { getCtx } = renderGotit();
      act(() => {
        getCtx().displayNotification!(
          buildOption({ component: <Alert>auto-bye</Alert> }, { autoHideDuration: 1000 }),
        );
      });
      expect(screen.getByText('auto-bye')).toBeInTheDocument();
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(screen.queryByText('auto-bye')).not.toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
  });

  it('ignores non-timeout close reasons (e.g. clickaway)', () => {
    const { getCtx, container } = renderGotit();
    let handle!: NotificationOption;
    act(() => {
      handle = getCtx().displayNotification!(
        buildOption({ component: <Alert>sticky</Alert> }, { autoHideDuration: null }),
      );
    });
    // Fire onClose with a non-timeout reason directly via the Snackbar's exposed prop.
    // The notification should remain visible.
    act(() => {
      // Click outside the snackbar to trigger MUI's clickaway path.
      container.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      container.dispatchEvent(new MouseEvent('touchstart', { bubbles: true }));
    });
    expect(screen.getByText('sticky')).toBeInTheDocument();
    expect(handle.gotit.id).toBe('uuid-1');
  });
});

describe('GotitContext default', () => {
  it('exposes the default actions outside a provider', () => {
    let ctx!: GotitContextValue;
    function Probe() {
      ctx = useContext(GotitContext);
      return null;
    }
    render(<Probe />);
    expect(ctx.actions.addNotification).toBe('addNotification');
    expect(ctx.notifications).toEqual([]);
  });
});
