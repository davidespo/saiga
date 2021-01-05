import React from 'react';
import moment from 'moment';
import { api } from '../services/api';

import { useParams } from 'react-router-dom';

import ReactMarkdown from 'react-markdown';
import PostSummary from '../components/PostSummary';

const ReadPostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = React.useState();
  React.useEffect(() => {
    (async () => setPost(await api.getPost(postId)))();
  }, [postId]);
  if (!post) {
    return (
      <h1>
        <em>Loading...</em>
      </h1>
    );
  }
  return <PostSummary post={post} showContent />;
};

export default ReadPostPage;
