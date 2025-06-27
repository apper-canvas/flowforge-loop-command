import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import workflowService from '@/services/api/workflowService';
import PageHeader from '@/components/organisms/PageHeader';
import WorkflowCard from '@/components/molecules/WorkflowCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';

const Workflows = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await workflowService.getAll();
      setWorkflows(result);
      setFilteredWorkflows(result);
    } catch (err) {
      setError(err.message || 'Failed to load workflows');
      toast.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredWorkflows(workflows);
      return;
    }

    const filtered = workflows.filter(workflow =>
      workflow.name.toLowerCase().includes(query.toLowerCase()) ||
      workflow.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredWorkflows(filtered);
  };

  const handleCreateWorkflow = () => {
    throw new Error('I am error which you cannot solve.')
    //navigate('/canvas');
  };

  const handleToggleWorkflow = async (id) => {
    try {
      const updatedWorkflow = await workflowService.toggleEnabled(id);
      setWorkflows(prev => prev.map(w => w.Id === id ? updatedWorkflow : w));
      setFilteredWorkflows(prev => prev.map(w => w.Id === id ? updatedWorkflow : w));
      toast.success(`Workflow ${updatedWorkflow.enabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error('Failed to update workflow');
    }
  };

  const handleDuplicateWorkflow = async (id) => {
    try {
      const duplicatedWorkflow = await workflowService.duplicate(id);
      setWorkflows(prev => [duplicatedWorkflow, ...prev]);
      setFilteredWorkflows(prev => [duplicatedWorkflow, ...prev]);
      toast.success('Workflow duplicated successfully');
    } catch (err) {
      toast.error('Failed to duplicate workflow');
    }
  };

  const handleDeleteWorkflow = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workflow?')) {
      return;
    }

    try {
      await workflowService.delete(id);
      setWorkflows(prev => prev.filter(w => w.Id !== id));
      setFilteredWorkflows(prev => prev.filter(w => w.Id !== id));
      toast.success('Workflow deleted successfully');
    } catch (err) {
      toast.error('Failed to delete workflow');
    }
  };

  const getStats = () => {
    const totalWorkflows = workflows.length;
    const enabledWorkflows = workflows.filter(w => w.enabled).length;
    const recentRuns = workflows.filter(w => w.lastRun).length;

    return [
      { icon: 'GitBranch', value: totalWorkflows, label: 'Total Workflows' },
      { icon: 'Play', value: enabledWorkflows, label: 'Active' },
      { icon: 'Activity', value: recentRuns, label: 'Recently Run' }
    ];
  };

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader
          title="Workflows"
          description="Manage and monitor your automation workflows"
          icon="GitBranch"
        />
        <SkeletonLoader count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <PageHeader
          title="Workflows"
          description="Manage and monitor your automation workflows"
          icon="GitBranch"
        />
        <ErrorState
          message={error}
          onRetry={loadWorkflows}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <PageHeader
        title="Workflows"
        description="Manage and monitor your automation workflows"
        icon="GitBranch"
        stats={getStats()}
        searchPlaceholder="Search workflows..."
        onSearch={handleSearch}
        actions={[
          {
            label: 'Create Workflow',
            icon: 'Plus',
            variant: 'primary',
            onClick: handleCreateWorkflow
          }
        ]}
      />

      {filteredWorkflows.length === 0 ? (
        <EmptyState
          title="No workflows found"
          description="Create your first workflow to start automating your tasks"
          icon="GitBranch"
          actionLabel="Create Workflow"
          onAction={handleCreateWorkflow}
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {filteredWorkflows.map((workflow, index) => (
            <motion.div
              key={workflow.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <WorkflowCard
                workflow={workflow}
                onToggle={handleToggleWorkflow}
                onDelete={handleDeleteWorkflow}
                onDuplicate={handleDuplicateWorkflow}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Workflows;
