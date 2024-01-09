import { Button, Dialog, DialogContent, Grid, TextField } from "@mui/material";
import { useState } from "react";

interface BulkEntryDialogProps {
  type: "ingredient" | "step";
  popupOpen: boolean;
  setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleTokens: (token: string) => void;
}

const BulkEntryDialog = ({
  type,
  popupOpen,
  setPopupOpen,
  handleTokens,
}: BulkEntryDialogProps) => {
  const [value, setValue] = useState<string>();

  return (
    <Dialog open={popupOpen} fullWidth maxWidth="sm">
      <DialogContent>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          spacing={2}
        >
          <Grid item xs={12}>
            Enter one {type} per line:
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              multiline
              minRows={10}
              value={value}
              placeholder={
                type === "step"
                  ? `Example:\nMelt butter\nAdd sugar to butter and mix well`
                  : `Example:\n1 cup water\n2/3 count oranges`
              }
              onChange={(event) => setValue(event.target.value)}
            />
          </Grid>
          <Grid
            item
            container
            direction="row"
            justifyContent="flex-end"
            spacing={1}
          >
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => {
                  setValue("");
                  setPopupOpen(false);
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                disabled={!value}
                onClick={async () => {
                  value &&
                    value
                      .split("\n")
                      .map((token) => token.trim())
                      .filter((token) => token)
                      .forEach(handleTokens);
                  setValue("");
                  setPopupOpen(false);
                }}
              >
                OK
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default BulkEntryDialog;
