import 'index.css';

import Navbar from 'components/Navbar';
import Provider from 'Provider';
import React from 'react';
import ReactDOM from 'react-dom';
import Routing from 'Routing';

ReactDOM.render(
  <React.StrictMode>
    <Provider>
      <Navbar />
      <Routing />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
