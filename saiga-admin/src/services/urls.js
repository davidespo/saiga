const urls = {
  home: () => '/',
  project: {
    home: (pid) => `/p/${pid}`,
    dataView: (pid, cid) => `/p/${pid}/${cid}`,
  },
  collection: {},
  data: {
    create: (pid, cid) => `/p/${pid}/${cid}/new`,
    edit: (pid, cid, _id) => `/p/${pid}/${cid}/edit/${_id}`,
  },
};

export default urls;
