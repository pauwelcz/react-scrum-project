import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React, { FC, ReactNode, useState } from 'react';


export type DialogPopperProps = {
  openComponent: (open: () => void) => ReactNode,
  deleteCallback: () => void,
  message: ReactNode,
}

const DialogOpennerWrapper: FC<DialogPopperProps> = (props) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <>
      {props.openComponent(handleOpenDialog)}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
      >
        <DialogTitle id="alert-dialog-delete">{"Data deletion warning"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-delete-description">
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
            </Button>
          <Button onClick={() => {
            props.deleteCallback();
            handleCloseDialog();
          }}
            color="primary" autoFocus>
            Delete
            </Button>
        </DialogActions>
      </Dialog>
    </>
  );

}

export default DialogOpennerWrapper;
