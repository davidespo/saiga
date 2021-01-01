import React from 'react';

import JSONTree from 'react-json-tree';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';

const theme = {
  scheme: 'google',
  author: 'seth wright (http://sethawright.com)',
  base00: '#1d1f21',
  base01: '#282a2e',
  base02: '#373b41',
  base03: '#969896',
  base04: '#b4b7b4',
  base05: '#c5c8c6',
  base06: '#e0e0e0',
  base07: '#ffffff',
  base08: '#CC342B',
  base09: '#F96A38',
  base0A: '#FBA922',
  base0B: '#198844',
  base0C: '#3971ED',
  base0D: '#3971ED',
  base0E: '#A36AC7',
  base0F: '#3971ED',
};

// TODO: https://oxyno-zeta.github.io/react-editable-json-tree/

const SearchResults = ({ payload, onFilterChange }) => {
  function onChange(newValue) {
    try {
      const newFilter = JSON.parse(newValue);
      console.log({ newFilter });
      onFilterChange(newFilter);
    } catch (error) {}
  }
  return (
    <div>
      <div className="row">
        <div className="col">
          <h3>Filter</h3>
          <JSONTree data={payload.query} theme={theme} />
        </div>
        <div className="col">
          <h3>Query</h3>
          <AceEditor
            mode="javascript"
            theme="github"
            defaultValue={'{}'}
            onChange={onChange}
            editorProps={{ $blockScrolling: true }}
            style={{ height: '100px', marginTop: '0.5em' }}
          />
        </div>
      </div>
      <h3>Content</h3>
      {payload.content.map((item) => (
        <div
          className="my-2 p-2 border rounded bg-light text-dark"
          key={item._id}
        >
          <JSONTree data={item} theme={theme} />
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
