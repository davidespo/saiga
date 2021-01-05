import React from 'react';
import api from '../../services/api';
import urls from '../../services/urls';

import { useParams } from 'react-router-dom';
import { useApiData } from '../../hooks';

import { Link } from 'react-router-dom';
import DataRow from './DataRow';

const PopulateDataList = ({ pid, cid }) => {
  const [data, refresh] = useApiData(
    {},
    ({ pid, cid }) => api.search(pid, cid),
    { pid, cid },
    10000,
  );
  if (!data || !data.content) {
    return <em>Waiting...</em>;
  }
  let content;
  if (data.content.length === 0) {
    content = <em>There is nothing here...</em>;
  } else {
    content = data.content.map((row) => (
      <DataRow row={row} pid={pid} cid={cid} key={row._id} onDelete={refresh} />
    ));
  }
  return (
    <div>
      <div className="mb-3">
        <button
          className="btn btn-outline-success me-2"
          type="button"
          onClick={() => refresh({ pid, cid })}
        >
          <i className="fa fa-refresh"></i> Refresh
        </button>
        <Link
          className="btn btn-outline-primary me-2"
          to={urls.data.create(pid, cid)}
        >
          <i className="fa fa-plus"></i> New Entry
        </Link>
      </div>
      <div>{content}</div>
    </div>
  );
};

const DataList = ({ data }) => {
  const { pid, cid } = useParams();
  if (!cid) {
    return <em>Select a collection to get started</em>;
  }
  return <PopulateDataList pid={pid} cid={cid} />;
};

export default DataList;
