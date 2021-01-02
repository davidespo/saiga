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
  async getProject(projectId) {
    const res = await axios(`${BASE_URL}/api/system/projects/${projectId}`);
    return res.data;
  }
  async search(projectId, collectionId, filter) {
    const req = {
      url: `${BASE_URL}/api/data/${projectId}/${collectionId}/_search`,
      method: 'POST',
      data: { filter },
    };
    const res = await axios(req);
    return res.data;
  }
  async createProject(projectId) {
    await axios({
      url: `${BASE_URL}/api/system/projects/${projectId}`,
      method: 'POST',
    });
  }
  async deleteProject(projectId) {
    await axios({
      url: `${BASE_URL}/api/system/projects/${projectId}`,
      method: 'DELETE',
    });
  }
  async createCollection(projectId, collectionId) {
    await axios({
      url: `${BASE_URL}/api/system/projects/${projectId}/${collectionId}`,
      method: 'POST',
    });
  }
  async deleteCollection(projectId, collectionId) {
    await axios({
      url: `${BASE_URL}/api/system/projects/${projectId}/${collectionId}`,
      method: 'DELETE',
    });
  }
}

const api = new SaigaApi(BASE_URL);

export default api;
