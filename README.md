<p align="center">
  <img src="https://raw.githubusercontent.com/ggcaponetto/mui-gotit/main/images/gotit-logo.png" alt="mui-gotit logo" width="180">
</p>

<h1 align="center">mui-gotit</h1>

<p align="center">
  Stacked, grouped, fully-typed Snackbars for <a href="https://mui.com">Material&nbsp;UI&nbsp;6</a> and React&nbsp;18.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/mui-gotit"><img src="https://img.shields.io/npm/v/mui-gotit.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/mui-gotit"><img src="https://img.shields.io/npm/dm/mui-gotit.svg?style=flat-square" alt="npm downloads"></a>
  <a href="https://github.com/ggcaponetto/mui-gotit/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/ggcaponetto/mui-gotit/ci.yml?branch=main&style=flat-square" alt="CI"></a>
  <a href="https://github.com/ggcaponetto/mui-gotit/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/mui-gotit.svg?style=flat-square" alt="license"></a>
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="typescript">
</p>

---

## Why mui-gotit?

A tiny, opinionated wrapper around MUI's `<Snackbar/>` that adds the things you usually rebuild yourself:

- **Imperative API** — fire notifications from anywhere via React Context.
- **Stacking** — multiple notifications stack cleanly, upward or downward.
- **Groups** — independent stacks (e.g. `"toast"`, `"errors"`) that don't fight each other.
- **Per-notification styling** — pass an Emotion `css` string per Snackbar.
- **Strictly typed** — first-class TypeScript types, no `any` in the public API.
- **Stays out of the way** — small, single-file implementation that tracks new MUI versions easily.

