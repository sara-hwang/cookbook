import { useState } from "react";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import "../stylesheets/Search.css";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // theme
import "primeflex/primeflex.css"; // css utility
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css"; // core css
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { Recipe } from "../constants/types";
import { setSearchTags } from "../redux/searchTags";
import { setCurrentTab } from "../redux/tabsList";

export default function SearchBar() {
  const dispatch = useAppDispatch();
  const [filtered, setFiltered] = useState<string[]>();
  const { recipesList } = useAppSelector(
    (state: RootState) => state.recipesList,
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
          [],
        )
        .map((word) => word.toLowerCase().trim()),
    ),
  ].sort();

  const search = (event: AutoCompleteCompleteEvent) => {
    let filteredSuggestions;
    if (!event.query.trim().length) {
      filteredSuggestions = [...suggestions];
    } else {
      filteredSuggestions = suggestions.filter((s) =>
        s.toLowerCase().startsWith(event.query.toLowerCase()),
      );
    }
    setFiltered(filteredSuggestions);
  };

  return (
    <div className="card p-fluid">
      <AutoComplete
        placeholder="🔍 Start typing ingredients or tags..."
        onFocus={() => dispatch(setCurrentTab(-3))}
        multiple
        value={searchTags}
        suggestions={filtered}
        completeMethod={search}
        style={{ fontSize: "small", padding: "0 5px" }}
        onChange={(e) => dispatch(setSearchTags(e.value))}
      />
    </div>
  );
}
