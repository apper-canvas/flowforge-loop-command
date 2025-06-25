import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  title, 
  description, 
  icon = 'Package', 
  actionLabel, 
  onAction,
  className = ''
}) => {
  const containerVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 }
  };

  const iconVariants = {
    animate: { 
      y: [0, -10, 0],
      rotateY: [0, 180, 360]
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        variants={iconVariants}
        animate="animate"
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-6"
      >
        <div className="w-16 h-16 mx-auto bg-surface-800 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={32} className="text-gray-400" />
        </div>
      </motion.div>
      
      <h3 className="text-xl font-heading font-semibold text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            variant="primary"
            icon="Plus"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;