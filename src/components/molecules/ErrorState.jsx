import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ 
  title = "Something went wrong", 
  message, 
  onRetry,
  className = ''
}) => {
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  const iconVariants = {
    animate: { 
      rotate: [0, -10, 10, -10, 0],
      scale: [1, 1.1, 1]
    }
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
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-6"
      >
        <div className="w-16 h-16 mx-auto bg-error/20 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={32} className="text-error" />
        </div>
      </motion.div>
      
      <h3 className="text-xl font-heading font-semibold text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        {message || "An unexpected error occurred. Please try again."}
      </p>
      
      {onRetry && (
        <Button
          variant="primary"
          icon="RefreshCw"
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;