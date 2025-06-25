import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import executionService from '@/services/api/executionService';
import workflowService from '@/services/api/workflowService';
import PageHeader from '@/components/organisms/PageHeader';
import ExecutionRow from '@/components/molecules/ExecutionRow';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import StatusBadge from '@/components/molecules/StatusBadge';
import ApperIcon from '@/components/ApperIcon';

const Executions = () => {
  const [executions, setExecutions] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedExecution, setSelectedExecution] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [executionsResult, workflowsResult] = await Promise.all([
        executionService.getAll(),
        workflowService.getAll()
      ]);
      setExecutions(executionsResult);
      setWorkflows(workflowsResult);
    } catch (err) {
      setError(err.message || 'Failed to load execution data');
      toast.error('Failed to load execution data');
    } finally {
      setLoading(false);
    }
  };

  const handleExecutionClick = (execution) => {
    setSelectedExecution(execution);
  };

  const getWorkflowById = (workflowId) => {
    return workflows.find(w => w.Id === workflowId);
  };

  const getStats = () => {
    const totalExecutions = executions.length;
    const successCount = executions.filter(e => e.status === 'success').length;
    const failedCount = executions.filter(e => e.status === 'failed').length;
    const runningCount = executions.filter(e => e.status === 'running').length;

    return [
      { icon: 'Activity', value: totalExecutions, label: 'Total Runs' },
      { icon: 'CheckCircle', value: successCount, label: 'Successful' },
      { icon: 'XCircle', value: failedCount, label: 'Failed' },
      { icon: 'PlayCircle', value: runningCount, label: 'Running' }
    ];
  };

  const ExecutionDetailsModal = () => {
    if (!selectedExecution) return null;

    const workflow = getWorkflowById(selectedExecution.workflowId);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedExecution(null)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-surface-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-surface-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedExecution.status} size="md" />
                <div>
                  <h3 className="font-heading font-semibold text-lg text-white">
                    {workflow?.name || `Workflow ${selectedExecution.workflowId}`}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Execution ID: {selectedExecution.Id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedExecution(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <h4 className="font-medium text-white mb-4">Execution Logs</h4>
            <div className="space-y-3">
              {selectedExecution.logs?.map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-surface-700 rounded-lg"
                >
                  <div className={`
                    w-2 h-2 rounded-full mt-2 flex-shrink-0
                    ${log.level === 'error' ? 'bg-error' : 
                      log.level === 'success' ? 'bg-success' : 'bg-info'}
                  `} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      {log.nodeId && (
                        <span className="text-xs bg-surface-600 px-2 py-1 rounded text-gray-300">
                          {log.nodeId}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 break-words">
                      {log.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader
          title="Executions"
          description="Monitor workflow execution history and logs"
          icon="Activity"
        />
        <div className="glass-panel rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Workflow</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Started</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Duration</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Logs</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Time Ago</th>
              </tr>
            </thead>
            <tbody>
              <SkeletonLoader count={5} type="row" />
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <PageHeader
          title="Executions"
          description="Monitor workflow execution history and logs"
          icon="Activity"
        />
        <ErrorState
          message={error}
          onRetry={loadData}
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
        title="Executions"
        description="Monitor workflow execution history and logs"
        icon="Activity"
        stats={getStats()}
      />

      {executions.length === 0 ? (
        <EmptyState
          title="No executions found"
          description="Workflow executions will appear here once your workflows start running"
          icon="Activity"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-lg overflow-hidden"
        >
          <table className="w-full">
            <thead className="bg-surface-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Workflow</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Started</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Duration</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Logs</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Time Ago</th>
              </tr>
            </thead>
            <tbody>
              {executions.map((execution, index) => (
                <motion.div
                  key={execution.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ExecutionRow
                    execution={execution}
                    workflow={getWorkflowById(execution.workflowId)}
                    onClick={handleExecutionClick}
                  />
                </motion.div>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {selectedExecution && <ExecutionDetailsModal />}
    </motion.div>
  );
};

export default Executions;