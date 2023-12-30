import { Chip, useTheme } from "@mui/material";

interface IProps {
  tags: readonly string[];
  size: "small" | "medium";
  onChipClick?: (tag: string, index: number) => void;
  onChipDelete?: (index: number) => void;
}

const ChipDisplay = ({ tags, size, onChipClick, onChipDelete }: IProps) => {
  const theme = useTheme();
  return (
    <div>
      {tags.map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          onClick={
            onChipClick
              ? (event) => {
                  event.stopPropagation();
                  onChipClick(tag, index);
                }
              : undefined
          }
          onDelete={onChipDelete ? () => onChipDelete(index) : undefined}
          size={size}
          sx={{
            margin: "2px",
            "&:hover": {
              backgroundColor: theme.palette.secondary.main,
            },
            backgroundColor: theme.palette.secondary.light,
          }}
        />
      ))}
    </div>
  );
};

export default ChipDisplay;
