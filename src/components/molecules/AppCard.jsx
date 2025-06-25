import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const AppCard = ({ app, onConnect, onDisconnect }) => {
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
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: app.color + '20', color: app.color }}
          >
            <ApperIcon name={app.icon} size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-lg text-white mb-1 truncate">
              {app.name}
            </h3>
            <p className="text-gray-400 text-sm">
              {app.description}
            </p>
          </div>
        </div>
        <Badge 
          variant={app.connected ? 'success' : 'default'} 
          size="sm"
          icon={app.connected ? 'CheckCircle' : 'Circle'}
        >
          {app.connected ? 'Connected' : 'Not Connected'}
        </Badge>
      </div>

      <div className="mb-4">
        <Badge variant="secondary" size="sm" className="mb-2">
          {app.category}
        </Badge>
        <div className="text-sm text-gray-400">
          <p className="mb-1">
            <span className="font-medium">{app.triggers?.length || 0}</span> triggers, 
            <span className="font-medium ml-1">{app.actions?.length || 0}</span> actions
          </p>
        </div>
      </div>

      {app.connected ? (
        <Button
          variant="secondary"
          size="sm"
          icon="Unplug"
          onClick={() => onDisconnect?.(app.Id)}
          className="w-full"
        >
          Disconnect
        </Button>
      ) : (
        <Button
          variant="primary"
          size="sm"
          icon="Plug"
          onClick={() => onConnect?.(app.Id)}
          className="w-full"
        >
          Connect
        </Button>
      )}
    </motion.div>
  );
};

export default AppCard;