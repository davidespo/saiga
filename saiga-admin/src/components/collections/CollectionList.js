import React from 'react';
import urls from '../../services/urls';
import api from '../../services/api';

import { useHistory, useParams } from 'react-router-dom';

import CollectionItem from './CollectionItem';
import NewCollectionForm from './NewCollectionForm';

const NewCollectionButton = ({ onClick }) => {
  return (
    <button className="btn btn-outline-primary wide" onClick={onClick}>
      <i className="fa fa-plus"></i> New Collection
    </button>
  );
};

const CollectionList = ({ collections, onChange }) => {
  const { pid, cid } = useParams();
  const history = useHistory();
  const [createMode, setCreateMode] = React.useState(false);
  if (!collections) {
    return <em>Loading...</em>;
  }
  const onSelect = (namespace) => {
    history.push(urls.project.dataView(pid, namespace));
  };
  const onCreate = async (namespace) => {
    await api.createCollection(pid, namespace);
    setCreateMode(false);
    onSelect(namespace);
    onChange();
  };
  const onDelete = async (namespace) => {
    await api.deleteCollection(pid, namespace);
    history.push(urls.project.home(pid));
    onChange();
  };
  return (
    <>
      <ul className="list-group">
        {collections.map(({ namespace }) => (
          <CollectionItem
            active={cid === namespace}
            namespace={namespace}
            onSelect={onSelect}
            onDelete={onDelete}
            key={namespace}
          />
        ))}
      </ul>
      <div className="my-3">
        {createMode ? (
          <NewCollectionForm
            onCancel={() => setCreateMode(false)}
            onSubmit={onCreate}
          />
        ) : (
          <NewCollectionButton onClick={() => setCreateMode(true)} />
        )}
      </div>
    </>
  );
};

export default CollectionList;
