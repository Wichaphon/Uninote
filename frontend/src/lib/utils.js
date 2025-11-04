export const formatPrice = (price) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  }).format(price);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatRating = (rating) => {
  return rating ? rating.toFixed(1) : 'N/A';
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

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));