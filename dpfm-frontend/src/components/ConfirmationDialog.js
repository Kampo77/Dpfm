import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading
}) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;