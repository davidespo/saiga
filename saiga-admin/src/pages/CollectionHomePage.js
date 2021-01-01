import React from 'react';
import { nanoid } from 'nanoid';
import api from '../services/api';
import urls from '../services/urls';

import { useParams } from 'react-router-dom';

import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import SearchResults from '../components/SearchResults';

const CollectionHomePage = () => {
  const { projectId, collectionId } = useParams();
  const [payload, setPayload] = React.useState(null);
  const [filter, setFilter] = React.useState({});
  const search = async () => {
    setPayload(await api.search(projectId, collectionId, filter));
  };
  React.useEffect(
    () => {
      const handle = setInterval(search, 5000);
      search();
      return () => clearInterval(handle);
    },
    // eslint-disable-next-line
    [projectId, collectionId, filter],
  );
  const onFilterChange = (newFilter) => {
    setFilter(newFilter);
    search();
  };
  return (
    <div>
      <h1>
        Data - <code>{`${projectId}/${collectionId}`}</code>
      </h1>
      <hr />
      <div className="text-end">
        <Link
          to={urls.collection.upsertItem(projectId, collectionId, nanoid(7))}
          className="btn btn-primary"
        >
          <i className="fa fa-plus"></i> Add New Item
        </Link>
      </div>
      {!payload ? (
        <Loading />
      ) : (
        <SearchResults payload={payload} onFilterChange={onFilterChange} />
      )}
    </div>
  );
};

export default CollectionHomePage;
