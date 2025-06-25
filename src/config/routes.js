import Workflows from '@/components/pages/Workflows';
import WorkflowCanvas from '@/components/pages/WorkflowCanvas';
import Templates from '@/components/pages/Templates';
import Executions from '@/components/pages/Executions';
import ConnectedApps from '@/components/pages/ConnectedApps';

export const routes = {
  workflows: {
    id: 'workflows',
    label: 'Workflows',
    path: '/workflows',
    icon: 'GitBranch',
    component: Workflows
  },
  canvas: {
    id: 'canvas',
    label: 'Canvas',
    path: '/canvas/:id?',
    icon: 'Workflow',
    component: WorkflowCanvas
  },
  templates: {
    id: 'templates',
    label: 'Templates',
    path: '/templates',
    icon: 'FileText',
    component: Templates
  },
  executions: {
    id: 'executions',
    label: 'Executions',
    path: '/executions',
    icon: 'Activity',
    component: Executions
  },
  connectedApps: {
    id: 'connectedApps',
    label: 'Connected Apps',
    path: '/apps',
    icon: 'Grid3x3',
    component: ConnectedApps
  }
};

export const routeArray = Object.values(routes);
export default routes;