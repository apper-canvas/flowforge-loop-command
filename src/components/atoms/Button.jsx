import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40',
    secondary: 'bg-surface-700 text-white border border-surface-600 hover:bg-surface-600',
    accent: 'bg-accent text-white shadow-lg shadow-accent/25 hover:shadow-accent/40',
    ghost: 'text-gray-300 hover:text-white hover:bg-surface-700',
    danger: 'bg-error text-white shadow-lg shadow-error/25 hover:shadow-error/40'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20
  };

  return (
    <motion.button
      variants={buttonVariants}
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-900
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={iconSize[size]} 
          className="animate-spin" 
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon name={icon} size={iconSize[size]} />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} size={iconSize[size]} />
      )}
    </motion.button>
  );
};

export default Button;