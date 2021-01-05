import React from 'react';
import gfe from 'remark-gfm';

import ReactMarkdown from 'react-markdown';

const Markdown = ({ children }) => {
  return <ReactMarkdown plugins={[gfe]}>{children}</ReactMarkdown>;
};

export default Markdown;
