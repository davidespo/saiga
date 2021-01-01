import React from 'react';

import { Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import ProjectHomePage from './pages/ProjectHomePage';
import CollectionHomePage from './pages/CollectionHomePage';

const App = () => {
  return (
    <div className="bg-warning">
      <div className="bg-dark text-light force-tall container">
        <Header />
        <div className="p-2 mt-4">
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/p/:projectId" exact component={ProjectHomePage} />
            <Route
              path="/p/:projectId/:collectionId"
              exact
              component={CollectionHomePage}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default App;
