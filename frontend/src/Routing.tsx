import { Container } from '@material-ui/core';
import { EventProvider } from 'context/EventContext';
import React from 'react';
import { Route, Switch } from 'react-router';
import { useAuth } from 'utils/authentication';
import CreateEvent from 'views/CreateEvent/CreateEvent';
import Filter from 'views/Filter/Filter';
import Invitation from 'views/Invitation/Invitation';
import Join from 'views/Join/Join';
import Login from 'views/Login/Login';
import PresentGroup from 'views/PresentGroup/PresentGroup';

function Routing() {
  const hasAuth = useAuth();

  return (
    <>
      <Switch>
        <EventProvider>
          <Container maxWidth='sm'>
            <Route exact path='/'>
              {hasAuth ? <div>TODO: Bytt ut med event</div> : <Login />}
            </Route>
            {hasAuth && (
              <Route exact path='/create'>
                <CreateEvent />
              </Route>
            )}
          </Container>
          {hasAuth && (
            <Container maxWidth='md'>
              <Route exact path='/:eventId/present'>
                <PresentGroup title='Gruppe generering' />
              </Route>
              <Route exact path='/:eventId'>
                <Invitation title='Gruppe generering' />
              </Route>
              <Route exact path='/:eventId/filter'>
                <Filter title='Gruppe generering' />
              </Route>
              <Route exact path='/:eventId/join/:participantId'>
                <Join />
              </Route>
            </Container>
          )}
        </EventProvider>
      </Switch>
    </>
  );
}

export default Routing;
