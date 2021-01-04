import React from 'react';

const NewCollectionForm = ({ onSubmit, onCancel }) => {
  const [cid, setCid] = React.useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(cid);
      }}
    >
      <input
        type="text"
        className="form-control"
        value={cid}
        onChange={(e) => setCid(e.target.value)}
        placeholder="Press [ENTER] to submit"
      />
      <button
        className="btn btn-sm btn-warning wide"
        type="button"
        onClick={onCancel}
      >
        Cancel
      </button>
    </form>
  );
};

export default NewCollectionForm;
