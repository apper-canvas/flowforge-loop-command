import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  const shimmerVariants = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0']
    }
  };

  const CardSkeleton = () => (
    <div className="glass-panel rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <motion.div 
            className="h-6 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 rounded mb-2"
            style={{ backgroundSize: '200% 100%' }}
            variants={shimmerVariants}
            animate="animate"
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div 
            className="h-4 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 rounded w-3/4"
            style={{ backgroundSize: '200% 100%' }}
            variants={shimmerVariants}
            animate="animate"
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.2 }}
          />
        </div>
        <motion.div 
          className="w-16 h-6 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 rounded-full"
          style={{ backgroundSize: '200% 100%' }}
          variants={shimmerVariants}
          animate="animate"
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.4 }}
        />
      </div>
      <div className="flex items-center gap-4 mb-4">
        <motion.div 
          className="h-4 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 rounded w-20"
          style={{ backgroundSize: '200% 100%' }}
          variants={shimmerVariants}
          animate="animate"
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.6 }}
        />
        <motion.div 
          className="h-4 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 rounded w-24"
          style={{ backgroundSize: '200% 100%' }}
          variants={shimmerVariants}
          animate="animate"
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.8 }}
        />
      </div>
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <motion.div 
            key={i}
            className="h-8 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 rounded w-20"
            style={{ backgroundSize: '200% 100%' }}
            variants={shimmerVariants}
            animate="animate"
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 1 + i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );

  const RowSkeleton = () => (
    <tr className="border-b border-surface-700">
      <td className="px-6 py-4">
        <motion.div 
          className="h-4 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 rounded w-32"
          style={{ backgroundSize: '200% 100%' }}
          variants={shimmerVariants}
          animate="animate"
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </td>
      <td className="px-6 py-4">
        <motion.div 
          className="h-4 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 rounded w-24"
          style={{ backgroundSize: '200% 100%' }}
          variants={shimmerVariants}
          animate="animate"
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.2 }}
        />
      </td>
      <td className="px-6 py-4">
        <motion.div 
          className="h-4 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 rounded w-16"
          style={{ backgroundSize: '200% 100%' }}
          variants={shimmerVariants}
          animate="animate"
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.4 }}
        />
      </td>
      <td className="px-6 py-4">
        <motion.div 
          className="h-4 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 rounded w-20"
          style={{ backgroundSize: '200% 100%' }}
          variants={shimmerVariants}
          animate="animate"
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.6 }}
        />
      </td>
    </tr>
  );

  if (type === 'row') {
    return (
      <>
        {[...Array(count)].map((_, i) => (
          <RowSkeleton key={i} />
        ))}
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export default SkeletonLoader;