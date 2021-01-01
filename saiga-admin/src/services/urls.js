const urls = {
  home: () => '/',
  project: {
    home: (projectId) => `/p/${projectId}`,
  },
  collection: {
    home: (projectId, collectionId) => `/p/${projectId}/${collectionId}`,
    upsertItem: (projectId, collectionId, itemId) =>
      `/p/${projectId}/${collectionId}/${itemId}`,
  },
};

export default urls;
