import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const sidebarVariants = {
    closed: { x: '-100%' },
    open: { x: 0 }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface-900">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-surface-800 border-b border-surface-700 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" size={20} className="text-white" />
          </div>
          <h1 className="font-heading font-bold text-lg text-white">FlowForge</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-surface-800 border-r border-surface-700 flex-col">
          <div className="p-6 border-b border-surface-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-xl text-white">FlowForge</h1>
                <p className="text-xs text-gray-400">Automation Platform</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-surface-700'
                  }`
                }
              >
                <ApperIcon name={route.icon} size={20} />
                <span className="font-medium">{route.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.aside
                variants={sidebarVariants}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{ type: "tween", duration: 0.3 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-surface-800 border-r border-surface-700 z-50 flex flex-col"
              >
                <div className="p-6 border-b border-surface-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Zap" size={24} className="text-white" />
                    </div>
                    <div>
                      <h1 className="font-heading font-bold text-xl text-white">FlowForge</h1>
                      <p className="text-xs text-gray-400">Automation Platform</p>
                    </div>
                  </div>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                  {routeArray.map((route) => (
                    <NavLink
                      key={route.id}
                      to={route.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                            : 'text-gray-300 hover:text-white hover:bg-surface-700'
                        }`
                      }
                    >
                      <ApperIcon name={route.icon} size={20} />
                      <span className="font-medium">{route.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;