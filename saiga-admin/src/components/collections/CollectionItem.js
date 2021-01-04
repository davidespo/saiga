import React from 'react';

const CollectionItem = ({ active, namespace, onSelect, onDelete }) => {
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

export default CollectionItem;
