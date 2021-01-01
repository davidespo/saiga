// TODO: BASE URL
const BASE_URL = 'http://localhost:8080';

export class SaigaApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.projects = null;
  }
  async getProjects(options = {}) {
    if (options.skipCache || !this.projects) {
      const res = await fetch(`${BASE_URL}/api/system/projects`);
      const payload = await res.json();
      this.projects = payload.content;
    }
    return this.projects;
  }
}

const api = new SaigaApi(BASE_URL);

export default api;
