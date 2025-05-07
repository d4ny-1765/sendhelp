import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

type DeleteDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
};

const DeleteDialog: React.FC<DeleteDialogProps> = ({ open, onClose, onConfirm, itemName }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle sx={{ fontFamily: 'Inter' }}>Delete {itemName ? itemName : 'Item'}?</DialogTitle>
    <DialogContent>
      <DialogContentText sx={{ fontFamily: 'Inter' }}>
        Are you sure you want to delete {itemName ? itemName : 'this item'}? This action cannot be undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteDialog;