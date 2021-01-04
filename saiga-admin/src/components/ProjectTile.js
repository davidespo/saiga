import React from 'react';
import urls from '../services/urls';

import { Link } from 'react-router-dom';

const ProjectTile = ({ project, onDelete }) => {
  const { _id, collections } = project;
  const onDeleteClick = () => {
    if (window.confirm('Are you sure?')) {
      onDelete();
    }
  };
  return (
    <div className="border rounded p-2">
      <h5>
        <code>/{_id}</code>
      </h5>
      <p>{collections.length} Collections</p>
      <div style={{ height: '75px' }}>
        <p>
          {collections.map(({ namespace }) => (
            <span className="badge bg-light text-dark me-2" key={namespace}>
              {namespace}
            </span>
          ))}
        </p>
      </div>
      <div className="row">
        <div className="col">
          <Link className="btn btn-primary wide" to={urls.project.home(_id)}>
            Use <i className="fa fa-external-link"></i>
          </Link>
        </div>
        <div className="col">
          <button
            className="btn btn-danger wide"
            type="button"
            onClick={onDeleteClick}
          >
            <i className="fa fa-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTile;
