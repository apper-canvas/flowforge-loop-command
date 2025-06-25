import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import appService from '@/services/api/appService';
import PageHeader from '@/components/organisms/PageHeader';
import AppCard from '@/components/molecules/AppCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import Button from '@/components/atoms/Button';

const ConnectedApps = () => {
  const [apps, setApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showConnectedOnly, setShowConnectedOnly] = useState(false);

  const categories = ['all', 'Email', 'Communication', 'Storage', 'CRM', 'Social Media', 'Forms', 'Marketing', 'CMS', 'Finance'];

  useEffect(() => {
    loadApps();
  }, []);

  useEffect(() => {
    filterApps();
  }, [apps, selectedCategory, showConnectedOnly]);

  const loadApps = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await appService.getAll();
      setApps(result);
    } catch (err) {
      setError(err.message || 'Failed to load apps');
      toast.error('Failed to load apps');
    } finally {
      setLoading(false);
    }
  };

  const filterApps = () => {
    let filtered = apps;

    if (showConnectedOnly) {
      filtered = filtered.filter(app => app.connected);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(app => app.category === selectedCategory);
    }

    setFilteredApps(filtered);
  };

  const handleSearch = (query) => {
    let filtered = apps;

    if (showConnectedOnly) {
      filtered = filtered.filter(app => app.connected);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(app => app.category === selectedCategory);
    }

    if (query.trim()) {
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(query.toLowerCase()) ||
        app.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredApps(filtered);
  };

  const handleConnect = async (appId) => {
    try {
      // Simulate connection with dummy credentials
      const updatedApp = await appService.connect(appId, { token: 'dummy_token' });
      setApps(prev => prev.map(app => app.Id === appId ? updatedApp : app));
      toast.success(`${updatedApp.name} connected successfully`);
    } catch (err) {
      toast.error('Failed to connect app');
    }
  };

  const handleDisconnect = async (appId) => {
    if (!window.confirm('Are you sure you want to disconnect this app?')) {
      return;
    }

    try {
      const updatedApp = await appService.disconnect(appId);
      setApps(prev => prev.map(app => app.Id === appId ? updatedApp : app));
      toast.success(`${updatedApp.name} disconnected successfully`);
    } catch (err) {
      toast.error('Failed to disconnect app');
    }
  };

  const getStats = () => {
    const totalApps = apps.length;
    const connectedApps = apps.filter(app => app.connected).length;
    const availableCategories = [...new Set(apps.map(app => app.category))].length;

    return [
      { icon: 'Grid3x3', value: totalApps, label: 'Total Apps' },
      { icon: 'CheckCircle', value: connectedApps, label: 'Connected' },
      { icon: 'Grid2x2', value: availableCategories, label: 'Categories' }
    ];
  };

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader
          title="Connected Apps"
          description="Manage your app connections and integrations"
          icon="Grid3x3"
        />
        <SkeletonLoader count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <PageHeader
          title="Connected Apps"
          description="Manage your app connections and integrations"
          icon="Grid3x3"
        />
        <ErrorState
          message={error}
          onRetry={loadApps}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <PageHeader
        title="Connected Apps"
        description="Manage your app connections and integrations"
        icon="Grid3x3"
        stats={getStats()}
        searchPlaceholder="Search apps..."
        onSearch={handleSearch}
      />

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={showConnectedOnly ? 'primary' : 'secondary'}
            size="sm"
            icon="CheckCircle"
            onClick={() => setShowConnectedOnly(!showConnectedOnly)}
          >
            {showConnectedOnly ? 'Show All' : 'Connected Only'}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All Categories' : category}
            </Button>
          ))}
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <EmptyState
          title="No apps found"
          description="Try adjusting your search or filter settings"
          icon="Search"
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {filteredApps.map((app, index) => (
            <motion.div
              key={app.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AppCard
                app={app}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ConnectedApps;