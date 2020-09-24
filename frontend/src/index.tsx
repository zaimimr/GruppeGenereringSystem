import 'index.css';

import { Container, ThemeProvider } from '@material-ui/core';
import { GroupProvider } from 'context/GroupsContext';
import React from 'react';
import ReactDOM from 'react-dom';
import { ModalProvider } from 'react-modal-hook';
import theme from 'theme';
import Invitation from 'views/Invitation/Invitation';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ModalProvider>
        <GroupProvider>
          <Container maxWidth='md'>
            <Invitation title='Gruppe generering' />
          </Container>
        </GroupProvider>
      </ModalProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
