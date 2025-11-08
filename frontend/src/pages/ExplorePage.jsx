import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useSheetStore from '../store/useSheetStore';
import SheetList from '../components/sheets/SheetList';
import SheetFilters from '../components/sheets/SheetFilters';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

function ExplorePage() {
  const [searchParams] = useSearchParams();
  const { sheets, pagination, filters, isLoading, error, fetchSheets, setFilters } = useSheetStore();

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    const subject = searchParams.get('subject');
    
    if (searchQuery || subject) {
      const newFilters = { ...filters };
      if (searchQuery) newFilters.search = searchQuery;
      if (subject) newFilters.subject = subject;
      
      setFilters(newFilters);
      fetchSheets(newFilters);
    } else {
      fetchSheets({ page: 1 });
    }
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    fetchSheets({ page: 1 });
  };

  const handlePageChange = (page) => {
    fetchSheets({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-indigo-50">
      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">Explore Study Sheets</h1>
          <p className="text-lg text-blue-100">
            Discover quality study materials from top students
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <SheetFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {!isLoading && pagination && (
          <div className="mb-6 text-gray-700 bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-200">
            <span className="font-medium">
              Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of <span className="text-indigo-600 font-bold">{pagination.total}</span> results
            </span>
            {filters?.search && (
              <span className="ml-2 text-gray-600">
                for "<strong className="text-gray-900">{filters.search}</strong>"
              </span>
            )}
          </div>
        )}

        {/* Sheet List */}
        <SheetList sheets={sheets} isLoading={isLoading} error={error} />

        {/*Pagination*/}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 mb-8">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-indigo-300 transition-all font-medium text-gray-700 flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeftIcon className="w-5 h-5" />
              Previous
            </button>

            {/*Page Num*/}
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
                    onClick={() => handlePageChange(page)}
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
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-indigo-300 transition-all font-medium text-gray-700 flex items-center gap-2 cursor-pointer"
            >
              Next
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExplorePage;