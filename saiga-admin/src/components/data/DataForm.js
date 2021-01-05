import React from 'react';
import api from '../../services/api';
import urls from '../../services/urls';
import pNameGen from 'project-name-generator';

import { useHistory } from 'react-router-dom';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';

const DataForm = ({ pid, cid, _id, setId, value, setValue }) => {
  const history = useHistory();
  const onCancel = () => history.goBack();
  const onSave = async () => {
    try {
      const data = JSON.parse(value);
      await api.createData(pid, cid, _id, data);
      history.push(urls.project.dataView(pid, cid));
    } catch (err) {
      console.log(err);
    }
  };
  const canEditId = !!setId;
  let isJson;
  try {
    JSON.parse(value);
    isJson = true;
  } catch (error) {
    isJson = false;
  }
  return (
    <div>
      <div className="my-2">
        <h5>Key</h5>
        <div className="input-group">
          {canEditId && (
            <button
              className="btn btn-info"
              type="button"
              onClick={() => setId(pNameGen().dashed)}
            >
              <i className="fa fa-random"></i>
            </button>
          )}
          <input
            type="text"
            className="form-control"
            value={_id}
            disabled={!canEditId}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
      </div>
      <div className="my-2">
        <h5>Value</h5>
        <div
          className={`border-${
            isJson ? 'success' : 'danger'
          } p-2 bg-light rouded`}
        >
          <AceEditor
            mode="json"
            theme="github"
            width="100%"
            value={value}
            onChange={(val) => setValue(val)}
            editorProps={{ $blockScrolling: true }}
          />
        </div>
      </div>
      <div className="my-2">
        <button
          className="btn btn-lg btn-primary me-2"
          onClick={onSave}
          disabled={!isJson}
        >
          Save
        </button>
        <button className="btn btn-lg btn-secondary me-2" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DataForm;
