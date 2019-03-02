import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { H2, P } from 'libs/commonStyles';
import { primary, secondary, lightText, darkText } from 'libs/colors';
import InlineInput from 'shared_components/InlineInput';
import { Loader } from 'semantic-ui-react';
//https://maps.googleapis.com/maps/api/staticmap?center=${location.city}&zoom=13&size=140x140&maptype=roadmap&key=AIzaSyBzMYIINQ6uNANLfPeuZn5ZJlz-8pmPjvc

const Wrapper = styled.header`
  background: url('${props => props.image}');
  background-size:cover;
  background-position: center;
`;

const Overlay = styled.div`
  display: flex;
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  padding: 25px 40px;
  text-align: center;
  > div {
    margin: auto;
    display: flex;
    flex-direction: column;
  }
`;

const Title = styled(H2)`
  color: ${secondary};
  margin: auto;
`;

const Description = styled.div`
  color: ${lightText};
  margin: auto;
`;

const More = styled.div`
  color: ${primary};
  margin-top: 40px;
  > label {
    cursor: pointer;
  }
  > input[type='file'] {
    display: none;
  }
`;

const Header = ({
  location,
  title,
  image,
  description,
  onEditTitle,
  onEditDescription,
  onImageUpload,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const onFileSelect = async e => {
    const file = e.currentTarget.files[0];
    if (!file) return;
    if (file.size > 3000000) {
      return;
    }

    setIsUploading(true);
    await onImageUpload(file);
    setIsUploading(false);
  };

  return (
    <Wrapper image={image}>
      <Overlay>
        <div>
          <Title>
            <InlineInput disallowEmptySubmit onChanged={onEditTitle}>
              {title}
            </InlineInput>
          </Title>
          <Description>
            <InlineInput
              placeholder="Add a description or some notes"
              inputTextColor={darkText}
              onChanged={onEditDescription}
            >
              {description}
            </InlineInput>
          </Description>
          <More>
            {isUploading ? (
              <Loader active inline="centered" size="small" />
            ) : (
              <>
                <label htmlFor="cover-image">{image ? 'Change image' : 'Add image'}</label>
                <input
                  id="cover-image"
                  accept=".jpg, .jpeg, .png"
                  type="file"
                  onChange={onFileSelect}
                />
              </>
            )}
          </More>
        </div>
      </Overlay>
    </Wrapper>
  );
};

Header.propTypes = {
  onEditTitle: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  onEditDescription: PropTypes.func.isRequired,
  location: PropTypes.shape({
    city: PropTypes.string,
    countryCode: PropTypes.string,
    geo: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number),
      type: PropTypes.string,
    }),
  }),
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};

Header.defaultProps = {
  location: null,
  title: '',
  description: '',
  image: '',
};

export default Header;
