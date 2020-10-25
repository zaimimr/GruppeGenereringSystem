import 'index.css';

import { ThemeProvider } from '@material-ui/core';
import Navbar from 'components/Navbar';
import { SnackbarProvider } from 'context/SnakbarContext';
import { UserProvider } from 'context/UserContext';
import React from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom';
import { ModalProvider } from 'react-modal-hook';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import theme from 'theme';

import Routing from './Routing';
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CookiesProvider>
        <UserProvider>
          <SnackbarProvider>
            <ModalProvider>
              <Navbar />
              <Router>
                <Switch>
                  <Routing />
                </Switch>
              </Router>
            </ModalProvider>
          </SnackbarProvider>
        </UserProvider>
      </CookiesProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
