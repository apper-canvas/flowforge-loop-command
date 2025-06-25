import executionData from '../mockData/executions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ExecutionService {
  constructor() {
    this.data = [...executionData];
  }

  async getAll() {
    await delay(300);
    return [...this.data].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  }

  async getById(id) {
    await delay(200);
    const execution = this.data.find(item => item.Id === parseInt(id, 10));
    if (!execution) {
      throw new Error('Execution not found');
    }
    return { ...execution };
  }

  async getByWorkflowId(workflowId) {
    await delay(250);
    return this.data
      .filter(execution => execution.workflowId === parseInt(workflowId, 10))
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .map(execution => ({ ...execution }));
  }

  async create(execution) {
    await delay(400);
    const maxId = Math.max(...this.data.map(item => item.Id), 0);
    const newExecution = {
      ...execution,
      Id: maxId + 1,
      startTime: new Date().toISOString(),
      status: 'running'
    };
    this.data.push(newExecution);
    return { ...newExecution };
  }

  async updateStatus(id, status, endTime = null, logs = null) {
    await delay(200);
    const index = this.data.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Execution not found');
    }
    
    const updates = { status };
    if (endTime) updates.endTime = endTime;
    if (logs) updates.logs = logs;
    
    const updatedExecution = {
      ...this.data[index],
      ...updates
    };
    
    this.data[index] = updatedExecution;
    return { ...updatedExecution };
  }
}

export default new ExecutionService();