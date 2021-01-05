import React from 'react';
import api from '../services/api';

import { useParams } from 'react-router-dom';

import Breadcrumbs from '../components/Breadcrumbs';
import DataForm from '../components/data/DataForm';

function errorContent(error) {
  return (
    <h3 className="text-danger">
      <em>{error}</em>
    </h3>
  );
}

function loadingContent() {
  return (
    <h3>
      <em>Loading...</em>
    </h3>
  );
}

function formContent(pid, cid, _id, value, setValue) {
  return (
    <DataForm pid={pid} cid={cid} _id={_id} value={value} setValue={setValue} />
  );
}

const EditDataPage = () => {
  const { pid, cid, _id } = useParams();
  const [value, setValue] = React.useState();
  const [error, setError] = React.useState();
  React.useEffect(() => {
    (async () => {
      try {
        const data = JSON.stringify(await api.getData(pid, cid, _id), null, 2);
        setValue(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    })();
  }, [pid, cid, _id]);
  let content;
  if (!!error) {
    content = errorContent(error);
  } else if (!value) {
    content = loadingContent();
  } else {
    content = formContent(pid, cid, _id, value, setValue);
  }
  return (
    <div>
      <div className="mb-3">
        <Breadcrumbs />
      </div>
      <h1>
        <code>
          /{pid}/{cid}/{_id}
        </code>
      </h1>
      {content}
    </div>
  );
};

export default EditDataPage;
