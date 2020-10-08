import { EventProvider } from 'context/EventContext';
import React from 'react';
import { Route, Switch } from 'react-router';
import Filter from 'views/Filter/Filter';
import Invitation from 'views/Invitation/Invitation';
import Join from 'views/Join/Join';
import PresentGroup from 'views/PresentGroup/PresentGroup';

function Routing() {
  return (
    <Switch>
      <EventProvider>
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
      </EventProvider>
    </Switch>
  );
}

export default Routing;
