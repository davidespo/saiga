const urls = {
  home: () => '/',
  project: {
    home: (projectId) => `/p/${projectId}`,
  },
  collection: {
    home: (projectId, collectionId) => `/p/${projectId}/${collectionId}`,
  },
};

export default urls;
