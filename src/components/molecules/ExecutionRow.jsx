import { motion } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/molecules/StatusBadge';

const ExecutionRow = ({ execution, workflow, onClick }) => {
  const rowVariants = {
    hover: { backgroundColor: 'rgba(31, 41, 55, 0.5)' }
  };

  const getDuration = () => {
    if (!execution.endTime) return 'Running...';
    const start = new Date(execution.startTime);
    const end = new Date(execution.endTime);
    const diff = end - start;
    return `${(diff / 1000).toFixed(1)}s`;
  };

  return (
    <motion.tr
      variants={rowVariants}
      whileHover="hover"
      className="cursor-pointer border-b border-surface-700"
      onClick={() => onClick?.(execution)}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <StatusBadge status={execution.status} />
          <div>
            <p className="font-medium text-white">
              {workflow?.name || `Workflow ${execution.workflowId}`}
            </p>
            <p className="text-sm text-gray-400">
              ID: {execution.Id}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-300">
        <div>
          <p className="font-medium">
            {format(new Date(execution.startTime), 'MMM d, yyyy')}
          </p>
          <p className="text-sm text-gray-400">
            {format(new Date(execution.startTime), 'h:mm a')}
          </p>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-300">
        {getDuration()}
      </td>
      <td className="px-6 py-4 text-gray-300">
        {execution.logs?.length || 0} logs
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">
        {formatDistanceToNow(new Date(execution.startTime), { addSuffix: true })}
      </td>
    </motion.tr>
  );
};

export default ExecutionRow;