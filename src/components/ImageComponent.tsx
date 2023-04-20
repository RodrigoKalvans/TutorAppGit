import React, {useState, useEffect} from "react";

interface Props {
  userId: string,
  fileKey: string;
}

const ImageComponent: React.FC<Props> = ({userId, fileKey}) => {
  const [imageSrc, setImageSrc] = useState<string>();

  useEffect(() => {
    const getImageFromApi = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tutors/${userId}/picture?key=${fileKey}`);
        const blob = await response.blob();
        setImageSrc(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Error retrieving image from API:", error);
      }
    };
    getImageFromApi();
  }, [fileKey]);

  return (
    <img src={imageSrc} alt="Your image" />
  );
};

export default ImageComponent;
