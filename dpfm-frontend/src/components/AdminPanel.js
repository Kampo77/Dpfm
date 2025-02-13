import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  Alert
} from '@mui/material';
import { ethers } from 'ethers';

function AdminPanel({ contract, isOwner }) {
  const [newUserAddress, setNewUserAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddUser = async () => {
    try {
      if (!ethers.utils.isAddress(newUserAddress)) {
        throw new Error('Invalid Ethereum address');
      }

      const tx = await contract.addAuthorizedUser(newUserAddress);
      await tx.wait();
      
      setSuccess(`Successfully authorized user: ${newUserAddress}`);
      setNewUserAddress('');
    } catch (err) {
      setError(err.message || 'Failed to add user');
    }
  };

  if (!isOwner) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">
          This section is restricted to contract owner only
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Admin Panel
      </Typography>

      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="New User Address"
          value={newUserAddress}
          onChange={(e) => setNewUserAddress(e.target.value)}
          margin="normal"
        />
        <Button 
          variant="contained" 
          onClick={handleAddUser}
          sx={{ mt: 1 }}
        >
          Add Authorized User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
}

AdminPanel.propTypes = {
  contract: PropTypes.object.isRequired,
  isOwner: PropTypes.bool.isRequired
};

export default AdminPanel;