import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Box } from '@mui/material';

function FormValidation({ errors }) {
  if (!errors || Object.keys(errors).length === 0) return null;

  return (
    <Box sx={{ mt: 2 }}>
      {Object.entries(errors).map(([field, error]) => (
        <Alert key={field} severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      ))}
    </Box>
  );
}

FormValidation.propTypes = {
  errors: PropTypes.object
};

export default FormValidation;