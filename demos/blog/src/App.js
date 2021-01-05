import React from 'react';

import { Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import PostListPage from './pages/PostListPage';
import ReadPostPage from './pages/ReadPostPage';

const App = () => {
  return (
    <div>
      <div className="container">
        <Header />
        <Switch>
          <Route path="/" exact component={PostListPage} />
          <Route path="/:postId" exact component={ReadPostPage} />
          <Route>
            <div className="text-center p-5">
              <h1>
                <em>Not Found :: 404</em>
              </h1>
            </div>
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default App;
