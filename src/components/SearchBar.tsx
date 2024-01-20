import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { Recipe } from "../utils/types";
import SearchIcon from "@mui/icons-material/Search";
import { setSearchTags, setSearchTitle } from "../redux/searchTags";
import ChipDisplay from "./ChipDisplay";
import { useNavigate, useLocation } from "react-router-dom";

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { recipesList } = useAppSelector(
    (state: RootState) => state.recipesList
  );
  const { searchTags, searchKey } = useAppSelector(
    (state: RootState) => state.searchTags
  );

  const suggestions = [
    ...new Set(
      recipesList
        .reduce(
          (accumulator: string[], currentValue: Recipe) => [
            ...accumulator,
            ...currentValue.tags,
          ],
          []
        )
        .map((word) => word.toLowerCase().trim())
    ),
  ]
    .filter((tag) => !searchTags.includes(tag))
    .sort();

  return (
    <Autocomplete
      multiple
      freeSolo
      fullWidth
      key={searchKey}
      options={suggestions}
      value={searchTags}
      onFocus={() => {
        if (pathname !== "/view") navigate("/view");
      }}
      onChange={(e, value) => dispatch(setSearchTags(value))}
      renderTags={(value: readonly string[], getTagProps) => (
        <ChipDisplay tags={value} size="small" getTagProps={getTagProps} />
      )}
      onInputChange={(event, newInputValue, reason) => {
        reason === "clear" && dispatch(setSearchTitle(""));
      }}
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
          onChange={(e) => dispatch(setSearchTitle(e.target.value))}
          placeholder="Start typing to search by title or press enter to search for a tag"
        />
      )}
    />
  );
};

export default SearchBar;
