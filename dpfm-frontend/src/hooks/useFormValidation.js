import { useState, useEffect } from 'react';

export const useFormValidation = (initialState) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'amount':
        if (!value) return 'Amount is required';
        if (isNaN(value) || value <= 0) return 'Amount must be positive';
        return '';
      case 'category':
        if (!value) return 'Category is required';
        if (value.length < 2) return 'Category too short';
        return '';
      case 'description':
        if (value && value.length > 200) return 'Description too long';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  useEffect(() => {
    const isFormValid = !Object.values(errors).some(error => error) &&
      values.amount && values.category;
    setIsValid(isFormValid);
    
    // Persist form state
    localStorage.setItem('formState', JSON.stringify(values));
  }, [values, errors]);

  // Load persisted state
  useEffect(() => {
    const savedState = localStorage.getItem('formState');
    if (savedState) {
      setValues(JSON.parse(savedState));
    }
  }, []);

  return {
    values,
    errors,
    isValid,
    handleChange,
    setValues,
    setErrors
  };
};