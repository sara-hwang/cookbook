import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { Recipe } from "../constants/types";
import SearchIcon from "@mui/icons-material/Search";
import { setSearchTags } from "../redux/searchTags";
import ChipDisplay from "./ChipDisplay";
import { useNavigate, useLocation } from "react-router-dom";

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { recipesList } = useAppSelector(
    (state: RootState) => state.recipesList
  );
  const { searchTags } = useAppSelector((state: RootState) => state.searchTags);

  const suggestions = [
    ...new Set(
      recipesList
        .reduce(
          (accumulator: string[], currentValue: Recipe) => [
            ...accumulator,
            ...currentValue.tags,
            ...currentValue.ingredients.map((ing) => ing.element),
          ],
          []
        )
        .map((word) => word.toLowerCase().trim())
    ),
  ].sort();

  return (
    <Autocomplete
      multiple
      freeSolo
      options={suggestions}
      value={searchTags}
      fullWidth
      onFocus={() => {
        if (pathname !== "/view") navigate("/view");
      }}
      onChange={(e, value) => dispatch(setSearchTags(value))}
      renderTags={(value: readonly string[], getTagProps) => (
        <ChipDisplay
          tags={value}
          size="small"
          onChipDelete={getTagProps({ index: 0 }).onDelete}
        />
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          sx={{ backgroundColor: "white" }}
          hiddenLabel
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            sx: { borderRadius: 0 },
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
          }}
          placeholder="Press enter to search for a tag"
        />
      )}
    />
  );
};

export default SearchBar;
