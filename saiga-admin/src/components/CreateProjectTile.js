import React from 'react';
import pNameGen from 'project-name-generator';

const PlusTile = ({ setActive }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      onClick={setActive}
      style={{ minHeight: '150px' }}
    >
      <h1>
        <i className="fa fa-plus"></i>
      </h1>
    </div>
  );
};

const FormTile = ({ onCreate, onCancel }) => {
  const [pid, setPid] = React.useState(pNameGen().dashed);
  // TODO: random name button
  return (
    <div
      className="d-flex flex-column justify-content-between"
      style={{ minHeight: '185px' }}
    >
      <h5>Title</h5>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          onCreate(pid);
        }}
      >
        <input
          type="text"
          className="form-control"
          value={pid}
          onChange={(e) => setPid(e.target.value)}
        />
      </form>
      <button
        className="btn btn-info btn-sm wide"
        onClick={() => setPid(pNameGen().dashed)}
      >
        <i className="fa fa-random"></i> Random
      </button>
      <button className="btn btn-warning btn-sm wide" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

const CreateProjectTile = ({ onCreate }) => {
  const [active, setActive] = React.useState(false);
  return (
    <div className="border rounded p-2" style={{ minHeight: '200px' }}>
      {active ? (
        <FormTile
          onCreate={async (pid) => {
            await onCreate(pid);
            setActive(false);
          }}
          onCancel={() => setActive(false)}
        />
      ) : (
        <PlusTile setActive={() => setActive(true)} />
      )}
    </div>
  );
};

export default CreateProjectTile;
