import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import VuiTypography from 'src/components/admin/VuiTypography';

function ConfirmDialog({ open, onClose, onConfirm, itemId }) {
  const handleConfirm = () => {
    onConfirm(itemId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <VuiTypography variant="body2">
          Are you sure you want to delete item {itemId}?
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
  );
}


// function ConfirmDialog({ open, onClose, onConfirm, itemName }) {
//   const handleConfirm = () => {
//     onConfirm();
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Confirm Delete</DialogTitle>
//       <DialogContent>
//         <VuiTypography variant="body2">
//           Are you sure you want to delete the post title "{itemName}"?
//         </VuiTypography>
//       </DialogContent>
//       <DialogActions>
//         <Button
//           onClick={onClose}
//           sx={{ color: 'error.main', borderColor: 'error.main', '&:hover': { borderColor: 'error.dark' } }}
//           variant="outlined"
//         >
//           Cancel
//         </Button>
//         <Button
//           onClick={handleConfirm}
//           sx={{ color: 'success.main', borderColor: 'success.main', '&:hover': { borderColor: 'success.dark' } }}
//           variant="outlined"
//         >
//           Confirm
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

export default ConfirmDialog;
