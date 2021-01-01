import React from 'react';
import urls from '../services/urls';

import { useParams, useHistory } from 'react-router-dom';

const ProjectHomePage = () => {
  const { projectId } = useParams();
  const history = useHistory();
  const [collection, setCollection] = React.useState('');
  const go = () => {
    // TODO: save these to local storage somehow
    history.push(urls.collection.home(projectId, collection));
  };
  return (
    <div>
      <h1>
        Project - <code>{projectId}</code>
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
      >
        <div className="my-3">
          <input
            type="text"
            className="form-control"
            placeholder="Collection name"
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Go
        </button>
      </form>
    </div>
  );
};

export default ProjectHomePage;
