import React from 'react';
import Routes from './Routes';
import { BrowserRouter } from 'react-router';

function App() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}

export default App;
