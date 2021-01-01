import React from 'react';
import urls from '../services/urls';

import { Link } from 'react-router-dom';

const ProjectTile = ({ project, onDelete }) => {
  const { projectId, collections } = project;
  const onDeleteClick = () => {
    if (window.confirm('Are you sure?')) {
      onDelete();
    }
  };
  return (
    <div className="border rounded p-2">
      <h5>
        <code>{projectId}</code>
      </h5>
      <p>{collections.length} Collections</p>
      <p>
        {collections.map(({ namespace }) => (
          <span className="badge bg-light text-dark me-2">{namespace}</span>
        ))}
      </p>
      <div className="row">
        <div className="col">
          <Link
            className="btn btn-primary wide"
            to={urls.project.home(projectId)}
          >
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
