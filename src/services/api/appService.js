import appData from '../mockData/apps.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AppService {
  constructor() {
    this.data = [...appData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const app = this.data.find(item => item.Id === parseInt(id, 10));
    if (!app) {
      throw new Error('App not found');
    }
    return { ...app };
  }

  async getConnected() {
    await delay(250);
    return this.data
      .filter(app => app.connected)
      .map(app => ({ ...app }));
  }

  async connect(id, credentials) {
    await delay(400);
    const index = this.data.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('App not found');
    }
    
    const updatedApp = {
      ...this.data[index],
      connected: true,
      connectedAt: new Date().toISOString(),
      credentials: credentials
    };
    
    this.data[index] = updatedApp;
    return { ...updatedApp };
  }

  async disconnect(id) {
    await delay(300);
    const index = this.data.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('App not found');
    }
    
    const updatedApp = {
      ...this.data[index],
      connected: false,
      connectedAt: null,
      credentials: null
    };
    
    this.data[index] = updatedApp;
    return { ...updatedApp };
  }
}

export default new AppService();