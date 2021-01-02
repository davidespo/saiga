import React from 'react';

import JsonTree from './JsonTree';

const DataRow = ({ row }) => {
  return (
    <div className="bg-white rounded p-1 my-2">
      <code>_id = `{row._id}`</code>
      <div className="row">
        <div className="col-11">
          <JsonTree data={row} />
        </div>
        <div className="col-1 d-flex flex-column justify-content-around align-items-center">
          <button className="btn btn-sm btn-primary">
            <i className="fa fa-search"></i>
          </button>
          <button className="btn btn-sm btn-info">
            <i className="fa fa-pencil"></i>
          </button>
          <button className="btn btn-sm btn-danger">
            <i className="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

const DataList = ({ data }) => {
  if (!data || !data.content) {
    return <em>Waiting...</em>;
  }
  if (data.content.length === 0) {
    return <em>There is nothing here...</em>;
  }
  return (
    <div>
      {data.content.map((row) => (
        <DataRow row={row} key={row._id} />
      ))}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default DataList;
