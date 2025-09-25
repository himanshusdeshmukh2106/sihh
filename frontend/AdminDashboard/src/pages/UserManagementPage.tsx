import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { DataTable, Button, Card, Typography } from '../components/ui';
import type { Column } from '../components/ui';
import { FilterBar } from '../components/layout/FilterBar';
import { useFilters } from '../contexts/FilterContext';
import { userManagementService } from '../services/userManagementService';
import type { User, UserStatus } from '../types';

interface UserTableData extends User {
  key: string;
}

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedSports, searchQuery, userStatus, experienceLevel } = useFilters();
  
  const [users, setUsers] = useState<UserTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });

  // Load users data
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userManagementService.getUsers({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchQuery || undefined,
        sport: selectedSports.length > 0 ? selectedSports[0] : undefined,
        status: userStatus.length > 0 ? userStatus[0] : undefined,
        experience_level: experienceLevel.length > 0 ? experienceLevel[0] : undefined
      });

      const tableData: UserTableData[] = response.users.map(user => ({
        ...user,
        key: user.id.toString()
      }));

      setUsers(tableData);
      setPagination(prev => ({
        ...prev,
        total: response.total
      }));
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [pagination.current, pagination.pageSize, selectedSports, searchQuery, userStatus, experienceLevel]);

  // Handle user status update
  const handleStatusUpdate = async (userId: number, newStatus: UserStatus, reason?: string) => {
    try {
      await userManagementService.updateUserStatus(userId, { status: newStatus, reason });
      loadUsers(); // Reload data
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await userManagementService.deleteUser(userId);
        loadUsers(); // Reload data
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedRowKeys.length === 0) return;

    const userIds = selectedRowKeys.map(key => parseInt(key.toString()));
    
    if (window.confirm(`Are you sure you want to ${action} ${userIds.length} user(s)?`)) {
      try {
        // This would be implemented in the service
        console.log(`Bulk ${action} for users:`, userIds);
        setSelectedRowKeys([]);
        loadUsers();
      } catch (error) {
        console.error(`Failed to ${action} users:`, error);
      }
    }
  };

  // Table columns
  const columns: Column<UserTableData>[] = [
    {
      key: 'user',
      title: 'User',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <div className="font-medium text-neutral-900">{record.full_name}</div>
            <div className="text-sm text-neutral-500">{record.email}</div>
          </div>
        </div>
      ),
      sortable: true,
      filterable: true
    },
    {
      key: 'sport',
      title: 'Primary Sport',
      dataIndex: 'primary_sport',
      render: (sport) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {sport || 'Not specified'}
        </span>
      ),
      sortable: true,
      filterable: true
    },
    {
      key: 'experience',
      title: 'Experience',
      dataIndex: 'experience_level',
      render: (level) => {
        const colors = {
          beginner: 'bg-green-100 text-green-800',
          intermediate: 'bg-yellow-100 text-yellow-800',
          advanced: 'bg-orange-100 text-orange-800',
          professional: 'bg-purple-100 text-purple-800'
        };
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            colors[level as keyof typeof colors] || 'bg-neutral-100 text-neutral-800'
          }`}>
            {level || 'Not specified'}
          </span>
        );
      },
      sortable: true
    },
    {
      key: 'location',
      title: 'Location',
      dataIndex: 'city',
      render: (city) => city || 'Not specified',
      sortable: true,
      filterable: true
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, record) => {
        const isActive = record.is_active;
        const isCompleted = record.profile_completed;
        
        return (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {isActive ? (
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
              ) : (
                <XCircleIcon className="w-4 h-4 text-red-500" />
              )}
              <span className={`ml-1 text-xs font-medium ${
                isActive ? 'text-green-700' : 'text-red-700'
              }`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            {!isCompleted && (
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
                <span className="ml-1 text-xs text-yellow-700">Incomplete</span>
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'created_at',
      title: 'Joined',
      dataIndex: 'created_at',
      render: (date) => new Date(date).toLocaleDateString(),
      sortable: true
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/users/${record.id}`)}
            title="View Details"
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/users/${record.id}/edit`)}
            title="Edit User"
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusUpdate(
              record.id, 
              record.is_active ? 'inactive' : 'active'
            )}
            title={record.is_active ? 'Deactivate' : 'Activate'}
          >
            {record.is_active ? (
              <XCircleIcon className="w-4 h-4 text-red-500" />
            ) : (
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteUser(record.id)}
            title="Delete User"
          >
            <TrashIcon className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
      width: 150
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1" className="text-neutral-900">
            User Management
          </Typography>
          <Typography variant="body1" className="text-neutral-600 mt-1">
            Manage and monitor user accounts, profiles, and activities
          </Typography>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => navigate('/users/export')}>
            Export Users
          </Button>
          <Button onClick={() => navigate('/users/new')}>
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <Typography variant="h3" className="text-neutral-900">
                  {pagination.total}
                </Typography>
                <Typography variant="body2" className="text-neutral-600">
                  Total Users
                </Typography>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <Typography variant="h3" className="text-neutral-900">
                  {users.filter(u => u.is_active).length}
                </Typography>
                <Typography variant="body2" className="text-neutral-600">
                  Active Users
                </Typography>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <Typography variant="h3" className="text-neutral-900">
                  {users.filter(u => !u.profile_completed).length}
                </Typography>
                <Typography variant="body2" className="text-neutral-600">
                  Incomplete Profiles
                </Typography>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <Typography variant="h3" className="text-neutral-900">
                  {users.filter(u => {
                    const joinDate = new Date(u.created_at);
                    const monthAgo = new Date();
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return joinDate > monthAgo;
                  }).length}
                </Typography>
                <Typography variant="body2" className="text-neutral-600">
                  New This Month
                </Typography>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <FilterBar
        showSportFilter={true}
        showDateFilter={false}
        showSearch={true}
        searchPlaceholder="Search users by name, email, or sport..."
      />

      {/* Bulk Actions */}
      {selectedRowKeys.length > 0 && (
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <Typography variant="body2" className="text-neutral-600">
                {selectedRowKeys.length} user{selectedRowKeys.length !== 1 ? 's' : ''} selected
              </Typography>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('activate')}
                >
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('deactivate')}
                >
                  Deactivate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('export')}
                >
                  Export Selected
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys
          }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || prev.pageSize
              }));
            }
          }}
          onRow={(record) => ({
            onDoubleClick: () => navigate(`/users/${record.id}`)
          })}
        />
      </Card>
    </div>
  );
};

export default UserManagementPage;