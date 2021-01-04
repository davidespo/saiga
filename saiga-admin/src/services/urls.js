const urls = {
  home: () => '/',
  project: {
    home: (pid) => `/p/${pid}`,
    dataView: (pid, cid) => `/p/${pid}/${cid}`,
  },
  collection: {},
  data: {
    create: (pid, cid) => `/p/${pid}/${cid}/_create`,
    edit: (pid, cid, _id) => `/p/${pid}/${cid}/${_id}`,
  },
};

export default urls;
