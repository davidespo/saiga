import React from 'react';
import api from '../services/api';
import urls from '../services/urls';

import { Link } from 'react-router-dom';

const HomePage = () => {
  const [projects, setProjects] = React.useState([]);
  const refresh = async (skipCache) => {
    setProjects(await api.getProjects({ skipCache }));
  };
  React.useEffect(() => {
    refresh();
  }, []);
  return (
    <div>
      <h1>Projects</h1>
      <div className="mb-5">
        <button className="btn btn-success">
          <i className="fa fa-refresh"></i>
        </button>
      </div>
      <ul>
        {projects.map(({ _id }) => (
          <li key={_id}>
            <Link to={urls.project.home(_id)} className="btn btn-outline-light">
              {_id} <i className="fa fa-external-link"></i>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
