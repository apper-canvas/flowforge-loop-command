import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  const containerVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 }
  };

  const iconVariants = {
    animate: { 
      rotate: [0, -10, 10, -10, 0],
      scale: [1, 1.1, 1]
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-6">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="text-center max-w-md"
      >
        <motion.div
          variants={iconVariants}
          animate="animate"
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-primary-500/20 rounded-full flex items-center justify-center">
            <ApperIcon name="SearchX" size={48} className="text-primary-500" />
          </div>
        </motion.div>
        
        <h1 className="text-6xl font-heading font-bold text-white mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-heading font-semibold text-white mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            icon="Home"
            onClick={() => navigate('/workflows')}
          >
            Go to Workflows
          </Button>
          <Button
            variant="secondary"
            icon="ArrowLeft"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;