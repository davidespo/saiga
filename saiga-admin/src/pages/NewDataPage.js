import React from 'react';
import pNameGen from 'project-name-generator';

import { useParams } from 'react-router-dom';

import Breadcrumbs from '../components/Breadcrumbs';
import DataForm from '../components/data/DataForm';

const NewDataPage = () => {
  const { pid, cid } = useParams();
  const [_id, setId] = React.useState(pNameGen().dashed);
  const [value, setValue] = React.useState('{}');
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
      <DataForm
        pid={pid}
        cid={cid}
        _id={_id}
        setId={setId}
        value={value}
        setValue={setValue}
      />
    </div>
  );
};

export default NewDataPage;
