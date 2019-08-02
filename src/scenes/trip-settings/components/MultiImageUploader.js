import React, { useMemo } from 'react';
import styled from 'styled-components';
import { formatMedia, signAndUploadImage } from 'libs/trips';
import { primaryDisabled, backgroundError, error } from 'libs/colors';
import useImageUploader from 'hooks/useImageUploader';
import { Loader } from 'semantic-ui-react';
import PlusIcon from 'shared_components/icons/PlusIcon';
import Remove from 'shared_components/icons/Remove';
import { getImageUrlFromFiles } from 'libs/media';

const UploadedImage = styled.img`
  border-radius: 5px 5px 5px 0;
  margin-top: 10px;
  margin-right: 15px;
  width: 85px;
  height: 100px;
  object-fit: cover;
`;

const ImageWrapper = styled.div`
  overflow: hidden;
  position: relative;
`;

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

const Button = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 3px 3px 3px 0;
  background-color: ${primaryDisabled};
  color: white;
  border: 0;
  outline: none;
  cursor: pointer;
  display: flex;
  > svg {
    margin: auto;
    width: 18px !important;
    height: 18px !important;
  }
`;

const Wrapper = styled.div`
  position: relative;
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
`;

const RemoveIconWrapper = styled.span`
  position: absolute;
  right: 10px;
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

const SingleImageUploader = ({
  uploading,
  media,
  onUploadedFile,
  onRemovedFile,
  onStartedUpload,
}) => {
  const onImageUpload = (url, image) => {
    if (!url || !image) {
      return;
    }
    onUploadedFile(url, image);
  };

  const { onFileSelect } = useImageUploader(null, onImageUpload);

  const onUpload = e => {
    const file = e.currentTarget.files[0];
    if (!file) return;
    onStartedUpload();
    onFileSelect(e);
  };

  const uploadingArray = useMemo(() => [...new Array(uploading)], [uploading]);

  return (
    <Wrapper>
      {media.map((singleMedia, i) => (
        <ImageWrapper>
          <UploadedImage src={getImageUrlFromFiles(singleMedia.files, 'thumbnail')} />
          <RemoveIconWrapper>
            <Remove onClick={() => onRemovedFile(i)} style={{ width: '20px', height: '20px' }} />
          </RemoveIconWrapper>
        </ImageWrapper>
      ))}
      {uploadingArray.map(_ => (
        <Box style={{ marginRight: 15 }}>
          <Loader size="small" inline="centered" active />
        </Box>
      ))}
      <label htmlFor="add-image">
        <Box>
          <AddButton />
        </Box>
      </label>
      <input
        id="add-image"
        accept=".jpg, .jpeg, .png"
        type="file"
        style={{ display: 'none' }}
        onChange={onUpload}
      />
    </Wrapper>
  );
};

export default SingleImageUploader;
