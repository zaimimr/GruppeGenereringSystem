import { Container } from '@material-ui/core';
import Navbar from 'components/Navbar';
import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter as Router, Switch as DomSwitch } from 'react-router-dom';
import { useAuth } from 'utils/authentication';
import Dashboard from 'views/Dashboard/Dashboard';
import Event from 'views/Event/Event';
import EventForm from 'views/EventForm/EventForm';
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
              <Navbar />
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
                  <>
                    <Route exact path='/create'>
                      <EventForm />
                    </Route>
                    <Route exact path='/event/:eventId/update'>
                      <EventForm />
                    </Route>
                  </>
                )}
              </Container>
              <Container maxWidth='md'>
                {hasAuth && (
                  <>
                    <Route exact path='/event/:eventId/present'>
                      <PresentGroup />
                    </Route>
                    <Route exact path='/event/:eventId'>
                      <Event />
                    </Route>
                    <Route exact path='/'>
                      <Dashboard />
                    </Route>
                    <Route exact path='/event/:eventId/invite'>
                      <Invitation />
                    </Route>
                    <Route exact path='/event/:eventId/filter'>
                      <Filter />
                    </Route>
                  </>
                )}
                <Route exact path='/event/:eventId/join/:participantId'>
                  <Join />
                </Route>
              </Container>
            </>
          </Switch>
        </DomSwitch>
      </Router>
    </>
  );
}

export default Routing;
