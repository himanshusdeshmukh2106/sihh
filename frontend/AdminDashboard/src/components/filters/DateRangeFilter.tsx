import React from 'react';
import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, CalendarIcon } from '@heroicons/react/20/solid';
import { cn } from '../../utils/cn';
import { DATE_RANGE_PRESETS } from '../../utils/constants';
import type { DateRange } from '../../types';

interface DateRangeFilterProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
  customRange?: DateRange;
  onCustomRangeChange?: (range: DateRange) => void;
  className?: string;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  selectedRange,
  onRangeChange,
  customRange,
  onCustomRangeChange,
  className
}) => {
  const selectedPreset = DATE_RANGE_PRESETS.find(preset => preset.value === selectedRange);
  const displayText = selectedPreset?.label || 'Select date range';

  return (
    <div className={cn("relative", className)}>
      <Listbox value={selectedRange} onChange={onRangeChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 text-neutral-400 mr-2" />
              <span className="block truncate">{displayText}</span>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-neutral-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {DATE_RANGE_PRESETS.map((preset) => (
                <Listbox.Option
                  key={preset.value}
                  className={({ active }) =>
                    cn(
                      'relative cursor-pointer select-none py-2 pl-10 pr-4',
                      active ? 'bg-primary-50 text-primary-900' : 'text-neutral-900'
                    )
                  }
                  value={preset.value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={cn(
                          'block truncate',
                          selected ? 'font-medium' : 'font-normal'
                        )}
                      >
                        {preset.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      
      {/* Custom date range inputs - would be shown when 'custom' is selected */}
      {selectedRange === 'custom' && onCustomRangeChange && (
        <div className="mt-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-2 py-1 text-sm border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={customRange?.start.toISOString().split('T')[0] || ''}
                onChange={(e) => {
                  if (customRange && onCustomRangeChange) {
                    onCustomRangeChange({
                      ...customRange,
                      start: new Date(e.target.value)
                    });
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full px-2 py-1 text-sm border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={customRange?.end.toISOString().split('T')[0] || ''}
                onChange={(e) => {
                  if (customRange && onCustomRangeChange) {
                    onCustomRangeChange({
                      ...customRange,
                      end: new Date(e.target.value)
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};