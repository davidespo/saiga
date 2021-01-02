import React from 'react';
import api from '../services/api';

const CollectionItem = ({
  activeCollectionId,
  namespace,
  onSelect,
  onDelete,
}) => {
  const active = namespace === activeCollectionId;
  const className = `list-group-item ${active ? 'active' : ''}`;
  return (
    <li className={className} onClick={() => onSelect(namespace)}>
      {active ? (
        <span className="mono">{namespace}</span>
      ) : (
        <code>{namespace}</code>
      )}
      <button
        className="btn btn-sm btn-danger ms-2"
        onClick={() => onDelete(namespace)}
      >
        <i className="fa fa-trash"></i>
      </button>
    </li>
  );
};

const NewCollectionForm = ({ onSubmit, onCancel }) => {
  const [cid, setCid] = React.useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(cid);
      }}
    >
      <input
        type="text"
        className="form-control"
        value={cid}
        onChange={(e) => setCid(e.target.value)}
        placeholder="Press [ENTER] to submit"
      />
      <button
        className="btn btn-sm btn-warning wide"
        type="button"
        onClick={onCancel}
      >
        Cancel
      </button>
    </form>
  );
};

const NewCollectionButton = ({ onClick }) => {
  return (
    <button className="btn btn-outline-primary wide" onClick={onClick}>
      <i className="fa fa-plus"></i> New Collection
    </button>
  );
};

const CollectionList = ({
  activeCollectionId,
  collections,
  onCreate,
  onDelete,
  onSelect,
}) => {
  const [createMode, setCreateMode] = React.useState(false);
  if (!collections) {
    return <em>Loading...</em>;
  }
  const onSubmit = async (collectionId) => {
    await onCreate(collectionId);
    setCreateMode(false);
  };
  return (
    <>
      <ul className="list-group">
        {collections.map(({ namespace }) => (
          <CollectionItem
            activeCollectionId={activeCollectionId}
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
            onSubmit={onSubmit}
          />
        ) : (
          <NewCollectionButton onClick={() => setCreateMode(true)} />
        )}
      </div>
    </>
  );
};

export default CollectionList;
