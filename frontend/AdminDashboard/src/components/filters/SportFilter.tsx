import React from 'react';
import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { cn } from '../../utils/cn';
import { SPORTS_CATEGORIES } from '../../utils/constants';

interface SportFilterProps {
  selectedSports: string[];
  onSportsChange: (sports: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const SportFilter: React.FC<SportFilterProps> = ({
  selectedSports,
  onSportsChange,
  placeholder = "All Sports",
  className
}) => {
  const handleSportToggle = (sport: string) => {
    if (selectedSports.includes(sport)) {
      onSportsChange(selectedSports.filter(s => s !== sport));
    } else {
      onSportsChange([...selectedSports, sport]);
    }
  };

  const displayText = selectedSports.length === 0 
    ? placeholder 
    : selectedSports.length === 1 
      ? selectedSports[0]
      : `${selectedSports.length} sports selected`;

  return (
    <div className={cn("relative", className)}>
      <Listbox value={selectedSports} onChange={onSportsChange} multiple>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm">
            <span className="block truncate">{displayText}</span>
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
              {/* Clear All Option */}
              <div className="px-3 py-2 border-b border-neutral-100">
                <button
                  type="button"
                  onClick={() => onSportsChange([])}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              </div>
              
              {SPORTS_CATEGORIES.map((sport) => (
                <Listbox.Option
                  key={sport}
                  className={({ active }) =>
                    cn(
                      'relative cursor-pointer select-none py-2 pl-10 pr-4',
                      active ? 'bg-primary-50 text-primary-900' : 'text-neutral-900'
                    )
                  }
                  value={sport}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSportToggle(sport);
                  }}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={cn(
                          'block truncate',
                          selected ? 'font-medium' : 'font-normal'
                        )}
                      >
                        {sport}
                      </span>
                      {selectedSports.includes(sport) ? (
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
    </div>
  );
};