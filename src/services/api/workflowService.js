import workflowData from '../mockData/workflows.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class WorkflowService {
  constructor() {
    this.data = [...workflowData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const workflow = this.data.find(item => item.Id === parseInt(id, 10));
    if (!workflow) {
      throw new Error('Workflow not found');
    }
    return { ...workflow };
  }

  async create(workflow) {
    await delay(400);
    const maxId = Math.max(...this.data.map(item => item.Id), 0);
    const newWorkflow = {
      ...workflow,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      lastRun: null,
      enabled: false
    };
    this.data.push(newWorkflow);
    return { ...newWorkflow };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.data.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Workflow not found');
    }
    
    const updatedWorkflow = {
      ...this.data[index],
      ...updates,
      Id: this.data[index].Id // Prevent ID modification
    };
    
    this.data[index] = updatedWorkflow;
    return { ...updatedWorkflow };
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Workflow not found');
    }
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async duplicate(id) {
    await delay(400);
    const original = await this.getById(id);
    const maxId = Math.max(...this.data.map(item => item.Id), 0);
    
    const duplicatedWorkflow = {
      ...original,
      Id: maxId + 1,
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      lastRun: null,
      enabled: false
    };
    
    this.data.push(duplicatedWorkflow);
    return { ...duplicatedWorkflow };
  }

  async toggleEnabled(id) {
    await delay(200);
    const workflow = await this.getById(id);
    return await this.update(id, { enabled: !workflow.enabled });
  }
}

export default new WorkflowService();