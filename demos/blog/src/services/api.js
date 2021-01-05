class SaigaBlogApi {
  searchPosts() {
    return fetch('http://localhost:8080/api/data/blog/posts/_search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reverse: true }),
    }).then((res) => res.json());
  }
  getPost(postId) {
    return fetch(
      `http://localhost:8080/api/data/blog/posts/${postId}`,
    ).then((res) => res.json());
  }
}

module.exports = {
  api: new SaigaBlogApi(),
};
