import { useContext } from 'react';
import { Box, Button, Container, Stack, Typography, Paper, Divider, Link } from '@mui/material';
import Alert from '@mui/material/Alert';
import { GotitContext } from 'mui-gotit';

const severities = ['success', 'info', 'warning', 'error'] as const;

export default function App() {
  const gotit = useContext(GotitContext);

  const fire = (
    severity: (typeof severities)[number],
    group: string,
    extras: Record<string, unknown> = {},
  ) =>
    gotit.displayNotification?.({
      snackbar: {
        open: true,
        autoHideDuration: 4000,
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      },
      gotit: {
        group,
        stackDirection: 'top',
        space: 10,
        maxSnackbars: 4,
        component: (
          <Alert severity={severity} variant="filled">
            {severity.toUpperCase()} — {new Date().toLocaleTimeString()}
          </Alert>
        ),
        ...extras,
      },
    });

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={700}>
          mui-gotit
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Stacked, grouped, fully-typed Snackbars for Material&nbsp;UI&nbsp;6 and React&nbsp;18.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Link href="https://github.com/ggcaponetto/mui-gotit" target="_blank" rel="noreferrer">
            GitHub
          </Link>{' '}
          ·{' '}
          <Link href="https://www.npmjs.com/package/mui-gotit" target="_blank" rel="noreferrer">
            npm
          </Link>
        </Typography>
      </Stack>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Severity
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Each click stacks a new snackbar in the <code>main</code> group.
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {severities.map((s) => (
            <Button key={s} variant="contained" color={s} onClick={() => fire(s, 'main')}>
              {s}
            </Button>
          ))}
          <Button variant="outlined" onClick={() => gotit.removeNotificationGroup?.('main')}>
            clear group
          </Button>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Independent groups
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Two stacks, anchored to different corners, that don&apos;t interfere.
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            variant="contained"
            onClick={() =>
              gotit.displayNotification?.({
                snackbar: {
                  open: true,
                  autoHideDuration: 4000,
                  anchorOrigin: { vertical: 'top', horizontal: 'left' },
                },
                gotit: {
                  group: 'top-left',
                  stackDirection: 'bottom',
                  space: 10,
                  maxSnackbars: 3,
                  component: <Alert severity="info">top-left snack</Alert>,
                },
              })
            }
          >
            top-left
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() =>
              gotit.displayNotification?.({
                snackbar: {
                  open: true,
                  autoHideDuration: 4000,
                  anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                },
                gotit: {
                  group: 'bottom-right',
                  stackDirection: 'top',
                  space: 10,
                  maxSnackbars: 3,
                  component: <Alert severity="success">bottom-right snack</Alert>,
                },
              })
            }
          >
            bottom-right
          </Button>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Fade + max stack
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Older items fade and the stack is capped at <code>maxSnackbars: 3</code>.
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            onClick={() => fire('info', 'fade-demo', { fade: true, maxSnackbars: 3 })}
          >
            spawn (fade=true)
          </Button>
          <Button variant="outlined" onClick={() => gotit.removeNotificationGroup?.('fade-demo')}>
            clear
          </Button>
        </Stack>
      </Paper>

      <Divider sx={{ my: 4 }} />
      <Box textAlign="center">
        <Typography variant="caption" color="text.secondary">
          Built with Vite + React 18 + MUI 6. View source on{' '}
          <Link
            href="https://github.com/ggcaponetto/mui-gotit/tree/main/demo"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </Link>
          .
        </Typography>
      </Box>
    </Container>
  );
}
