import type { VideoContent, PaginationInfo } from '../types';

export interface VideoFilters {
    page?: number;
    limit?: number;
    search?: string;
    sport?: string;
    status?: string;
    category?: string;
}

export interface VideoListResponse {
    videos: VideoContent[];
    total: number;
    pagination: PaginationInfo;
}

export interface VideoModerationRequest {
    action: 'approve' | 'reject' | 'flag' | 'unflag';
    reason?: string;
}

class VideoContentService {
    private baseUrl = '/api/v1/admin/videos';

    async getVideos(filters: VideoFilters = {}): Promise<VideoListResponse> {
        const params = new URLSearchParams();

        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.search) params.append('search', filters.search);
        if (filters.sport) params.append('sport', filters.sport);
        if (filters.status) params.append('status', filters.status);
        if (filters.category) params.append('category', filters.category);

        const response = await fetch(`${this.baseUrl}?${params}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch videos');
        }

        return response.json();
    }

    async getVideo(id: string): Promise<VideoContent> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch video');
        }

        return response.json();
    }

    async moderateVideo(id: string, moderation: VideoModerationRequest): Promise<VideoContent> {
        const response = await fetch(`${this.baseUrl}/${id}/moderate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(moderation),
        });

        if (!response.ok) {
            throw new Error('Failed to moderate video');
        }

        return response.json();
    }

    async deleteVideo(id: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete video');
        }
    }

    async bulkModerate(videoIds: string[], moderation: VideoModerationRequest): Promise<void> {
        const response = await fetch(`${this.baseUrl}/bulk-moderate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                video_ids: videoIds.map(id => parseInt(id)),
                action: moderation.action,
                reason: moderation.reason,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to bulk moderate videos');
        }
    }
}

export const videoContentService = new VideoContentService();