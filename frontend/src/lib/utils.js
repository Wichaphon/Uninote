export const formatPrice = (price) => {
  if (!price && price !== 0) return '฿0.00';
  return `฿${parseFloat(price).toFixed(2)}`;
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatRating = (rating) => {
  if (rating === null || rating === undefined || isNaN(rating)) {
    return '0.0';
  }
  return parseFloat(rating).toFixed(1);
};

export const handleError = (error) => {
  console.error('API Error:', error);

  if (error.response) {
    const data = error.response.data;

    if (data?.errors && Array.isArray(data.errors)) {
      return data.errors.map((err) => err.msg || err.message).join(', ');
    }
    if (data?.error) {
      return data.error;
    }
    
    if (data?.message) {
      return data.message;
    }
    if (typeof data === 'string') {
      return data;
    }
    return `Server error (${error.response.status})`;

  } else if (error.request) {
    return 'Network error or server is not responding';
  } else {
    return error.message || 'An unknown error occurred';
  }
};

//Truncate text
export const truncate = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));