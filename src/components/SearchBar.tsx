import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { Recipe } from "../utils/types";
import SearchIcon from "@mui/icons-material/Search";
import { setSearchTags, setSearchTitle } from "../redux/searchTags";
import ChipDisplay from "./ChipDisplay";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";

interface SearchBarProps {
  autoFocus?: boolean;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar = ({ autoFocus, setSearchOpen }: SearchBarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { recipesList } = useAppSelector(
    (state: RootState) => state.recipesList
  );
  const { searchTags, searchKey, searchTitle } = useAppSelector(
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
      onBlur={() => {
        if (searchTags.length === 0) setSearchOpen(false);
      }}
      onChange={(e, value) => dispatch(setSearchTags(value))}
      renderTags={(value: readonly string[], getTagProps) => (
        <ChipDisplay tags={value} size="small" getTagProps={getTagProps} />
      )}
      inputValue={searchTitle}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === "clear") {
          dispatch(setSearchTitle(""));
          return;
        }
        dispatch(setSearchTitle(newInputValue));
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          autoFocus={autoFocus}
          size="small"
          sx={{ backgroundColor: "white", borderRadius: "10px" }}
          hiddenLabel
          variant="filled"
          InputProps={{
            ...params.InputProps,
            disableUnderline: true,
            sx: { borderRadius: "10px" },
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
          }}
          placeholder="Start typing to search by title or press enter to search for a tag"
        />
      )}
    />
  );
};

export default SearchBar;
