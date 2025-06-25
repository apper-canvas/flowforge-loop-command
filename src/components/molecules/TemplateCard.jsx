import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const TemplateCard = ({ template, onUse }) => {
  const cardVariants = {
    hover: { 
      y: -4,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="
        glass-panel rounded-lg p-6 transition-all duration-200
        hover:border-primary-500/30
      "
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-lg text-white mb-2 truncate">
            {template.name}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-3">
            {template.description}
          </p>
        </div>
        <Badge variant="primary" size="sm">
          {template.category}
        </Badge>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <ApperIcon name="GitBranch" size={14} />
            <span>{template.nodes?.length || 0} nodes</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="TrendingUp" size={14} />
            <span>{template.popularity}% popular</span>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        size="sm"
        icon="Plus"
        onClick={() => onUse?.(template.Id)}
        className="w-full"
      >
        Use Template
      </Button>
    </motion.div>
  );
};

export default TemplateCard;