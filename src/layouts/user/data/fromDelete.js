import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import VuiTypography from 'components/VuiTypography';
import TextField from '@mui/material/TextField';

function ConfirmDialog({ open, onClose, onConfirm, item }) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (reason.trim() === '') {
      alert('Please provide a reason for deletion.');
      return;
    }
    onConfirm(item.id, reason);
    setReason(''); // Clear reason after confirmation
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <VuiTypography variant="body2" paragraph>
          Are you sure you want to delete the following user?
        </VuiTypography>
        <VuiTypography variant="body1" fontWeight="medium">
          Name: {item.name}
        </VuiTypography>
        <VuiTypography variant="body2">
          Email: {item.email}
        </VuiTypography>
        <TextField
          autoFocus
          margin="dense"
          label="Reason for Deletion"
          type="text"
          fullWidth
          variant="outlined"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ color: 'error.main', borderColor: 'error.main', '&:hover': { borderColor: 'error.dark' } }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          sx={{ color: 'success.main', borderColor: 'success.main', '&:hover': { borderColor: 'success.dark' } }}
          variant="outlined"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
