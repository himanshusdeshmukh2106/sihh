import React, { useState, useEffect } from 'react';
import {
  VideoCameraIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { DataTable, Button, Card, Typography } from '../components/ui';
import type { TableColumn } from '../types';
import { FilterBar } from '../components/layout/FilterBar';
import { useFilters } from '../contexts/FilterContext';
import { videoContentService } from '../services/videoContentService';
import type { VideoContent, VideoStatus, ModerationStatus } from '../types';

interface VideoTableData extends VideoContent {
  key: string;
}

const VideoManagementPage: React.FC = () => {
  const { selectedSports, searchQuery } = useFilters();
  
  const [videos, setVideos] = useState<VideoTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');

  // Load videos data
  const loadVideos = async () => {
    setLoading(true);
    try {
      const response = await videoContentService.getVideos({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchQuery || undefined,
        sport: selectedSports.length > 0 ? selectedSports[0] : undefined,
        status: filterStatus || undefined,
        category: filterCategory || undefined
      });

      const tableData: VideoTableData[] = response.videos.map(video => ({
        ...video,
        key: video.id.toString()
      }));

      setVideos(tableData);
      setPagination(prev => ({
        ...prev,
        total: response.total
      }));
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [pagination.current, pagination.pageSize, selectedSports, searchQuery, filterStatus, filterCategory]);

  // Handle video moderation
  const handleModeration = async (videoId: string, action: 'approve' | 'reject' | 'flag') => {
    try {
      await videoContentService.moderateVideo(videoId, { action });
      await loadVideos(); // Reload data
    } catch (error) {
      console.error('Failed to moderate video:', error);
    }
  };

  // Handle video deletion
  const handleDelete = async (videoId: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await videoContentService.deleteVideo(videoId);
        await loadVideos(); // Reload data
      } catch (error) {
        console.error('Failed to delete video:', error);
      }
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: 'approve' | 'reject' | 'flag') => {
    if (selectedRowKeys.length === 0) return;
    
    try {
      await videoContentService.bulkModerate(
        selectedRowKeys.map(key => key.toString()),
        { action }
      );
      setSelectedRowKeys([]);
      await loadVideos();
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
    }
  };

  // Format duration
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  // Get status badge color
  const getStatusColor = (status: VideoStatus): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      case 'removed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Table columns configuration - need to map to DataTable format
  const dataTableColumns = [
    {
      key: 'title',
      title: 'Video',
      render: (_: any, video: VideoTableData) => (
        <div className="flex items-center space-x-3">
          <div className="relative w-16 h-12 bg-gray-200 rounded overflow-hidden">
            {video.thumbnailUrl ? (
              <img 
                src={video.thumbnailUrl} 
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <VideoCameraIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
              {formatDuration(video.duration)}
            </div>
          </div>
          <div>
            <Typography variant="body2" className="font-medium text-gray-900">
              {video.title}
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              {video.sport} • {video.category}
            </Typography>
          </div>
        </div>
      )
    },
    {
      key: 'uploadedBy',
      title: 'Uploaded By',
      render: (value: any) => (
        <Typography variant="body2" className="text-gray-900">
          {value}
        </Typography>
      )
    },
    {
      key: 'uploadDate',
      title: 'Upload Date',
      render: (value: any) => (
        <Typography variant="body2" className="text-gray-600">
          {new Date(value).toLocaleDateString()}
        </Typography>
      )
    },
    {
      key: 'viewCount',
      title: 'Views',
      render: (value: any) => (
        <div className="flex items-center space-x-1">
          <EyeIcon className="w-4 h-4 text-gray-400" />
          <Typography variant="body2" className="text-gray-900">
            {value.toLocaleString()}
          </Typography>
        </div>
      )
    },
    {
      key: 'fileSize',
      title: 'Size',
      render: (value: any) => (
        <Typography variant="body2" className="text-gray-600">
          {formatFileSize(value)}
        </Typography>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'id',
      title: 'Actions',
      render: (_: any, video: VideoTableData) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(video.videoUrl, '_blank')}
            className="text-blue-600 hover:text-blue-800"
          >
            <PlayIcon className="w-4 h-4" />
          </Button>
          
          {video.status === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleModeration(video.id, 'approve')}
                className="text-green-600 hover:text-green-800"
              >
                <CheckCircleIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleModeration(video.id, 'reject')}
                className="text-red-600 hover:text-red-800"
              >
                <XCircleIcon className="w-4 h-4" />
              </Button>
            </>
          )}
          
          {video.status !== 'flagged' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleModeration(video.id, 'flag')}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <ExclamationTriangleIcon className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(video.id)}
            className="text-red-600 hover:text-red-800"
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1" className="text-gray-900">
            Video Management
          </Typography>
          <Typography variant="body1" className="text-gray-600 mt-1">
            Manage and moderate video content across all sports
          </Typography>
        </div>
      </div>

      <FilterBar>
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="flagged">Flagged</option>
            <option value="removed">Removed</option>
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="tutorial">Tutorial</option>
            <option value="workout">Workout</option>
            <option value="technique">Technique</option>
            <option value="match">Match</option>
            <option value="training">Training</option>
          </select>
        </div>
      </FilterBar>

      <Card>
        {selectedRowKeys.length > 0 && (
          <div className="p-4 bg-blue-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Typography variant="body2" className="text-blue-900">
                {selectedRowKeys.length} video(s) selected
              </Typography>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('approve')}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('reject')}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <XCircleIcon className="w-4 h-4 mr-1" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('flag')}
                  className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                >
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  Flag
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <DataTable
          data={videos}
          columns={dataTableColumns}
          loading={loading}
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
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys
          }}
        />
      </Card>
    </div>
  );
};

export default VideoManagementPage;
