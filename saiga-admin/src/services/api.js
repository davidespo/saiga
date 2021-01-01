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
  async search(projectId, collectionId, filter) {
    const req = {
      url: `${BASE_URL}/api/data/${projectId}/${collectionId}/_search`,
      method: 'POST',
      data: { filter },
    };
    console.log(req);
    const res = await axios(req);
    return res.data;
  }
}

const api = new SaigaApi(BASE_URL);

export default api;
