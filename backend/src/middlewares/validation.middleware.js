export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validateSellerApplication = (req, res, next) => {
  const { shopName, description, bankAccount } = req.body;
  const errors = [];

  //ShopName Validation
  if (!shopName || shopName.trim().length === 0) {
    errors.push('Shop name is required.');
  } 
  
  else if (shopName.trim().length < 3) {
    errors.push('Shop name must be at least 3 characters.');
  } 
  
  else if (shopName.trim().length > 100) {
    errors.push('Shop name must not exceed 100 characters.');
  }

  //Description Validation 
  if (description && description.trim().length > 500) {
    errors.push('Description must not exceed 500 characters.');
  }

  //Bank Account Validation 
  if (bankAccount && bankAccount.trim().length > 50) {
    errors.push('Bank account must not exceed 50 characters.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateSheetCreation = (req, res, next) => {
  const { title, description, subject, price } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required.');
  } 
  else if (title.length > 200) {
    errors.push('Title must not exceed 200 characters.');
  }

  if (!description || description.trim().length === 0) {
    errors.push('Description is required.');
  } 
  else if (description.length > 2000) {
    errors.push('Description must not exceed 2000 characters.');
  }

  if (!subject || subject.trim().length === 0) {
    errors.push('Subject is required.');
  } 
  else if (subject.length > 100) {
    errors.push('Subject must not exceed 100 characters.');
  }

  if (!price) {
    errors.push('Price is required.');
  } 
  else if (isNaN(price) || parseFloat(price) < 0) {
    errors.push('Price must be a number greater than or equal to 0.');
  } 
  else if (parseFloat(price) > 999999.99) {
    errors.push('Price must not exceed 999,999.99.');
  }

  //PDF validation
  if (!req.file) {
    errors.push('PDF file is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateSheetUpdate = (req, res, next) => {
  const { title, description, subject, price } = req.body;
  const errors = [];

  if (title !== undefined) {
    if (title.trim().length === 0) {
      errors.push('Title cannot be empty.');
    } 
    
    else if (title.length > 200) {
      errors.push('Title must not exceed 200 characters.');
    }
  }

  if (description !== undefined) {
    if (description.trim().length === 0) {
      errors.push('Description cannot be empty.');
    } 
    
    else if (description.length > 2000) {
      errors.push('Description must not exceed 2000 characters.');
    }
  }

  if (subject !== undefined) {
    if (subject.trim().length === 0) {
      errors.push('Subject cannot be empty.');
    } 
    
    else if (subject.length > 100) {
      errors.push('Subject must not exceed 100 characters.');
    }
  }

  if (price !== undefined) {
    if (isNaN(price) || parseFloat(price) < 0) {
      errors.push('Price must be a number greater than or equal to 0.');
    } 
    
    else if (parseFloat(price) > 999999.99) {
      errors.push('Price must not exceed 999,999.99.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return res.status(400).json({ error: 'Page must be a number greater than 0.' });
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json({ error: 'Limit must be a number between 1 and 100.' });
  }

  next();
};