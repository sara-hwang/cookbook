import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import { useAppSelector } from "../redux/hooks";
import { Recipe } from "../utils/types";
import SearchIcon from "@mui/icons-material/Search";
import ChipDisplay from "./ChipDisplay";
import { RootState } from "../redux/store";

interface SearchBarProps {
  searchKey: number;
  searchTags: string[];
  setSearchTags:
    | ((value: string[]) => {
        payload: string[];
        type: "searchTags/setSearchTags";
      })
    | React.Dispatch<React.SetStateAction<string[]>>;
  setSearchTitle:
    | ((value: string) => {
        payload: string;
        type: "searchTags/setSearchTitle";
      })
    | React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar = ({
  searchKey,
  searchTags,
  setSearchTags,
  setSearchTitle,
}: SearchBarProps) => {
  const { recipesList } = useAppSelector(
    (state: RootState) => state.recipesList
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
      onChange={(e, value) => setSearchTags(value)}
      renderTags={(value: readonly string[], getTagProps) => (
        <ChipDisplay tags={value} size="small" getTagProps={getTagProps} />
      )}
      onInputChange={(event, newInputValue, reason) => {
        reason === "clear" && setSearchTitle("");
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
          onChange={(e) => setSearchTitle(e.target.value)}
          placeholder="Start typing to search by title or press enter to search for a tag"
        />
      )}
    />
  );
};

export default SearchBar;
