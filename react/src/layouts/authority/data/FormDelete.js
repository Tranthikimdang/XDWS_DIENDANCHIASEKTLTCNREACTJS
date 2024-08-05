import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import VuiTypography from 'components/VuiTypography';
import Snackbar from '@mui/material/Snackbar'; // Nhập Snackbar
import Alert from '@mui/material/Alert'; // Nhập Alert

function ConfirmDialog({ open, onClose, onConfirm, itemId }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State cho Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State cho thông điệp
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // State cho mức độ thông điệp

  const handleConfirm = () => {
    onConfirm(itemId);
    setSnackbarMessage("Authority deleted successfully."); // Thông điệp thành công
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    onClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Đóng Snackbar
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <VuiTypography variant="body2">
            Are you sure you want to delete this item?
          </VuiTypography>
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

      {/* Snackbar để hiển thị thông điệp */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ConfirmDialog;
