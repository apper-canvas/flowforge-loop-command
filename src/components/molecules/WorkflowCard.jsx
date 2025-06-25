import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import StatusBadge from '@/components/molecules/StatusBadge';

const WorkflowCard = ({ workflow, onToggle, onDelete, onDuplicate }) => {
  const navigate = useNavigate();

  const cardVariants = {
    hover: { 
      y: -4,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
    }
  };

  const handleEdit = () => {
    navigate(`/canvas/${workflow.Id}`);
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="
        glass-panel rounded-lg p-6 cursor-pointer transition-all duration-200
        hover:border-primary-500/30
      "
      onClick={handleEdit}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-lg text-white mb-1 truncate">
            {workflow.name}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-3">
            {workflow.description}
          </p>
        </div>
        <StatusBadge status={workflow.enabled ? 'enabled' : 'disabled'} />
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <ApperIcon name="GitBranch" size={14} />
            <span>{workflow.nodes?.length || 0} nodes</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Link" size={14} />
            <span>{workflow.connections?.length || 0} connections</span>
          </div>
        </div>
        {workflow.lastRun && (
          <div className="flex items-center gap-1">
            <ApperIcon name="Clock" size={14} />
            <span>{formatDistanceToNow(new Date(workflow.lastRun), { addSuffix: true })}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          icon="Play"
          onClick={() => onToggle?.(workflow.Id)}
        >
          {workflow.enabled ? 'Disable' : 'Enable'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon="Copy"
          onClick={() => onDuplicate?.(workflow.Id)}
        >
          Duplicate
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon="Trash2"
          onClick={() => onDelete?.(workflow.Id)}
          className="text-error hover:text-error hover:bg-error/10"
        >
          Delete
        </Button>
      </div>
    </motion.div>
  );
};

export default WorkflowCard;