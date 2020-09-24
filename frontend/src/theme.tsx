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
  },
  MuiGrid: {
    container: {},
  },
};

export default theme;

// $primary_gray: #121212;
// $secondary_gray: #1E1E1E;
// $hover_gray: #2D2D2D;

// $primary_white: #F2F2F2;
// $hover_white: #aaaaaa;

// $primary_purple: #BB86FC;
// $secondary_purple: #742ccc;

// $primary_teal: #03DAC5;
// $secondary_teal: #018786;

// $error_red: #B00020;
