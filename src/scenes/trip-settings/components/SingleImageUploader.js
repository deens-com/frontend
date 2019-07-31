import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { formatMedia, PRIVACY_PUBLIC } from 'libs/trips';
import { primaryDisabled, backgroundError, error } from 'libs/colors';
import useImageUploader from 'hooks/useImageUploader';
import { Trans, t } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { Loader } from 'semantic-ui-react';
import { getHeroImage } from 'libs/media';
import PlusIcon from 'shared_components/icons/PlusIcon';
import Remove from 'shared_components/icons/Remove';

const Box = styled.div`
  border-radius: 5px 5px 5px 0;
  margin-top: 10px;
  width: 85px;
  height: 100px;
  position: relative;
  overflow: hidden;
  border: 1px dashed ${primaryDisabled};
  opacity: 0.5;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
  transition: opacity 0.2s ease;
`;

const Button = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 3px 3px 3px 0;
  background-color: ${primaryDisabled};
  color: white;
  border: 0;
  outline: none;
  cursor: pointer;
  > svg {
    margin: auto;
    width: 18px !important;
    height: 18px !important;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  margin-top: 10px;
`;

const CoverImage = styled.img`
  border-radius: 5px 5px 5px 0;
  width: 100%;
  object-fit: cover;
`;

const RemoveIconWrapper = styled.span`
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer;
  > svg {
    color: ${backgroundError};
    &:hover {
      color: ${error};
    }
  }
`;

const AddButton = () => {
  return (
    <Button>
      <PlusIcon />
    </Button>
  );
};

const SingleImageUploader = ({ trip, editTrip }) => {
  const onImageUpload = (url, image) => {
    const newMedia = formatMedia(url);
    editTrip({
      media: [
        ...trip.media.map(m => ({
          ...m,
          hero: false,
        })),
        ...newMedia,
      ],
    });
  };

  const removeImage = () => {
    editTrip({
      media: trip.media.filter(m => !m.hero),
    });
  };

  const coverImage = getHeroImage(trip, true);

  const { imgSize, isUploading, imageError, onFileSelect } = useImageUploader(
    coverImage,
    onImageUpload,
  );

  return coverImage ? (
    <ImageWrapper>
      <CoverImage src={coverImage.files.original.url} alt="Trip Cover" />
      {!(trip.privacy === PRIVACY_PUBLIC) && (
        <RemoveIconWrapper>
          <Remove onClick={removeImage} style={{ width: '20px', height: '20px' }} />
        </RemoveIconWrapper>
      )}
    </ImageWrapper>
  ) : (
    <>
      <label htmlFor="cover-image">
        <Box>{isUploading ? <Loader inline="centered" active /> : <AddButton />}</Box>
      </label>
      <input
        id="cover-image"
        accept=".jpg, .jpeg, .png, .mp4, .mov"
        type="file"
        style={{ display: 'none' }}
        onChange={onFileSelect}
      />
    </>
  );
};

export default SingleImageUploader;
