import { useState, useEffect } from 'react';
import { formatMedia, signAndUploadImage } from 'libs/trips';

// media: ONE media element
// onImageUploaded(url: String, img: Image)
export default function useImageUploader(media, onImageUploaded) {
  const [imgSize, setImgSize] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(null);

  const onFileSelect = async e => {
    const file = e.currentTarget.files[0];
    if (!file) return;

    setIsUploading(true);
    await uploadImage(file);
    setIsUploading(false);
  };

  const uploadImage = async file => {
    try {
      setImageError(null);
      const url = await signAndUploadImage(file);

      const img = new Image();
      img.onload = function() {
        setImgSize({
          width: img.width,
          height: img.height,
        });

        onImageUploaded(url, img);
      };
      img.src = url;
    } catch (e) {
      setImageError(e.message);
    }
  };

  useEffect(
    () => {
      const getImgSize = () => {
        if (!media) {
          return {};
        }
        const img = new Image();
        img.onload = function() {
          setImgSize({
            width: img.width,
            height: img.height,
          });
        };
        img.src = media.files.original.url;
      };
      getImgSize();
    },
    [media],
  );

  return {
    imgSize,
    isUploading,
    imageError,
    onFileSelect,
  };
}
