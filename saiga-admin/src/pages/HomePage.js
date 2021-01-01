import React from 'react';
import api from '../services/api';
import urls from '../services/urls';

import { Link } from 'react-router-dom';
import ProjectTile from '../components/ProjectTile';

const HomePage = () => {
  const [projects, setProjects] = React.useState([]);
  const [pid, setPid] = React.useState('');
  const refresh = async (skipCache) => {
    setProjects(await api.getProjects({ skipCache }));
  };
  const onDeleteGen = (projectId) => async () => {
    await api.deleteProject(projectId);
    refresh(true);
  };
  const createProject = async () => {
    await api.createProject(pid);
    setPid('');
    refresh(true);
  };
  React.useEffect(() => {
    refresh(true);
  }, []);
  return (
    <div>
      <h1>Projects</h1>
      <div className="row mb-5">
        <div className="col-1 d-flex justify-content-center">
          <button className="btn btn-success" onClick={() => refresh(true)}>
            <i className="fa fa-refresh"></i>
          </button>
        </div>
        <div className="col-11">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createProject();
            }}
          >
            <input
              type="text"
              className="form-control"
              value={pid}
              onChange={(e) => setPid(e.target.value)}
              placeholder="Create new project. Enter name and press [ENTER]"
            />
          </form>
        </div>
      </div>
      <div className="row">
        {projects.map((project) => (
          <div className="col-12 col-md-4 col-lg-3">
            <ProjectTile
              project={project}
              onDelete={onDeleteGen(project.projectId)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
