const { Collection } = require('./Collection');
const { dbFactory } = require('./DbFactory');
const { Project, systemProject } = require('./Project');

class System {
  /**
   *
   * @param {Project} systemProject
   */
  constructor(systemProject) {
    this.project = systemProject;
    /**
     * @type {Project[]}
     */
    this.projects = {};
    // populate on boot
    this.getProjectCollection().then((pCol) =>
      pCol
        .search({})
        .then(({ content }) =>
          content.forEach((p) => this.createProject(p._id, p)),
        ),
    );
  }
  /**
   * @returns {Promise<Collection>} projects
   */
  async getProjectCollection() {
    return await this.project.getOrCreateCollection('projects');
  }

  /**
   *
   * @param {string} pid Project ID
   * @returns {Project}
   */
  async getProject(pid) {
    return this.projects[pid];
  }

  /**
   *
   * @param {string} pid
   * @param {object?} info Meta data to describe the project
   * @returns {Project}
   */
  async createProject(pid, info = {}) {
    // TODO: check for existing
    const newProject = (this.projects[pid] = new Project(dbFactory.getDb(pid), {
      ...info,
      _id: pid,
    }));
    const pCol = await this.getProjectCollection();
    await pCol.put(pid, { ...info, _id: pid });
    return newProject;
  }

  /**
   * @param {string} pid Project ID
   * @returns {Promise<Project>}
   */
  async getOrCreateProject(pid) {
    let project = this.projects[pid];
    if (!project) {
      const info = {}; // TODO: info
      project = await this.createProject(pid, info);
    }
    return project;
  }

  /**
   * @param {string} pid Project ID
   */
  async deleteProject(pid) {
    // TODO: truncate db and clean up file system on `this.projects[pid]`
    delete this.projects[pid];
    const pCol = await this.getProjectCollection();
    await pCol.remove(pid);
  }

  /**
   * @returns {Promise<Collection>} system level users
   */
  async getUsersCollection() {
    return await this.getOrCreateCollection('users');
  }
}

const system = new System(systemProject);

module.exports = { System, system };
