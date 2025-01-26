import { Button, Dialog, DialogContent, Grid } from "@mui/material";

interface ClearGroceryDialogProps {
  popupOpen: boolean;
  setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setClear: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClearGroceryDialog = ({
  popupOpen,
  setPopupOpen,
  setClear,
}: ClearGroceryDialogProps) => {
  return (
    <Dialog open={popupOpen}>
      <DialogContent>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          spacing={2}
        >
          <Grid>
            Are you sure you want to delete all items in this list?
          </Grid>
          <Grid container direction="row" justifyContent="flex-end" spacing={1}>
            <Grid>
              <Button variant="outlined" onClick={() => setPopupOpen(false)}>
                Cancel
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                onClick={() => {
                  setPopupOpen(false);
                  setClear(true);
                }}
              >
                Yes
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ClearGroceryDialog;
