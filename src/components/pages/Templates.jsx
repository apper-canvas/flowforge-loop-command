import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import templateService from '@/services/api/templateService';
import workflowService from '@/services/api/workflowService';
import PageHeader from '@/components/organisms/PageHeader';
import TemplateCard from '@/components/molecules/TemplateCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import Button from '@/components/atoms/Button';

const Templates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Communication', 'Sales', 'Marketing', 'Productivity', 'Support'];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await templateService.getAll();
      setTemplates(result);
      setFilteredTemplates(result);
    } catch (err) {
      setError(err.message || 'Failed to load templates');
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    let filtered = templates;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    if (query.trim()) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query.toLowerCase()) ||
        template.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    let filtered = templates;

    if (category !== 'all') {
      filtered = filtered.filter(template => template.category === category);
    }

    setFilteredTemplates(filtered);
  };

  const handleUseTemplate = async (templateId) => {
    try {
      const workflowData = await templateService.createWorkflowFromTemplate(templateId);
      const newWorkflow = await workflowService.create(workflowData);
      toast.success('Workflow created from template');
      navigate(`/canvas/${newWorkflow.Id}`);
    } catch (err) {
      toast.error('Failed to create workflow from template');
    }
  };

  const getStats = () => {
    const totalTemplates = templates.length;
    const categories = [...new Set(templates.map(t => t.category))].length;
    const avgPopularity = Math.round(
      templates.reduce((sum, t) => sum + t.popularity, 0) / templates.length
    );

    return [
      { icon: 'FileText', value: totalTemplates, label: 'Templates' },
      { icon: 'Grid3x3', value: categories, label: 'Categories' },
      { icon: 'TrendingUp', value: `${avgPopularity}%`, label: 'Avg Popularity' }
    ];
  };

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader
          title="Templates"
          description="Pre-built workflow templates to get you started quickly"
          icon="FileText"
        />
        <SkeletonLoader count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <PageHeader
          title="Templates"
          description="Pre-built workflow templates to get you started quickly"
          icon="FileText"
        />
        <ErrorState
          message={error}
          onRetry={loadTemplates}
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
        title="Templates"
        description="Pre-built workflow templates to get you started quickly"
        icon="FileText"
        stats={getStats()}
        searchPlaceholder="Search templates..."
        onSearch={handleSearch}
      />

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleCategoryChange(category)}
            >
              {category === 'all' ? 'All Categories' : category}
            </Button>
          ))}
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <EmptyState
          title="No templates found"
          description="Try adjusting your search or category filter"
          icon="Search"
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TemplateCard
                template={template}
                onUse={handleUseTemplate}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Templates;