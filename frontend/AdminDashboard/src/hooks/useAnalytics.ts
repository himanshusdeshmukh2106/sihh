import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';
import { useFilters } from '../contexts/FilterContext';

// Query keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  users: (params?: any) => [...analyticsKeys.all, 'users', params] as const,
  sports: (params?: any) => [...analyticsKeys.all, 'sports', params] as const,
  engagement: (params?: any) => [...analyticsKeys.all, 'engagement', params] as const,
  system: () => [...analyticsKeys.all, 'system'] as const,
  summary: (params?: any) => [...analyticsKeys.all, 'summary', params] as const,
};

// Helper function to convert date range to dates
const getDateRangeParams = (dateRange: string, customDateRange?: any) => {
  const now = new Date();
  let startDate: Date;
  let endDate = now;

  switch (dateRange) {
    case 'last7days':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'last30days':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'last3months':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'last6months':
      startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      break;
    case 'lastyear':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    case 'custom':
      if (customDateRange) {
        startDate = customDateRange.start;
        endDate = customDateRange.end;
      } else {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};

export const useUserAnalytics = () => {
  const { selectedSports, dateRange, customDateRange } = useFilters();
  
  const params = {
    ...getDateRangeParams(dateRange, customDateRange),
    sports: selectedSports.length > 0 ? selectedSports : undefined,
  };

  return useQuery({
    queryKey: analyticsKeys.users(params),
    queryFn: () => analyticsService.getUserAnalytics(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSportAnalytics = () => {
  const { dateRange, customDateRange } = useFilters();
  
  const params = getDateRangeParams(dateRange, customDateRange);

  return useQuery({
    queryKey: analyticsKeys.sports(params),
    queryFn: () => analyticsService.getSportAnalytics(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useEngagementMetrics = () => {
  const { dateRange, customDateRange } = useFilters();
  
  const params = getDateRangeParams(dateRange, customDateRange);

  return useQuery({
    queryKey: analyticsKeys.engagement(params),
    queryFn: () => analyticsService.getEngagementMetrics(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSystemAnalytics = () => {
  return useQuery({
    queryKey: analyticsKeys.system(),
    queryFn: () => analyticsService.getSystemAnalytics(),
    staleTime: 1000 * 60 * 2, // 2 minutes (more frequent for system metrics)
    refetchInterval: 1000 * 60 * 2, // Auto-refresh every 2 minutes
  });
};

export const useAnalyticsSummary = () => {
  const { selectedSports, dateRange, customDateRange } = useFilters();
  
  const params = {
    ...getDateRangeParams(dateRange, customDateRange),
    sports: selectedSports.length > 0 ? selectedSports : undefined,
  };

  return useQuery({
    queryKey: analyticsKeys.summary(params),
    queryFn: () => analyticsService.getAnalyticsSummary(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};