import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';

const PageHeader = ({ 
  title, 
  description, 
  icon,
  actions,
  searchPlaceholder,
  onSearch,
  stats
}) => {
  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={headerVariants}
      initial="initial"
      animate="animate"
      className="mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {icon && (
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name={icon} size={24} className="text-white" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-heading font-bold text-white">
                {title}
              </h1>
              {description && (
                <p className="text-gray-400 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {stats && (
            <div className="flex items-center gap-6 mt-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <ApperIcon name={stat.icon} size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-400">
                    <span className="font-medium text-white">{stat.value}</span> {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {onSearch && (
            <SearchBar
              placeholder={searchPlaceholder}
              onSearch={onSearch}
              className="sm:w-80"
            />
          )}
          
          {actions && (
            <div className="flex items-center gap-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'primary'}
                  icon={action.icon}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PageHeader;