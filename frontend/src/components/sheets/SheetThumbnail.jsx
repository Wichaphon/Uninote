import { useState, useEffect } from 'react';
import { generateCoverData } from '../../lib/coverGenerator';

function SheetThumbnail({ sheet, className = '' }) {
  const [coverData, setCoverData] = useState(null);

  useEffect(() => {
    const data = generateCoverData(sheet.title);
    setCoverData(data);
  }, [sheet.title]);

  if (!coverData) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`}></div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
    >
      {/*Background Gradient*/}
      <div className={`absolute inset-0 bg-linear-to-br ${coverData.gradient}`}></div>
      
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
      <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-white opacity-10 rounded-full"></div>
      <div className="absolute top-1/2 right-0 w-32 h-32 bg-white opacity-10 rounded-full"></div>
      
      <div className="relative h-full flex flex-col items-center justify-center p-6 text-white">
        
        {/*Subject*/}
        <h3 className="text-2xl font-bold text-center drop-shadow-lg">
          {sheet.subject || 'General'}
        </h3>
        
      </div>

      {/*Watermark*/}
      <div className="absolute bottom-0 left-0 right-0 py-3 px-4">
        <div className="flex items-center justify-center gap-2 text-white/90 text-xs">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
          <span className="font-medium">UniNote</span>
        </div>
      </div>
    </div>
  );
}

export default SheetThumbnail;