import "./Search.css";
import { useAppDispatch } from "../redux/hooks";
import { setCurrentTab } from "../redux/tabsList";
import { useEffect, useRef, useState } from "react";
import { Chip } from "@mui/material";

function SearchBar() {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  // const [searchText, setSearchText] = useState<string>("");
  useEffect(() => {
    console.log(tags);
  }, [tags]);

  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.target as HTMLInputElement).value !== "") {
      setTags([...tags, (event.target as HTMLInputElement).value]);
      (event.target as HTMLInputElement).value = "";
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)]);
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
      {tags.map((tag, index) => (
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



