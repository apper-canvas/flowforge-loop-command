import templateData from '../mockData/templates.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TemplateService {
  constructor() {
    this.data = [...templateData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const template = this.data.find(item => item.Id === parseInt(id, 10));
    if (!template) {
      throw new Error('Template not found');
    }
    return { ...template };
  }

  async getByCategory(category) {
    await delay(250);
    return this.data.filter(template => 
      template.category.toLowerCase() === category.toLowerCase()
    ).map(template => ({ ...template }));
  }

  async createWorkflowFromTemplate(templateId) {
    await delay(400);
    const template = await this.getById(templateId);
    
    return {
      name: template.name,
      description: template.description,
      nodes: [...template.nodes],
      connections: [...template.connections],
      enabled: false
    };
  }
}

export default new TemplateService();