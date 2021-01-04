import React from 'react';
import api from '../../services/api';
import urls from '../../services/urls';

import { useToggle } from '../../hooks';

import { Link } from 'react-router-dom';
import JsonTree from '../JsonTree';

const DataRow = ({ pid, cid, row, onDelete }) => {
  const [isRaw, toggleRaw] = useToggle(false);
  const attemptDelete = async () => {
    if (window.confirm('Are you sure?')) {
      await api.deleteData(pid, cid, row._id);
      onDelete();
    }
  };
  return (
    <div className="bg-white rounded p-1 my-2">
      <code>_id = `{row._id}`</code>
      <div className="row">
        <div className="col-11">
          {isRaw ? (
            <pre className="text-secondary">{JSON.stringify(row, null, 2)}</pre>
          ) : (
            <JsonTree data={row} />
          )}
        </div>
        <div className="col-1 d-flex flex-column justify-content-around align-items-center">
          <button className="btn btn-sm btn-primary" onClick={toggleRaw}>
            <i className="fa fa-search"></i>
          </button>
          <Link
            className="btn btn-sm btn-info"
            to={urls.data.edit(pid, cid, row._id)}
          >
            <i className="fa fa-pencil"></i>
          </Link>
          <button className="btn btn-sm btn-danger" onClick={attemptDelete}>
            <i className="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataRow;
