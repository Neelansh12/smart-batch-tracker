import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Bell,
  Settings,
  Leaf,
  ChevronLeft,
  Upload,
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'batches', label: 'Batch Tracking', icon: Package },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'upload', label: 'Quality Upload', icon: Upload },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function DashboardSidebar({ activeSection, onSectionChange }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center w-full')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
              <Leaf className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <h1 className="text-sm font-semibold text-sidebar-foreground">FoodFlow</h1>
                <p className="text-xs text-sidebar-foreground/60">Waste Minimizer</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-md text-sidebar-foreground/60 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground',
              collapsed && 'absolute -right-3 top-6 bg-sidebar border border-sidebar-border'
            )}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                  collapsed && 'justify-center px-0'
                )}
              >
                <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'animate-pulse')} />
                {!collapsed && <span className="animate-fade-in">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={cn('border-t border-sidebar-border p-4', collapsed && 'p-2')}>
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
              <span className="text-xs font-semibold text-sidebar-accent-foreground">FP</span>
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <p className="text-xs font-medium text-sidebar-foreground">Food Plant 1</p>
                <p className="text-xs text-sidebar-foreground/60">Premium Plan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