Inspired by [notistack](https://github.com/iamhosseindhv/notistack), but built around MUI 6 theming and the `sx` prop.

---

## Installation

```bash
npm install mui-gotit
# or
pnpm add mui-gotit
# or
yarn add mui-gotit
```

### Peer dependencies

```jsonc
{
  "@emotion/react": ">=11.13.0",
  "@emotion/styled": ">=11.13.0",
  "@mui/material": ">=6.0.0",
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
}
```

---

## Quick start

```tsx
import { useContext } from 'react';
import { Gotit, GotitContext } from 'mui-gotit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

const theme = createTheme();

function Notifier() {
  const gotit = useContext(GotitContext);
  return (
    <Button
      onClick={() =>
        gotit.displayNotification?.({
          snackbar: {
            open: true,
            autoHideDuration: 4000,
            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          },
          gotit: {
            group: 'main',
            stackDirection: 'top',
            space: 10,
            maxSnackbars: 3,
            component: <Alert severity="success">Saved.</Alert>,
          },
        })
      }
    >
      Notify
    </Button>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Gotit>
        <Notifier />
      </Gotit>
    </ThemeProvider>
  );
}
```

### Live demos

- [Codesandbox — minimal](https://codesandbox.io/s/mui-gotit-minimal-u77gw?file=/src/App.js)
- [Codesandbox — customized](https://codesandbox.io/s/mui-gotit-qpyrl?file=/src/App.js)

---

## API

### `<Gotit>` props — `GotitProps`

| Prop         | Type            | Default | Description                                                 |
| ------------ | --------------- | ------- | ----------------------------------------------------------- |
| `debug`      | `boolean`       | `false` | Enables `loglevel`-based debug logs.                        |
| `style`      | `CSSProperties` | `{}`    | Style applied to the `.gotit-notification` wrapper `<div>`. |
| `transition` | `string`        | auto    | Override the CSS `transition` shorthand for stacked items.  |
| `children`   | `ReactNode`     | —       | Your application tree.                                      |

### `GotitContext` — imperative API

| Member                           | Signature                        | Description                                                                       |
| -------------------------------- | -------------------------------- | --------------------------------------------------------------------------------- |
| `displayNotification(option)`    | `(option) => NotificationOption` | Renders a Snackbar. Returns the option enriched with `gotit.id` and `gotit.time`. |
| `removeNotification(handle)`     | `(handle) => NotificationOption` | Dismisses a single notification.                                                  |
| `removeNotificationGroup(group)` | `(group: string) => string`      | Dismisses every notification in a group.                                          |
| `notifications`                  | `NotificationOption[]`           | Current notifications in render order.                                            |
| `actions`                        | `typeof GotitActions`            | Reducer action-type constants.                                                    |
| `dispatch`                       | `Dispatch<Action>`               | Reducer dispatch (advanced use).                                                  |

### Notification option — `NotificationOptionInput`

```ts
interface NotificationOptionInput {
  snackbar: SnackbarProps; // Forwarded to MUI <Snackbar/>
  gotit: {
    group: string; // Logical stack name. Required.
    stackDirection?: 'top' | 'bottom'; // Default 'top'.
    maxSnackbars: number; // Cap per group; oldest is dropped.
    space?: number; // Pixel gap between snackbars.
    fade?: boolean; // Fade older snackbars in stack.
    zIndexBase?: number; // Floor z-index — useful above modals.
    emotionCssString?: string; // Per-notification Emotion CSS.
    component: ReactNode; // Body of the snackbar.
  };
}
```

---

## Recipes

### Dismiss a specific notification

```tsx
const handle = gotit.displayNotification!({
  /* ... */
});
gotit.removeNotification!(handle);
```

### Dismiss an entire group

```tsx
gotit.removeNotificationGroup!('uploads');
```

### Per-notification CSS via Emotion

```tsx
gotit.displayNotification!({
  snackbar: { open: true, autoHideDuration: 3000 },
  gotit: {
    group: 'main',
    stackDirection: 'top',
    maxSnackbars: 3,
    space: 10,
    emotionCssString: `
      .MuiSnackbarContent-root { background: #222; color: #fff; }
    `,
    component: <Alert severity="info">Custom-styled snack</Alert>,
  },
});
```

---

## Development

```bash
git clone https://github.com/ggcaponetto/mui-gotit
cd mui-gotit
npm install            # also installs husky pre-commit hook

npm run lint           # ESLint flat config
npm run format         # Prettier
npm run typecheck      # tsc --noEmit
npm test               # Jest unit tests
npm run test:coverage  # Jest with coverage report (thresholds enforced)
npm run test:e2e       # Cypress E2E inside my-app
npm run build          # Rollup → dist/{cjs,esm} + dist/index.d.ts
```

### Tooling

| Concern       | Tool                                           |
| ------------- | ---------------------------------------------- |
| Language      | TypeScript 5 (strict)                          |
| Bundler       | Rollup 4 (CJS + ESM + `.d.ts`)                 |
| Tests         | Jest 29 + ts-jest + jsdom + Testing Library 16 |
| Lint          | ESLint 9 (flat config) + typescript-eslint 8   |
| Format        | Prettier 3                                     |
| Git hooks     | Husky 9 + lint-staged 15 (`pre-commit`)        |
| CI            | GitHub Actions (Node 18 / 20 / 22)             |
| Coverage gate | 90% lines / 90% statements / 90% fns / 80% br  |

### Project layout

```
mui-gotit/
├── src/
│   ├── index.ts             # Public entry — re-exports
│   ├── gotit.tsx            # Library implementation
│   └── __tests__/           # Jest + RTL unit tests
├── my-app/                  # Demo app + Cypress E2E tests
├── .github/workflows/ci.yml # Lint + typecheck + test + build (matrix)
├── .husky/pre-commit        # Runs lint-staged
├── eslint.config.js         # Flat config
├── tsconfig.json            # Strict mode, declaration emit
├── rollup.config.mjs        # Bundle + .d.ts rollup
└── package.json             # Scripts, jest config, peers
```

### Pre-commit hook

`husky` runs `lint-staged` on every commit:

- `*.{ts,tsx,js,jsx}` → `eslint --fix` + `prettier --write`
- `*.{json,md,yml,yaml,css}` → `prettier --write`

Skip in emergencies with `git commit --no-verify`.

---

## Migration from v1

- The library is now distributed as TypeScript with `.d.ts` types — **no API changes**.
- Peer-dependency floors moved to **React 18** and **MUI 6**. If you cannot upgrade, pin `mui-gotit@1.x`.
- `gotit-pragma-automatic.js` is gone; import from `mui-gotit` only — internal paths were never public.

---

## Contributing

Issues and PRs are welcome. Please:

1. Open an issue describing the change first if it is non-trivial.
2. Add or update unit tests under [src/**tests**](src/__tests__).
3. Make sure `npm run lint`, `npm run typecheck` and `npm test` pass — coverage thresholds are enforced.

---

## Sponsors

This project is used and sponsored by the Cardano platform [https://141x.io](https://141x.io).
Sponsored by [BrowserStack](https://www.browserstack.com/).

If `mui-gotit` is useful to you, consider sending some ADA to
`addr1q9dta74g2axw39zf440w67vd0dyq7md4360q4cah3ev72q2hy6re7yfwwt4y246wh3r867l6sjnnlzwseug2t4jp97ps2ajcnh`
and reach out to be listed as a sponsor.

---

## License

[MIT](LICENSE) © Giuseppe Giulio Caponetto
