import React from 'react';

const Loading = ({ text = 'Loading...' }) => {
  return (
    <h1>
      <em>{text}</em>
    </h1>
  );
};

export default Loading;
