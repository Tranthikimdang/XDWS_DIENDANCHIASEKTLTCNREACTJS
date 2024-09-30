import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import VuiTypography from 'src/components/admin/VuiTypography';
import   { db, storage } from "../../../../config/firebaseconfig";


function ConfirmDialog({ open, onClose, onConfirm, itemId }) {
  const handleConfirm = () => {
    onConfirm(itemId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác Nhận Xóa</DialogTitle>
      <DialogContent>
        <VuiTypography variant="body2">
        Bạn có chắc chắn muốn xóa mục không? {itemId}?
        </VuiTypography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ color: 'error.main', borderColor: 'error.main', '&:hover': { borderColor: 'error.dark' } }}
          variant="outlined"
        >
         Hủy
        </Button>
        <Button
          onClick={handleConfirm}
          sx={{ color: 'success.main', borderColor: 'success.main', '&:hover': { borderColor: 'success.dark' } }}
          variant="outlined"
        >
         Xác Nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}


export default ConfirmDialog;
