import React from 'react';
import { Route, Switch } from 'react-router';

import { EventProvider } from './context/EventContext';
import { PresentGroupProvider } from './context/PresentGroupContext';
import Filter from './views/Filter/Filter';
import Invitation from './views/Invitation/Invitation';
import PresentGroup from './views/PresentGroup/PresentGroup';

function Routing() {
  return (
    <Switch>
      <Route exact path='/:eventId/present'>
        <PresentGroupProvider>
          <PresentGroup titleOfEvent='workshop' />
        </PresentGroupProvider>
      </Route>
      <EventProvider>
        <Route exact path='/:eventId'>
          <Invitation title='Gruppe generering' />
        </Route>
        <Route exact path='/filter/:eventId'>
          <Filter title='Gruppe generering' />
        </Route>
      </EventProvider>
    </Switch>
  );
}

export default Routing;
