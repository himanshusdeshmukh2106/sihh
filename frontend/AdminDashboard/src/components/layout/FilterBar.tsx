import React from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button, Input } from '../ui';
import { SportFilter } from '../filters/SportFilter';
import { DateRangeFilter } from '../filters/DateRangeFilter';
import { useFilters } from '../../contexts/FilterContext';
import { cn } from '../../utils/cn';

interface FilterBarProps {
  showSportFilter?: boolean;
  showDateFilter?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  showSportFilter = true,
  showDateFilter = true,
  showSearch = true,
  searchPlaceholder = "Search...",
  className
}) => {
  const {
    selectedSports,
    setSports,
    dateRange,
    dateRangePreset,
    setDateRangePreset,
    setDateRange,
    searchQuery,
    setSearchQuery,
    resetFilters,
    hasActiveFilters
  } = useFilters();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={cn("bg-white border-b border-neutral-200 p-4", className)}>
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Left side - Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {showSearch && (
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
                className="pl-10"
              />
            </div>
          )}
          
          <div className="flex gap-3">
            {showSportFilter && (
              <SportFilter
                selectedSports={selectedSports}
                onSportsChange={setSports}
                className="w-48"
              />
            )}
            
            {showDateFilter && (
              <DateRangeFilter
                selectedRange={dateRangePreset}
                onRangeChange={setDateRangePreset}
                customRange={dateRange}
                onCustomRangeChange={setDateRange}
                className="w-48"
              />
            )}
          </div>
        </div>

        {/* Right side - Clear filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            leftIcon={<XMarkIcon className="w-4 h-4" />}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedSports.map((sport) => (
            <span
              key={sport}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {sport}
              <button
                type="button"
                onClick={() => setSports(selectedSports.filter(s => s !== sport))}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          
          {searchQuery && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
              Search: "{searchQuery}"
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-neutral-200"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};