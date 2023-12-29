import {
  Autocomplete,
  Chip,
  InputAdornment,
  TextField,
  useTheme,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { Recipe } from "../constants/types";
import SearchIcon from "@mui/icons-material/Search";
import { setSearchTags } from "../redux/searchTags";

const SearchBar = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

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
      onChange={(e, value) => dispatch(setSearchTags(value))}
      renderTags={(value: readonly string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip
            {...getTagProps({ index })}
            key={index}
            label={option}
            size="small"
            sx={{ backgroundColor: theme.palette.primary.light }}
          />
        ))
      }
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
