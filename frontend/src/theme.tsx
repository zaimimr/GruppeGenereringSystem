import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#c89efc',
      main: '#BB86FC',
      dark: '#825db0',
      contrastText: '#000',
    },
    secondary: {
      light: '#35e1d0',
      main: '#03DAC5',
      dark: '#018786',
      contrastText: '#000',
    },
    error: {
      light: '#bf334c',
      main: '#B00020',
      dark: '#7b0016',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#F2F2F2',
      secondary: '#aaaaaa',
    },
  },
  typography: {
    fontFamily: 'Roboto',
    h1: {
      fontSize: '32px',
      fontWeight: 'bold',
    },
    h2: {
      fontSize: '24px',
    },
    body1: {
      fontSize: '18px',
    },
    body2: {
      fontSize: '12px',
    },
  },
  spacing: 4,
  shape: {
    borderRadius: 5,
  },
});

theme.overrides = {
  ...theme.overrides,
  MuiOutlinedInput: {
    root: {
      '& $notchedOutline': {
        borderColor: '#F2F2F2',
      },
    },
  },
  MuiButton: {
    textSecondary: {
      '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.secondary.dark,
      },
    },
    containedPrimary: {
      '&:hover': {
        color: theme.palette.text.primary,
      },
    },
  },
  MuiPaper: {
    root: {
      padding: 20,
    },
    elevation4: {
      boxShadow: 'unset',
    },
  },
  // @ts-ignore
  MuiDataGrid: {
    root: {
      backgroundColor: theme.palette.background.paper,
      border: 'unset',
    },
  },
  MuiTooltip: {
    popper: {
      whiteSpace: 'pre-line',
    },
    tooltip: {
      fontSize: '12px',
    },
  },
};

export default theme;
