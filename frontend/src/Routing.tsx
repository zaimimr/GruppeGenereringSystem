import { Container } from '@material-ui/core';
import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter as Router, Switch as DomSwitch } from 'react-router-dom';
import { useAuth } from 'utils/authentication';
import CreateEvent from 'views/CreateEvent/CreateEvent';
import Dashboard from 'views/Dashboard/Dashboard';
import Event from 'views/Event/Event';
import Filter from 'views/Filter/Filter';
import Invitation from 'views/Invitation/Invitation';
import Join from 'views/Join/Join';
import Login from 'views/Login/Login';
import PresentGroup from 'views/PresentGroup/PresentGroup';
import SignUp from 'views/SignUp/SignUp';

function Routing() {
  const hasAuth = useAuth();

  return (
    <>
      <Router>
        <DomSwitch>
          <Switch>
            <>
              <Container maxWidth='sm'>
                {!hasAuth && (
                  <>
                    <Route exact path='/signup'>
                      <SignUp />
                    </Route>
                    <Route exact path='/'>
                      <Login />
                    </Route>
                  </>
                )}
                {hasAuth && (
                  <Route exact path='/create'>
                    <CreateEvent />
                  </Route>
                )}
              </Container>
              <Container maxWidth='md'>
                {hasAuth && (
                  <>
                    <Route exact path='/event/:eventId/present'>
                      <PresentGroup title='Gruppe generering' />
                    </Route>
                    <Route exact path='/event/:eventId'>
                      <Event />
                    </Route>
                    <Route exact path='/'>
                      <Dashboard />
                    </Route>
                    <Route exact path='/event/:eventId/invite'>
                      <Invitation title='Gruppe generering' />
                    </Route>
                    <Route exact path='/event/:eventId/filter'>
                      <Filter title='Gruppe generering' />
                    </Route>
                    <Route exact path='/event/:eventId/join/:participantId'>
                      <Join />
                    </Route>
                  </>
                )}
              </Container>
            </>
          </Switch>
        </DomSwitch>
      </Router>
    </>
  );
}

export default Routing;
