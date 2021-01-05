import React from 'react';
import urls from '../services/urls';

import { useParams, Link } from 'react-router-dom';

function entry(to, text) {
  return (
    <>
      <i className="fa fa-chevron-right mx-2"></i>
      <Link to={to} className="mx-3">
        {text}
      </Link>
    </>
  );
}

const Breadcrumbs = () => {
  const { pid, cid, _id } = useParams();
  return (
    <div className="fs-3">
      <Link to={urls.home()} className="me-2">
        <i className="fa fa-home"></i>
      </Link>
      {!!pid && entry(urls.project.home(pid), pid)}
      {!!cid && entry(urls.project.dataView(pid, cid), cid)}
      {!!_id && entry(urls.data.edit(pid, cid, _id), _id)}
    </div>
  );
};

export default Breadcrumbs;
