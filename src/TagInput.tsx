import { Chip } from "@mui/material";
import { CSSProperties, RefObject } from "react";
import { chipStyle } from "./styles";
import ChipDisplay from "./ChipDisplay";

interface IProps {
  tags: string[];
  inputRef: RefObject<HTMLInputElement>;
  fieldOnClick?: () => void;
  addTag: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  removeTag: (index: number) => void;
}

const TagInput = ({
  tags,
  inputRef,
  fieldOnClick,
  addTag,
  removeTag,
}: IProps) => {
  const inputTextStyle: CSSProperties = {
    padding: "10px",
    width: "100%",
    boxSizing: "border-box",
    fontSize: "inherit",
    border: "none",
    background: "transparent",
    outline: "none",
  };

  return (
    <div>
      <input
        style={inputTextStyle}
        type="text"
        placeholder="Enter tags seperated by enter..."
        ref={inputRef}
        onClick={fieldOnClick}
        onKeyUp={(event) => (event.key === "Enter" ? addTag(event) : null)}
      />
      <ChipDisplay
        tags={tags}
        onChipClick={(tag, index) => {
          if (inputRef?.current) {
            inputRef.current.value = tag;
            inputRef.current.focus();
          }
          removeTag(index);
        }}
        onChipDelete={(index) => removeTag(index)}
      />
    </div>
  );
};

export default TagInput;
