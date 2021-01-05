import React from 'react';

import { Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import ProjectHomePage from './pages/ProjectHomePage';
import NewDataPage from './pages/NewDataPage';
import EditDataPage from './pages/EditDataPage';

const App = () => {
  return (
    <div className="bg-warning">
      <div className="bg-dark text-light force-tall container">
        <Header />
        <div className="p-2 mt-4">
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/p/:pid" exact component={ProjectHomePage} />
            <Route path="/p/:pid/:cid" exact component={ProjectHomePage} />
            <Route path="/p/:pid/:cid/new" exact component={NewDataPage} />
            <Route
              path="/p/:pid/:cid/edit/:_id"
              exact
              component={EditDataPage}
            />

            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default App;
