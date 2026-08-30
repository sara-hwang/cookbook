import {
  Dialog,
  DialogContent,
  Grid,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { deleteRecipe, duplicateRecipe } from "../../../../utils/api";
import { setRecipesList } from "../../../../redux/recipesList";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { popTab } from "../../../../redux/tabsList";
import { useState } from "react";
import { RootState } from "../../../../redux/store";

interface RecipeOptionsMenuProps {
  onClose?: () => void;
}

const RecipeOptionsMenu = ({ onClose }: RecipeOptionsMenuProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { recipesList } = useAppSelector(
    (state: RootState) => state.recipesList
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDuplicate = async () => {
    handleMenuClose();
    setDuplicating(true);
    try {
      const response = await duplicateRecipe(id);
      if (response && response.status === 200) {
        dispatch(setRecipesList([...recipesList, response.data]));
        navigate(`/view/${response.data.key}`);
      } else {
        alert(`Failed to duplicate recipe: ${response?.data}`);
      }
    } catch (error) {
      alert("An error occurred while duplicating the recipe");
    } finally {
      setDuplicating(false);
    }
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialogOpen(false);
    const response = await deleteRecipe(id);
    if (response && response.status === 200) {
      dispatch(popTab(`/view/${id}`));
      navigate("/view");
      onClose?.();
    } else {
      alert(response?.data);
    }
  };

  return (
    <>
      <Tooltip arrow disableInteractive title="More options">
        <IconButton
          onClick={handleMenuOpen}
          sx={{ p: 0 }}
          aria-label="recipe options"
        >
          <MoreVert fontSize="large" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleDuplicate} disabled={duplicating}>
          {duplicating ? "Duplicating..." : "Duplicate Recipe"}
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete Recipe</MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogContent>
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            spacing={2}
          >
            <Grid>Are you sure you want to delete this recipe?</Grid>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              spacing={1}
            >
              <Grid>
                <Button
                  variant="outlined"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid>
                <Button variant="contained" onClick={handleDeleteConfirm}>
                  Yes, Delete
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecipeOptionsMenu;
