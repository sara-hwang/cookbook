import { Button, Dialog, DialogContent, Grid } from "@mui/material";
import { deleteRecipe } from "../../../../utils/api";
import { setRecipesList } from "../../../../redux/recipesList";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks";
import { popTab } from "../../../../redux/tabsList";

interface DeleteRecipeDialogProps {
  popupOpen: boolean;
  setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteRecipeDialog = ({
  popupOpen,
  setPopupOpen,
}: DeleteRecipeDialogProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Dialog open={popupOpen}>
      <DialogContent>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          spacing={2}
        >
          <Grid>Are you sure you want to delete this recipe?</Grid>
          <Grid container direction="row" justifyContent="flex-end" spacing={1}>
            <Grid>
              <Button variant="outlined" onClick={() => setPopupOpen(false)}>
                Cancel
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                onClick={async () => {
                  setPopupOpen(false);
                  const response = await deleteRecipe(id);
                  if (response && response.status === 200) {
                    dispatch(popTab(`/view/${id}`));
                    navigate("/view");
                  } else {
                    alert(response?.data);
                  }
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

export default DeleteRecipeDialog;
