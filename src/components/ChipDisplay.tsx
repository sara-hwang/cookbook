import { Chip, useTheme } from "@mui/material";

interface IProps {
  tags: string[];
  onChipClick: (tag: string, index: number) => void;
  onChipDelete?: (index: number) => void;
}

const ChipDisplay = ({ tags, onChipClick, onChipDelete }: IProps) => {
  const theme = useTheme();
  return (
    <div>
      {tags.map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          onClick={(event) => {
            event.stopPropagation();
            onChipClick(tag, index);
          }}
          onDelete={onChipDelete ? () => onChipDelete(index) : undefined}
          sx={{
            margin: "0px 0px 4px 4px",
            color: "white",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
            backgroundColor: theme.palette.primary.main,
          }}
        />
      ))}
    </div>
  );
};

export default ChipDisplay;
