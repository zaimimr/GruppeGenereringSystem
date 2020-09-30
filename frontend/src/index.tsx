import 'index.css';

import { Container, ThemeProvider } from '@material-ui/core';
import { EventProvider } from 'context/EventContext';
import React from 'react';
import ReactDOM from 'react-dom';
import { ModalProvider } from 'react-modal-hook';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import theme from 'theme';
import Filter from 'views/Filter/Filter';
import Invitation from 'views/Invitation/Invitation';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ModalProvider>
        <Container maxWidth='md'>
          <Router>
            <Switch>
              <EventProvider>
                <Route exact path='/:eventId'>
                  <Invitation title='Gruppe generering' />
                </Route>
                <Route exact path='/filter/:eventId'>
                  <Filter title='Gruppe generering' />
                </Route>
              </EventProvider>
            </Switch>
          </Router>
        </Container>
      </ModalProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
