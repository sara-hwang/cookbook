import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setCurrentTab } from "../redux/tabsList";
import { setSearchTags } from "../redux/searchTags";
import { useRef } from "react";
import { RootState } from "../redux/store";
import TagInput from "./TagInput";

function SearchBar() {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { searchTags } = useAppSelector((state: RootState) => state.searchTags);

  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.target as HTMLInputElement).value !== "") {
      dispatch(
        setSearchTags([
          ...searchTags,
          (event.target as HTMLInputElement).value,
        ]),
      );
      (event.target as HTMLInputElement).value = "";
    }
  };

  const removeTag = (indexToRemove: number) => {
    dispatch(
      setSearchTags([
        ...searchTags.filter((_, index) => index !== indexToRemove),
      ]),
    );
  };

  const fieldOnClick = () => dispatch(setCurrentTab(0));

  const searchStyle = {
    background: "transparent",
    width: "100%",
    borderBottom: "5px solid lightblue",
    fontSize: "18px",
  };

  return (
    <div style={searchStyle}>
      <TagInput
        tags={searchTags}
        inputRef={inputRef}
        fieldOnClick={fieldOnClick}
        addTag={addTag}
        removeTag={removeTag}
      />
    </div>
  );
}

export default SearchBar;
