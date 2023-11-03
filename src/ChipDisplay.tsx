import { Chip } from "@mui/material";
import { chipStyle } from "./constants/styles";

interface IProps {
  tags: string[];
  onChipClick: (tag: string, index: number) => void;
  onChipDelete?: (index: number) => void;
}

const ChipDisplay = ({ tags, onChipClick, onChipDelete }: IProps) => {
  return (
    <div>
      {tags.map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          onClick={() => onChipClick(tag, index)}
          onDelete={onChipDelete ? () => onChipDelete(index) : undefined}
          sx={chipStyle}
        />
      ))}
    </div>
  );
};

export default ChipDisplay;
