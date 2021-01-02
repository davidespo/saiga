import React from 'react';
import api from '../services/api';

import { useParams } from 'react-router-dom';

import CollectionList from '../components/CollectionList';
import DataList from '../components/DataList';

const ProjectHomePage = () => {
  const { projectId } = useParams();
  const [project, setProject] = React.useState({});
  const [activeCollectionId, setActiveCollectionId] = React.useState(null);
  const [data, setData] = React.useState([]);
  const { collections } = project;
  const refreshProject = async () => {
    setProject(await api.getProject(projectId));
  };
  const refreshData = async () => {
    // has active collection
    if (!!activeCollectionId) {
      // active collection is valid in project
      const activeCollection = project.collections.filter(
        (c) => c._id === activeCollectionId,
      );
      if (activeCollection.length > 0) {
        setData(await api.search(projectId, activeCollectionId));
      }
    }
  };
  const onSelectCollection = (collectionId) => {
    setActiveCollectionId(collectionId);
    refreshData();
  };
  const onCreateCollection = async (collectionId) => {
    await api.createCollection(projectId, collectionId);
    await refreshProject();
    setActiveCollectionId(collectionId);
    refreshData();
  };
  const onDeleteCollection = async (collectionId) => {
    await api.deleteCollection(projectId, collectionId);
    await refreshProject();
  };
  React.useEffect(() => {
    refreshProject();
  }, [projectId]);
  return (
    <div>
      <h1>
        Project - <code>{projectId}</code>
      </h1>
      <div className="row my-3">
        <div className="col-12 col-md-3 p-2 border rounded">
          <h5>Collections</h5>
          <CollectionList
            activeCollectionId={activeCollectionId}
            collections={collections}
            onCreate={onCreateCollection}
            onDelete={onDeleteCollection}
            onSelect={onSelectCollection}
          />
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
