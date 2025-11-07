import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import workerSrc from 'react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs?url';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  LockClosedIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const pageVariants = {
  initial: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 30 : -30
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 260, damping: 30 }
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -30 : 30,
    transition: { duration: 0.15 }
  })
};

function SheetPreview({ 
  fileUrl, 
  maxPages: ignoredMaxPagesProp,
  className = '', 
  isPurchased = false 
}) {
  
  const maxPages = 2;

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [direction, setDirection] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error) {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF preview');
    setLoading(false);
  }

  const maxPagesToShow = isPurchased ? numPages : Math.min(maxPages, numPages || maxPages);

  const handlePrev = () => {
    setDirection(-1);
    setPageNumber(Math.max(1, pageNumber - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setPageNumber(Math.min(numPages, pageNumber + 1));
  };

  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      
      <div className="bg-gray-100 border rounded-lg overflow-hidden relative">
        {loading && (
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner text="Loading preview..." />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-red-600 font-semibold">{error}</p>
              <p className="text-sm text-gray-500 mt-2">
                Please try again later
              </p>
            </div>
          </div>
        )}

        {!error && (
          <div className="aspect-210/297 flex items-center justify-center">
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading=""
              className="flex justify-center"
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={pageNumber}
                  custom={direction}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Page
                    pageNumber={pageNumber}
                    width={Math.min(800, window.innerWidth - 100)}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="shadow-lg"
                    loading=""
                  />
                </motion.div>
              </AnimatePresence>
            </Document>
          </div>
        )}
      </div>

      {!loading && !error && numPages > 0 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePrev}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Previous
          </button>

          <div className="text-sm text-gray-600">
            Page {pageNumber} of {numPages}
          </div>

          <button
            onClick={handleNext}
            disabled={pageNumber >= maxPagesToShow}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
          >
            Next
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {!isPurchased && !loading && !error && numPages > maxPagesToShow && (
        <div className="mt-4 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-center shadow-lg">
          <div className="flex justify-center items-center gap-3">
            <LockClosedIcon className="w-6 h-6 text-white/80" />
            <p className="text-white font-semibold text-lg">
              Want to see all {numPages} pages?
            </p>
          </div>
          <p className="text-sm text-indigo-100 mt-2">
            Purchase this sheet to access the full content.
          </p>
        </div>
      )}
    </div>
  );
}

export default SheetPreview;