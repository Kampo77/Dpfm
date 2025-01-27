import { Snackbar, Alert } from '@mui/material';

const Notifications = ({ message, type, open, onClose }) => (
  <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
    <Alert severity={type}>{message}</Alert>
  </Snackbar>
);