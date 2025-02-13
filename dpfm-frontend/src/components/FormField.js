import React from 'react';
import PropTypes from 'prop-types';
import { TextField, FormHelperText } from '@mui/material';

function FormField({ error, ...props }) {
  return (
    <>
      <TextField
        error={Boolean(error)}
        {...props}
        fullWidth
        margin="normal"
      />
      {error && (
        <FormHelperText error>
          {error}
        </FormHelperText>
      )}
    </>
  );
}

FormField.propTypes = {
  error: PropTypes.string,
};

export default FormField;