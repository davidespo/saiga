import React from 'react';

import { Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <div className="bg-warning">
      <div className="bg-dark text-light force-tall container">
        <Header />
        <div className="p-2">
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default App;
