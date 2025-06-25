import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import workflowService from '@/services/api/workflowService';
import appService from '@/services/api/appService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import StatusBadge from '@/components/molecules/StatusBadge';

const WorkflowCanvas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [workflow, setWorkflow] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showNodePalette, setShowNodePalette] = useState(true);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Node types configuration
  const nodeTypes = {
    trigger: {
      color: '#10B981',
      icon: 'Play',
      label: 'Trigger'
    },
    action: {
      color: '#3B82F6',
      icon: 'Zap',
      label: 'Action'
    },
    condition: {
      color: '#F59E0B',
      icon: 'GitBranch',
      label: 'Condition'
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsResult] = await Promise.all([
        appService.getAll()
      ]);
      
      setApps(appsResult);

      if (id) {
        const workflowResult = await workflowService.getById(id);
        setWorkflow(workflowResult);
      } else {
        // Create new workflow
        setWorkflow({
          name: 'Untitled Workflow',
          description: '',
          nodes: [],
          connections: [],
          enabled: false
        });
      }
    } catch (err) {
      toast.error('Failed to load workflow data');
      navigate('/workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWorkflow = async () => {
    if (!workflow.name.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    setSaving(true);
    try {
      let savedWorkflow;
      if (workflow.Id) {
        savedWorkflow = await workflowService.update(workflow.Id, workflow);
      } else {
        savedWorkflow = await workflowService.create(workflow);
        navigate(`/canvas/${savedWorkflow.Id}`, { replace: true });
      }
      setWorkflow(savedWorkflow);
      toast.success('Workflow saved successfully');
    } catch (err) {
      toast.error('Failed to save workflow');
    } finally {
      setSaving(false);
    }
  };

  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (isDragging) {
      setCanvasOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta) => {
    const newZoom = Math.max(0.5, Math.min(2, zoom + delta));
    setZoom(newZoom);
  };

  const addNode = (type, service) => {
    const newNode = {
      id: `${type}_${Date.now()}`,
      type,
      service,
      config: {},
      position: { 
        x: 200 - canvasOffset.x / zoom, 
        y: 200 - canvasOffset.y / zoom 
      }
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  };

  const updateNode = (nodeId, updates) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }));
  };

  const deleteNode = (nodeId) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      connections: prev.connections.filter(conn => 
        conn.source !== nodeId && conn.target !== nodeId
      )
    }));
    setSelectedNode(null);
  };

  const NodePalette = () => (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: showNodePalette ? 0 : -250 }}
      className="fixed left-0 top-0 bottom-0 w-80 bg-surface-800 border-r border-surface-700 z-40 overflow-y-auto"
    >
      <div className="p-4 border-b border-surface-700">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold text-white">Node Palette</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={showNodePalette ? "ChevronLeft" : "ChevronRight"}
            onClick={() => setShowNodePalette(!showNodePalette)}
          />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {Object.entries(nodeTypes).map(([type, config]) => (
          <div key={type}>
            <h4 className="font-medium text-gray-300 mb-3 flex items-center gap-2">
              <ApperIcon name={config.icon} size={16} style={{ color: config.color }} />
              {config.label}s
            </h4>
            <div className="space-y-2">
              {apps.filter(app => app.connected).map(app => (
                <motion.button
                  key={`${type}-${app.Id}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addNode(type, app.name)}
                  className="
                    w-full p-3 bg-surface-700 rounded-lg border border-surface-600
                    hover:border-primary-500/50 transition-all duration-200
                    flex items-center gap-3
                  "
                >
                  <div 
                    className="w-8 h-8 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: app.color + '20', color: app.color }}
                  >
                    <ApperIcon name={app.icon} size={16} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white text-sm">{app.name}</p>
                    <p className="text-xs text-gray-400">{app.category}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const WorkflowNode = ({ node, isSelected, onClick }) => {
    const nodeConfig = nodeTypes[node.type];
    const app = apps.find(a => a.name === node.service);

    return (
      <motion.div
        drag
        dragMomentum={false}
        onDragEnd={(e, info) => {
          updateNode(node.id, {
            position: {
              x: node.position.x + info.offset.x / zoom,
              y: node.position.y + info.offset.y / zoom
            }
          });
        }}
        whileHover={{ scale: 1.05 }}
        className={`
          absolute bg-surface-800 border-2 rounded-lg p-4 cursor-pointer
          transition-all duration-200 min-w-[160px] node-glow
          ${isSelected ? 'border-primary-500 shadow-lg shadow-primary-500/25' : 'border-surface-600'}
        `}
        style={{
          left: node.position.x * zoom + canvasOffset.x,
          top: node.position.y * zoom + canvasOffset.y,
          transform: `scale(${zoom})`
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(node);
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: nodeConfig.color }}
          >
            <ApperIcon name={nodeConfig.icon} size={12} className="text-white" />
          </div>
          <span className="font-medium text-white text-sm">{node.service}</span>
        </div>
        <div className="text-xs text-gray-400">
          {nodeConfig.label}
        </div>
      </motion.div>
    );
  };

  const NodeConfigPanel = () => {
    if (!selectedNode) return null;

    return (
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        className="fixed right-0 top-0 bottom-0 w-80 bg-surface-800 border-l border-surface-700 z-40 overflow-y-auto"
      >
        <div className="p-4 border-b border-surface-700">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-white">Node Configuration</h3>
            <Button
              variant="ghost"
              size="sm"
              icon="X"
              onClick={() => setSelectedNode(null)}
            />
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-surface-700 rounded-lg">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: nodeTypes[selectedNode.type].color }}
            >
              <ApperIcon name={nodeTypes[selectedNode.type].icon} size={16} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-white">{selectedNode.service}</p>
              <p className="text-sm text-gray-400">{nodeTypes[selectedNode.type].label}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Configuration
              </label>
              <textarea
                value={JSON.stringify(selectedNode.config, null, 2)}
                onChange={(e) => {
                  try {
                    const config = JSON.parse(e.target.value);
                    updateNode(selectedNode.id, { config });
                  } catch (err) {
                    // Invalid JSON, don't update
                  }
                }}
                className="
                  w-full h-40 px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg
                  text-white placeholder-gray-400 font-mono text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                "
                placeholder='{"key": "value"}'
              />
            </div>

            <Button
              variant="danger"
              icon="Trash2"
              onClick={() => deleteNode(selectedNode.id)}
              className="w-full"
            >
              Delete Node
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="Loader2" size={48} className="text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading workflow...</p>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
          <p className="text-white mb-2">Workflow not found</p>
          <Button variant="primary" onClick={() => navigate('/workflows')}>
            Back to Workflows
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-surface-800 border-b border-surface-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              icon="ArrowLeft"
              onClick={() => navigate('/workflows')}
            >
              Back
            </Button>
            <div className="flex items-center gap-3">
              <Input
                value={workflow.name}
                onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
                className="font-heading font-semibold text-lg bg-transparent border-none p-0 focus:ring-0"
                placeholder="Workflow name"
              />
              {workflow.Id && (
                <StatusBadge status={workflow.enabled ? 'enabled' : 'disabled'} />
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              icon="TestTube"
              disabled={!workflow.nodes.length}
            >
              Test
            </Button>
            <Button
              variant="primary"
              icon="Save"
              onClick={handleSaveWorkflow}
              loading={saving}
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        <NodePalette />
        
        {/* Canvas */}
        <div 
          className={`flex-1 workflow-grid bg-surface-900 relative overflow-hidden cursor-${isDragging ? 'grabbing' : 'grab'}`}
          style={{ marginLeft: showNodePalette ? '0' : '-250px' }}
        >
          <div
            ref={canvasRef}
            className="w-full h-full relative"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          >
            {/* Nodes */}
            {workflow.nodes.map(node => (
              <WorkflowNode
                key={node.id}
                node={node}
                isSelected={selectedNode?.id === node.id}
                onClick={setSelectedNode}
              />
            ))}
            
            {/* Empty State */}
            {workflow.nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <ApperIcon name="GitBranch" size={64} className="text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold text-gray-400 mb-2">
                    Start Building Your Workflow
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Drag nodes from the palette to create your automation
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Canvas Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon="Plus"
              onClick={() => handleZoom(0.1)}
            />
            <Button
              variant="secondary"
              size="sm"
              icon="Minus"
              onClick={() => handleZoom(-0.1)}
            />
            <div className="px-2 py-1 bg-surface-800 rounded text-sm text-gray-300">
              {Math.round(zoom * 100)}%
            </div>
          </div>
        </div>

        {/* Node Configuration Panel */}
        <AnimatePresence>
          {selectedNode && <NodeConfigPanel />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorkflowCanvas;