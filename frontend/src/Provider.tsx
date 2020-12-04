import { ThemeProvider } from '@material-ui/core';
import { EventProvider } from 'context/EventContext';
import { SnackbarProvider } from 'context/SnakbarContext';
import { UserProvider } from 'context/UserContext';
import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { ModalProvider } from 'react-modal-hook';
import theme from 'theme';
/**
 * Provider
 * @category Provider
 * @param {React.ReactNode} children
 * @return {React.Component} <Provider /> component
 * ""
 * @example
 *
 * return (
 *   <Provider>
 *    <div />
 *   </Provider
 * )
 */
function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CookiesProvider>
          <UserProvider>
            <EventProvider>
              <SnackbarProvider>
                <ModalProvider>{children}</ModalProvider>
              </SnackbarProvider>
            </EventProvider>
          </UserProvider>
        </CookiesProvider>
      </ThemeProvider>
    </>
  );
}

export default Provider;
