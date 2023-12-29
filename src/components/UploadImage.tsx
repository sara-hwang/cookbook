import { Typography } from "@mui/material";

interface IProps {
  selectedImage: File;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | undefined>>;
}

const UploadImage = ({ selectedImage, setSelectedImage }: IProps) => {
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        name="recipePhoto"
        onChange={(event) => {
          if (event.target.files !== null) {
            setSelectedImage(event.target.files[0]);
          }
        }}
      />
      {selectedImage && (
        <div>
          <img
            alt="image not found"
            width={"250px"}
            src={URL.createObjectURL(selectedImage)}
          />
          <br />
          <button onClick={() => setSelectedImage(undefined)}>Remove</button>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
