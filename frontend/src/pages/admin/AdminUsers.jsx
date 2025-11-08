import { useEffect, useState, Fragment } from 'react';
import { adminService } from '../../services/adminService';
import UserManagement from '../../components/admin/UserManagement';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Listbox, Transition } from '@headlessui/react';
import { 
  CheckIcon, 
  ChevronUpDownIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

const roleOptions = [
  { value: '', label: 'All Roles' },
  { value: 'USER', label: 'User' },
  { value: 'SELLER', label: 'Seller' },
  { value: 'ADMIN', label: 'Admin' },
];

const getLabel = (options, value) => {
  return options.find((opt) => opt.value === value)?.label || 'All Roles';
};

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ page: 1, limit: 20, search: '', role: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (customFilters = {}) => {
    setIsLoading(true);
    try {
      const params = { ...filters, ...customFilters };
      const data = await adminService.getAllUsers(params);
      setUsers(data.users);
      setPagination(data.pagination);
      setFilters(params);
    } catch (err) {
      console.error('Load users error:', err);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await adminService.toggleUserStatus(userId);
      toast.success('User status updated!');
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Toggle failed');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers({ page: 1 });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by email, name..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        
        <Listbox 
          value={filters.role} 
          onChange={(val) => setFilters({ ...filters, role: val })}
        >
          <div className="relative w-full md:w-48">
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2.5 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm hover:border-gray-400">
              <span className="block truncate">{getLabel(roleOptions, filters.role)}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                {roleOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'}`}
                    value={option.value}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{option.label}</span>
                        {selected ? <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600"><CheckIcon className="h-5 w-5" aria-hidden="true" /></span> : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>

        <button 
          type="submit" 
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-lg shadow-indigo-500/30 cursor-pointer"
        >
          Search
        </button>
      </form>

      <UserManagement
        users={users}
        isLoading={isLoading}
        onToggleStatus={handleToggleStatus}
      />

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 mb-8">
          <button
            onClick={() => loadUsers({ page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-indigo-300 transition-all font-medium text-gray-700 flex items-center gap-2 cursor-pointer"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
              let page;
              if (pagination.totalPages <= 7) {
                page = i + 1;
              } else if (pagination.page <= 4) {
                page = i + 1;
              } else if (pagination.page >= pagination.totalPages - 3) {
                page = pagination.totalPages - 6 + i;
              } else {
                page = pagination.page - 3 + i;
              }

              return (
                <button
                  key={page}
                  onClick={() => loadUsers({ page })}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                    page === pagination.page
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-indigo-300'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => loadUsers({ page: pagination.page + 1 })}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-indigo-300 transition-all font-medium text-gray-700 flex items-center gap-2 cursor-pointer"
          >
            Next
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;