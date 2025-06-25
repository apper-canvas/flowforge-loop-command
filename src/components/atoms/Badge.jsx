import ApperIcon from '@/components/ApperIcon';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  icon,
  className = '' 
}) => {
  const variants = {
    default: 'bg-surface-700 text-gray-300',
    primary: 'bg-primary-500/20 text-primary-400 border border-primary-500/30',
    secondary: 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30',
    success: 'bg-success/20 text-success border border-success/30',
    warning: 'bg-warning/20 text-warning border border-warning/30',
    error: 'bg-error/20 text-error border border-error/30',
    info: 'bg-info/20 text-info border border-info/30'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full font-medium
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
      {icon && <ApperIcon name={icon} size={12} />}
      {children}
    </span>
  );
};

export default Badge;