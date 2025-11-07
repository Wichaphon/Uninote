import { useEffect, useState, Fragment, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSheetStore from '../store/useSheetStore';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { Listbox, Transition } from '@headlessui/react';
import { 
  CheckIcon, 
  ChevronUpDownIcon, 
  ArrowUpTrayIcon,
  DocumentIcon,
  XCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const yearOptions = [
  { value: '1', label: 'Year 1' },
  { value: '2', label: 'Year 2' },
  { value: '3', label: 'Year 3' },
  { value: '4', label: 'Year 4' },
];

const facultyOptions = [
  { value: 'Science', label: 'Science' },
];

const departmentOptions = [
  { value: 'Computer Science', label: 'Computer Science' },
];

const universityOptions = [
  { value: "King Mongkut's Institute of Technology Ladkrabang", label: "KMITL" },
];

const getLabel = (options, value) => {
  return options.find((opt) => opt.value === value)?.label || '';
};

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;


function EditSheetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentSheet, isLoading, fetchSheetById, updateSheet } = useSheetStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    year: '',
    faculty: '',
    department: '',
    university: '',
    price: '',
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSheetById(id);
    }
  }, [id, fetchSheetById]);

  useEffect(() => {
    if (currentSheet) {
      if (currentSheet.sellerId !== user?.id && user?.role !== 'ADMIN') {
        toast.error('You do not have permission to edit this sheet');
        navigate('/seller');
        return;
      }

      setFormData({
        title: currentSheet.title || '',
        description: currentSheet.description || '',
        subject: currentSheet.subject || '',
        year: currentSheet.year?.toString() || '',
        faculty: currentSheet.faculty || '',
        department: currentSheet.department || '',
        university: currentSheet.university || '',
        price: currentSheet.price?.toString() || '',
      });
    }
  }, [currentSheet, user, navigate]);

  const handleChange = useCallback((key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (validationErrors[key]) {
      setValidationErrors(prev => ({ ...prev, [key]: null }));
    }
  }, [validationErrors]);

  const handleFileChange = useCallback((file) => {
     if (!file) return;

     if (file.type !== 'application/pdf') {
       toast.error('Please upload a valid PDF file');
       return;
     }

     if (file.size > MAX_FILE_SIZE_BYTES) {
       toast.error(`File is too large! Max size is ${MAX_FILE_SIZE_MB}MB`);
       return;
     }

     setPdfFile(file);
     setError('');
     if (validationErrors.pdfFile) {
       setValidationErrors(prev => ({ ...prev, pdfFile: null }));
     }
  }, [validationErrors]);

  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files[0]);
  }, [handleFileChange]);

  const handleFileSelect = useCallback((e) => {
    handleFileChange(e.target.files[0]);
    e.target.value = null;
  }, [handleFileChange]);

  const handleRemoveFile = useCallback((e) => {
    e.stopPropagation();
    setPdfFile(null);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.faculty) newErrors.faculty = 'Faculty is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.university) newErrors.university = 'University is required';
    if (!formData.price.trim() || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      setError('Please fill in all required fields.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    if (pdfFile) {
      data.append('pdf', pdfFile);
    }

    try {
      await updateSheet(id, data);
      toast.success('Sheet updated successfully!');
      navigate('/seller');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Update failed';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !currentSheet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading sheet..." />
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Updating sheet..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <button
            onClick={() => navigate('/seller')}
            className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center gap-2 font-medium transition-colors cursor-pointer"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Edit Sheet</h1>
          <p className="text-lg text-gray-600 mt-2">Update your sheet information</p>
        </div>

        <div className={`bg-white rounded-xl shadow-xl border border-gray-100 p-6 md:p-8 ${shake ? 'animate-shake' : ''}`}>
          {error && !shake && (
            <div className="bg-red-100 text-red-700 font-medium p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block font-medium mb-1 text-gray-700">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none transition-all ${
                  validationErrors.title 
                    ? 'border-red-500 ring-2 ring-red-200' 
                    : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                maxLength={200}
              />
              {validationErrors.title && <p className="mt-1 text-sm text-red-600 font-medium">{validationErrors.title}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Description <span className="text-red-500">*</span></label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none transition-all ${
                  validationErrors.description 
                    ? 'border-red-500 ring-2 ring-red-200' 
                    : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                rows="4"
                maxLength={2000}
              />
              {validationErrors.description && <p className="mt-1 text-sm text-red-600 font-medium">{validationErrors.description}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Subject <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none transition-all ${
                  validationErrors.subject 
                    ? 'border-red-500 ring-2 ring-red-200' 
                    : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                maxLength={100}
              />
              {validationErrors.subject && <p className="mt-1 text-sm text-red-600 font-medium">{validationErrors.subject}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1 text-gray-700">Year <span className="text-red-500">*</span></label>
                <Listbox value={formData.year} onChange={(val) => handleChange('year', val)}>
                  <div className="relative">
                    <Listbox.Button className={`relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm hover:border-gray-400 ${
                      validationErrors.year ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <span className={`block truncate ${formData.year ? 'text-gray-900' : 'text-gray-400'}`}>
                        {getLabel(yearOptions, formData.year) || 'Select Year'}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-20">
                        {yearOptions.map((option) => (
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
              </div>
              <div>
                <label className="block font-medium mb-1 text-gray-700">Faculty <span className="text-red-500">*</span></label>
                <Listbox value={formData.faculty} onChange={(val) => handleChange('faculty', val)}>
                  <div className="relative">
                    <Listbox.Button className={`relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm hover:border-gray-400 ${
                      validationErrors.faculty ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <span className={`block truncate ${formData.faculty ? 'text-gray-900' : 'text-gray-400'}`}>
                        {getLabel(facultyOptions, formData.faculty) || 'Select Faculty'}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-20">
                        {facultyOptions.map((option) => (
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
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1 text-gray-700">Department <span className="text-red-500">*</span></label>
                <Listbox value={formData.department} onChange={(val) => handleChange('department', val)}>
                  <div className="relative">
                    <Listbox.Button className={`relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm hover:border-gray-400 ${
                      validationErrors.department ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <span className={`block truncate ${formData.department ? 'text-gray-900' : 'text-gray-400'}`}>
                        {getLabel(departmentOptions, formData.department) || 'Select Department'}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-20">
                        {departmentOptions.map((option) => (
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
              </div>
              <div>
                <label className="block font-medium mb-1 text-gray-700">University <span className="text-red-500">*</span></label>
                <Listbox value={formData.university} onChange={(val) => handleChange('university', val)}>
                  <div className="relative">
                    <Listbox.Button className={`relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm hover:border-gray-400 ${
                      validationErrors.university ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <span className={`block truncate ${formData.university ? 'text-gray-900' : 'text-gray-400'}`}>
                        {getLabel(universityOptions, formData.university) || 'Select University'}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-20">
                        {universityOptions.map((option) => (
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
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Price (THB) <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none transition-all ${
                  validationErrors.price 
                    ? 'border-red-500 ring-2 ring-red-200' 
                    : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                min="0"
                step="0.01"
                max="999999.99"
              />
              {validationErrors.price && <p className="mt-1 text-sm text-red-600 font-medium">{validationErrors.price}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Replace PDF File (Optional - Max {MAX_FILE_SIZE_MB}MB)</label>
              <div
                className={`w-full border-2 rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragging 
                    ? 'border-indigo-500 bg-indigo-50 scale-105' 
                    : 'border-dashed border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleFileDrop}
                onClick={() => document.getElementById('fileInput').click()}
              >
                {!pdfFile ? (
                  <div className="flex flex-col items-center">
                    <ArrowUpTrayIcon className={`w-10 h-10 mb-2 transition-colors ${isDragging ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <p className="font-medium text-gray-600">
                      {isDragging ? 'Release to upload new PDF' : 'Drag & drop to replace PDF'}
                    </p>
                    <p className="text-sm text-gray-400">or click to browse</p>
                    <input
                      id="fileInput"
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                      <DocumentIcon className="w-8 h-8 text-indigo-500 shrink-0" />
                      <div>
                        <p className="text-gray-800 font-medium">{pdfFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-red-500 hover:text-red-700 hover:scale-110 p-1 rounded-full transition-all cursor-pointer"
                      title="Remove file"
                    >
                      <XCircleIcon className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to keep current PDF: <strong>{currentSheet.pdfFilename}</strong>
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/seller')}
                className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300 font-medium transition-colors cursor-pointer w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/30 cursor-pointer"
              >
                Update Sheet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditSheetPage;