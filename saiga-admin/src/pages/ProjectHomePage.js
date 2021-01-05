import React from 'react';
import api from '../services/api';

import { useParams } from 'react-router-dom';
import { useApiData } from '../hooks/index';

import Breadcrumbs from '../components/Breadcrumbs';
import CollectionList from '../components/collections/CollectionList';
import DataList from '../components/data/DataList';

const ProjectHomePage = () => {
  const { pid, cid } = useParams();
  const [project, refreshProject] = useApiData({}, api.getProject, pid, 60000);
  const { collections } = project;
  return (
    <div>
      <div className="mb-3">
        <Breadcrumbs />
      </div>
      <h1>
        Project -{' '}
        <code>
          /{pid}
          {!!cid && `/${cid}`}
        </code>
      </h1>
      <div className="row my-3">
        <div className="col-12 col-md-3 p-2 border rounded">
          <h5>Collections</h5>
          <CollectionList collections={collections} onChange={refreshProject} />
        </div>
        <div className="col-12 col-md-9 border rounded">
          <h5>Data</h5>
          <DataList />
        </div>
      </div>
    </div>
  );
};

export default ProjectHomePage;
