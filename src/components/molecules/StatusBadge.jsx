import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatusBadge = ({ status, size = 'sm' }) => {
  const statusConfig = {
    running: {
      variant: 'info',
      icon: 'PlayCircle',
      label: 'Running',
      pulse: true
    },
    success: {
      variant: 'success',
      icon: 'CheckCircle',
      label: 'Success',
      pulse: false
    },
    failed: {
      variant: 'error',
      icon: 'XCircle',
      label: 'Failed',
      pulse: false
    },
    enabled: {
      variant: 'success',
      icon: 'Power',
      label: 'Enabled',
      pulse: false
    },
    disabled: {
      variant: 'default',
      icon: 'PowerOff',
      label: 'Disabled',
      pulse: false
    }
  };

  const config = statusConfig[status] || statusConfig.disabled;

  const variants = {
    default: 'bg-surface-700 text-gray-300',
    success: 'bg-success/20 text-success border border-success/30',
    error: 'bg-error/20 text-error border border-error/30',
    info: 'bg-info/20 text-info border border-info/30'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <motion.span 
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${variants[config.variant]}
        ${sizes[size]}
      `}
      animate={config.pulse ? { opacity: [1, 0.7, 1] } : {}}
      transition={config.pulse ? { duration: 2, repeat: Infinity } : {}}
    >
      <ApperIcon name={config.icon} size={12} />
      {config.label}
    </motion.span>
  );
};

export default StatusBadge;