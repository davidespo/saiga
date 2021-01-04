import React from 'react';
import api from '../services/api';

import { useParams } from 'react-router-dom';
import { useApiData } from '../hooks/index';

import CollectionList from '../components/collections/CollectionList';
import DataList from '../components/data/DataList';

const ProjectHomePage = () => {
  const { pid, cid } = useParams();
  const [project, refreshProject] = useApiData({}, api.getProject, pid, 60000);
  // const [project, setProject] = React.useState({});
  const [data, setData] = React.useState([]);
  const { collections } = project;
  // const refreshProject = async () => {
  //   setProject(await api.getProject(pid));
  // };
  // const refreshData = async () => {
  //   // has active collection
  //   if (!!cid) {
  //     // active collection is valid in project
  //     const activeCollection = project.collections.filter((c) => c._id === cid);
  //     if (activeCollection.length > 0) {
  //       setData(await api.search(pid, cid));
  //     }
  //   }
  // };
  // React.useEffect(() => {
  //   refreshProject();
  // }, [pid]);
  return (
    <div>
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
          <DataList data={data} />
        </div>
      </div>
    </div>
  );
};

export default ProjectHomePage;
