import { useState, Fragment } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { Listbox, Transition } from '@headlessui/react';

const sortOptions = [
  { value: 'createdAt', label: 'Date Added' },
  { value: 'price', label: 'Price' },
  { value: 'purchaseCount', label: 'Best Selling' },
  { value: 'averageRating', label: 'Highest Rated' },
];

const orderOptions = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
];

function SheetFilters({ filters = {}, onFilterChange = () => {}, onSearch = () => {} }) {
  const defaultFilters = {
    search: '',
    subject: '',
    university: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    order: 'desc',
  };
  const [localFilters, setLocalFilters] = useState({ ...defaultFilters, ...filters });
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
    onSearch();
  };

  const handleReset = () => {
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
    onSearch();
  };

  const getLabel = (options, value) => {
    return options.find((opt) => opt.value === value)?.label || '';
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search sheets..."
            value={localFilters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-9 pr-2.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
          />
        </div>
        
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer text-sm whitespace-nowrap shadow-sm"
        >
          <MagnifyingGlassIcon className="w-3.5 h-3.5" />
          Search
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 transition-all flex items-center gap-1.5 cursor-pointer text-sm whitespace-nowrap"
        >
          <XMarkIcon className="w-3.5 h-3.5" />
          Reset
        </button>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-1.5 cursor-pointer text-sm whitespace-nowrap"
        >
          <FunnelIcon className="w-3.5 h-3.5" />
          Filters
          {showFilters ? <ChevronDownIcon className="w-3 h-3" /> : <ChevronUpDownIcon className="w-3 h-3" />}
        </button>
      </div>

      <div 
        className={`transition-all duration-300 ease-in-out ${showFilters ? 'max-h-96 opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'}`}
      >
        <div className="space-y-3 pt-3 mt-3 border-t border-gray-200">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2 text-xs">Filter Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Subject (e.g., Math)"
                value={localFilters.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                className="px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              />
              <input
                type="text"
                placeholder="University"
                value={localFilters.university}
                onChange={(e) => handleChange('university', e.target.value)}
                className="px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              />
              <input
                type="number"
                placeholder="Min Price (฿)"
                value={localFilters.minPrice}
                onChange={(e) => handleChange('minPrice', e.target.value)}
                className="px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                min="0"
              />
              <input
                type="number"
                placeholder="Max Price (฿)"
                value={localFilters.maxPrice}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
                className="px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                min="0"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2 text-xs">Sort Options</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              
              <Listbox value={localFilters.sortBy} onChange={(val) => handleChange('sortBy', val)}>
                <div className="relative flex-1">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-1.5 px-2.5 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm hover:border-gray-400">
                    <span className="block truncate">{getLabel(sortOptions, localFilters.sortBy)}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                      {sortOptions.map((option) => (
                        <Listbox.Option
                          key={option.value}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'}`
                          }
                          value={option.value}
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                {option.label}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
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

              <Listbox value={localFilters.order} onChange={(val) => handleChange('order', val)}>
                <div className="relative flex-1">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-1.5 px-2.5 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm hover:border-gray-400">
                    <span className="block truncate">{getLabel(orderOptions, localFilters.order)}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                      {orderOptions.map((option) => (
                        <Listbox.Option
                          key={option.value}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'}`
                          }
                          value={option.value}
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                {option.label}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
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
          </div>
        </div>
      </div>
    </form>
  );
}

export default SheetFilters;