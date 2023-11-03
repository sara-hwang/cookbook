import "./Search.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setCurrentTab } from "../redux/tabsList";
import { setSearchTags } from "../redux/searchTags";
import { useEffect, useRef, useState } from "react";
import { Chip } from "@mui/material";
import { RootState } from "../redux/store";

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

  return (
    <div className="search">
      <input
        className="search-txt"
        type="text"
        placeholder="Enter tags seperated by space..."
        ref={inputRef}
        onClick={() => dispatch(setCurrentTab(0))}
        onKeyUp={(event) => (event.key === "Enter" ? addTag(event) : null)}
      />
      {searchTags.map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = tag;
              inputRef.current.focus();
            }
            removeTag(index);
          }}
          onDelete={() => removeTag(index)}
        />
      ))}
    </div>
  );
}

export default SearchBar;
