import { Typography } from "@mui/material";
import { FormikErrors } from "formik";
import { useState } from "react";
import { Recipe } from "./types";

interface IProps {
  setFieldValue: (
    field: string,
    value: string | ArrayBuffer | null,
    shouldValidate?: boolean | undefined,
  ) => Promise<void | FormikErrors<Recipe>>;
}

const UploadImage = ({ setFieldValue }: IProps) => {
  const [selectedImage, setSelectedImage] = useState<File>();

  const setPhotoField = (img: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => {
      setFieldValue("photo", reader.result);
    };
  };

  return (
    <div>
      <Typography variant="h6">Photo</Typography>
      <input
        type="file"
        accept="image/*"
        name="recipePhoto"
        onChange={(event) => {
          if (event.target.files !== null) {
            setSelectedImage(event.target.files[0]);
            setPhotoField(event.target.files[0]);
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
