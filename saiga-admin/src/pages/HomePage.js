import React from 'react';
import api from '../services/api';

import { useApiData } from '../hooks';

import ProjectTile from '../components/ProjectTile';
import CreateProjectTile from '../components/CreateProjectTile';

const HomePage = () => {
  const [projects, refresh] = useApiData(
    [],
    api.getProjects.bind(api),
    { skipCache: true },
    60000,
  );
  const onDeleteGen = (pid) => async () => {
    await api.deleteProject(pid);
    refresh();
  };
  const createProject = async (pid) => {
    await api.createProject(pid);
    refresh();
  };
  return (
    <div>
      <h1>Projects</h1>
      <div className="row mb-5">
        <div className="col-1 d-flex justify-content-center">
          <button className="btn btn-success" onClick={() => refresh(true)}>
            <i className="fa fa-refresh"></i>
          </button>
        </div>
      </div>
      <div className="row">
        {projects.map((project) => (
          <div className="col-12 col-md-4 col-lg-3 my-3" key={project._id}>
            <ProjectTile
              project={project}
              onDelete={onDeleteGen(project._id)}
            />
          </div>
        ))}
        <div className="col-12 col-md-4 col-lg-3 my-3">
          <CreateProjectTile onCreate={createProject} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
