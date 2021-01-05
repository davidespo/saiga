import React from 'react';
import moment from 'moment';

import { Link } from 'react-router-dom';
import Markdown from './Markdown';

const Tag = ({ children }) => (
  <span className="m-2 badge badge-primary p-2">{children}</span>
);

const PostSummary = ({ post, showContent }) => {
  const { _id, title, description, tags, publishedAt, content } = post;
  return (
    <div className="my-2 border round p-3">
      <Link to={`/${_id}`}>
        <h4>{title}</h4>
      </Link>
      <div className="my-2">
        <Markdown>{description}</Markdown>
      </div>
      <div className="row">
        <div className="col">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <div className="col text-right">{moment(publishedAt).fromNow()}</div>
      </div>
      {showContent && (
        <div className="py-4 border-top round">
          <Markdown>{content}</Markdown>
        </div>
      )}
    </div>
  );
};

export default PostSummary;
