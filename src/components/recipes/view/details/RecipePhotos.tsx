import { Options, Splide, SplideSlide } from "@splidejs/react-splide";
import { useEffect, useRef } from "react";

interface RecipePhotosProps {
  photos: string[];
}

const RecipePhotos = ({ photos }: RecipePhotosProps) => {
  const mainRef = useRef<Splide>(null);
  const thumbsRef = useRef<Splide>(null);

  useEffect(() => {
    if (mainRef.current && thumbsRef.current && thumbsRef.current.splide) {
      mainRef.current.sync(thumbsRef.current.splide);
    }
  }, []);

  const mainOptions: Options = {
    type: "loop",
    perPage: 1,
    perMove: 1,
    gap: "1rem",
    pagination: false,
    arrows: false,
  };

  const thumbsOptions: Options = {
    type: "slide",
    rewind: true,
    gap: "1rem",
    pagination: false,
    fixedWidth: 110,
    fixedHeight: 70,
    cover: true,
    focus: "center",
    isNavigation: true,
  };

  return (
    <div>
      <Splide options={mainOptions} ref={mainRef}>
        {photos.map((photo) => (
          <SplideSlide key={photo}>
            <div className="recipe-photo-square">
              <img src={photo} alt={"recipe photo"} />
            </div>
          </SplideSlide>
        ))}
      </Splide>
      <Splide options={thumbsOptions} ref={thumbsRef}>
        {photos.map((photo) => (
          <SplideSlide key={`${photo}-thumb`}>
            <img src={photo} alt={"recipe photo"} />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default RecipePhotos;
