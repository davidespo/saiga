import axios from 'axios';

// TODO: BASE URL
const BASE_URL = 'http://localhost:8080';

export class SaigaApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.projects = null;
  }
  async getProjects(options = {}) {
    if (options.skipCache || !this.projects) {
      const res = await axios(`${BASE_URL}/api/system/projects`);
      this.projects = res.data.content;
    }
    return this.projects;
  }
  async getProject(pid) {
    const res = await axios(`${BASE_URL}/api/system/projects/${pid}`);
    return res.data;
  }
  async search(pid, cid, filter) {
    const req = {
      url: `${BASE_URL}/api/data/${pid}/${cid}/_search`,
      method: 'POST',
      data: { filter },
    };
    const res = await axios(req);
    return res.data;
  }
  async createProject(pid) {
    await axios({
      url: `${BASE_URL}/api/system/projects/${pid}`,
      method: 'POST',
    });
  }
  async deleteProject(pid) {
    await axios({
      url: `${BASE_URL}/api/system/projects/${pid}`,
      method: 'DELETE',
    });
  }
  async createCollection(pid, cid) {
    await axios({
      url: `${BASE_URL}/api/system/projects/${pid}/${cid}`,
      method: 'POST',
    });
  }
  async deleteCollection(pid, cid) {
    await axios({
      url: `${BASE_URL}/api/system/projects/${pid}/${cid}`,
      method: 'DELETE',
    });
  }
  async deleteData(pid, cid, _id) {
    await axios({
      url: `${BASE_URL}/api/data/${pid}/${cid}/${_id}`,
      method: 'DELETE',
    });
  }
}

const api = new SaigaApi(BASE_URL);

export default api;
