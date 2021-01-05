import React from 'react';
import { api } from '../services/api';

import Loading from '../components/Loading';
import PostSummary from '../components/PostSummary';

const PostListPage = () => {
  const [posts, setPosts] = React.useState();
  const refresh = async () => {
    const result = await api.searchPosts();
    setPosts(result.content);
  };
  React.useEffect(() => {
    refresh();
    const handle = setInterval(refresh, 30000);
    return () => clearInterval(handle);
  }, []);
  if (!posts) {
    return <Loading />;
  }
  if (posts.length === 0) {
    return (
      <p className="lead">
        <em>There is nothing here...</em>
      </p>
    );
  }
  return (
    <div>
      {posts.map((post) => (
        <PostSummary post={post} key={post._id} />
      ))}
    </div>
  );
};

export default PostListPage;
