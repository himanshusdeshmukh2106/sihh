import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { cn } from '../../utils/cn';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';

// Import Heroicons
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  CogIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  onMenuToggle?: () => void;
  breadcrumbs?: BreadcrumbItem[];
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuToggle, 
  breadcrumbs = [], 
  user,
  onLogout 
}) => {
  const [notificationCount] = React.useState(3); // Mock notification count

  return (
    <header className="bg-white border-b border-neutral-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Menu toggle and breadcrumbs */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Bars3Icon className="w-5 h-5" />
          </Button>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <svg
                        className="w-4 h-4 text-neutral-400 mx-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {crumb.href ? (
                      <a
                        href={crumb.href}
                        className="text-sm font-medium text-neutral-500 hover:text-neutral-700"
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <Typography variant="body2" color="neutral" weight="medium">
                        {crumb.label}
                      </Typography>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </div>

        {/* Right side - Notifications and user menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative">
              <BellIcon className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
          </div>

          {/* User Menu */}
          {user && (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
                <div className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img
                      className="w-8 h-8 rounded-full"
                      src={user.avatar}
                      alt={user.name}
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-neutral-400" />
                  )}
                  <div className="hidden md:block text-left">
                    <Typography variant="body2" weight="medium">
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      {user.role}
                    </Typography>
                  </div>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-neutral-400" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-neutral-200 rounded-lg shadow-lg focus:outline-none">
                  <div className="p-4 border-b border-neutral-100">
                    <Typography variant="body2" weight="medium">
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      {user.email}
                    </Typography>
                  </div>
                  
                  <div className="py-2">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={cn(
                            'flex items-center w-full px-4 py-2 text-sm transition-colors duration-200',
                            active ? 'bg-neutral-50 text-neutral-900' : 'text-neutral-700'
                          )}
                        >
                          <UserIcon className="w-4 h-4 mr-3" />
                          Profile
                        </button>
                      )}
                    </Menu.Item>
                    
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={cn(
                            'flex items-center w-full px-4 py-2 text-sm transition-colors duration-200',
                            active ? 'bg-neutral-50 text-neutral-900' : 'text-neutral-700'
                          )}
                        >
                          <CogIcon className="w-4 h-4 mr-3" />
                          Settings
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  
                  <div className="py-2 border-t border-neutral-100">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={onLogout}
                          className={cn(
                            'flex items-center w-full px-4 py-2 text-sm transition-colors duration-200',
                            active ? 'bg-neutral-50 text-error-600' : 'text-error-500'
                          )}
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>
      </div>
    </header>
  );
};

export { Header };