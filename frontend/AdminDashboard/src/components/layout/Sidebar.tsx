import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { Typography } from '../ui/Typography';

// Import Heroicons
import {
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  VideoCameraIcon,
  CogIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

export interface NavigationItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Overview',
    path: '/',
    icon: HomeIcon,
    children: []
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: ChartBarIcon,
    children: [
      { label: 'User Metrics', path: '/analytics/users', icon: UsersIcon },
      { label: 'Sport Analytics', path: '/analytics/sports', icon: ChartBarIcon },
      { label: 'Engagement', path: '/analytics/engagement', icon: ChartBarIcon }
    ]
  },
  {
    label: 'User Management',
    path: '/users',
    icon: UsersIcon,
    children: []
  },
  {
    label: 'Content',
    path: '/content',
    icon: VideoCameraIcon,
    children: [
      { label: 'Videos', path: '/content/videos', icon: VideoCameraIcon },
      { label: 'Moderation', path: '/content/moderation', icon: CogIcon }
    ]
  },
  {
    label: 'System',
    path: '/system',
    icon: CogIcon,
    children: [
      { label: 'Performance', path: '/system/performance', icon: ChartBarIcon },
      { label: 'Logs', path: '/system/logs', icon: CogIcon }
    ]
  }
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

interface NavigationItemProps {
  item: NavigationItem;
  isCollapsed: boolean;
  level?: number;
}

const NavigationItemComponent: React.FC<NavigationItemProps> = ({ 
  item, 
  isCollapsed, 
  level = 0 
}) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const isActive = location.pathname === item.path;
  const hasChildren = item.children && item.children.length > 0;
  const isParentActive = hasChildren && item.children?.some(child => 
    location.pathname.startsWith(child.path)
  );

  React.useEffect(() => {
    if (isParentActive) {
      setIsExpanded(true);
    }
  }, [isParentActive]);

  const handleToggle = () => {
    if (hasChildren && !isCollapsed) {
      setIsExpanded(!isExpanded);
    }
  };

  const linkClasses = cn(
    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
    level > 0 && 'ml-6',
    isActive || isParentActive
      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
  );

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={handleToggle}
          className={linkClasses}
        >
          <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </>
          )}
        </button>
        
        {!isCollapsed && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => (
              <NavigationItemComponent
                key={child.path}
                item={child}
                isCollapsed={isCollapsed}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink to={item.path} className={linkClasses}>
      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
      {!isCollapsed && <span>{item.label}</span>}
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  return (
    <div className={cn(
      'bg-white border-r border-neutral-200 transition-all duration-300 flex flex-col h-full',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo/Brand */}
      <div className="p-4 border-b border-neutral-200 flex-shrink-0">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">SA</span>
          </div>
          {!isCollapsed && (
            <div className="ml-3 min-w-0">
              <Typography variant="h6" className="text-neutral-900 truncate">
                Sports Admin
              </Typography>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavigationItemComponent
            key={item.path}
            item={item}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Collapse Toggle - Only show on desktop */}
      <div className="p-4 border-t border-neutral-200 flex-shrink-0 hidden lg:block">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors duration-200"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg 
            className={cn('w-5 h-5 transition-transform duration-200', isCollapsed && 'rotate-180')} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export { Sidebar };