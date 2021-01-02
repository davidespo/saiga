import React from 'react';
import api from '../services/api';

import ProjectTile from '../components/ProjectTile';
import CreateProjectTile from '../components/CreateProjectTile';

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
  const createProject = async (projectId = pid) => {
    console.log({ projectId });
    await api.createProject(projectId);
    console.log('DONE');
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
          <div className="col-12 col-md-4 col-lg-3 my-3" key={project._id}>
            <ProjectTile
              project={project}
              onDelete={onDeleteGen(project.projectId)}
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
