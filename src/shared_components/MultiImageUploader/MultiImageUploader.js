import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FineUploaderTraditional from 'fine-uploader-wrappers';
import Filename from 'react-fine-uploader/filename';
import { TrashCan, Star } from 'shared_components/icons';
import CancelButton from 'react-fine-uploader/cancel-button';
import Filesize from 'react-fine-uploader/filesize';
import DeleteButton from 'react-fine-uploader/delete-button';
import Thumbnail from 'react-fine-uploader/thumbnail';
import FileInput from 'react-fine-uploader/file-input';
import { serverBaseURL } from 'libs/config';
import Button from 'shared_components/Button';

const allowedExtensions = ['jpeg', 'jpg', 'gif', 'png'];
const i18nLocale = 'en-us';

const Wrapper = styled.div`
  background-color: #f8f8f8;
  border: 2px dashed #c4c4c4;
  min-height: 200px;
  padding: 15px 19px;
`;

const Images = styled.div`
  display: flex;
`;

const Image = styled.div`
  margin: 10px 5px;
  position: relative;
  width: 120px;
  display: flex;
  flex-direction: column;
  canvas {
    border-radius: 10px;
  }
  .react-fine-uploader-filename {
    overflow: hidden;
    white-space: nowrap;
    color: black;
    font-weight: bold;
    text-overflow: ellipsis;
    width: 100px;
    display: inline-block;
    vertical-align: middle;
  }
`;

const deleteButtonStyle = {
  border: 0,
  background: 'transparent',
  opacity: 1,
  color: '#B0A8A8',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

const DataWrapper = styled.div``;

const SizeWrapper = styled.div`
  text-align: center;
`;

const SelectHeroButton = styled.div``;

const HeroFill = styled.div`
  color: ${props => (props.hero ? '#38D39F' : '#C4C4C4')};
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  cursor: pointer;
`;

const HeroBorder = styled.div`
  cursor: pointer;
  color: #38d39f;
  top: 6px;
  left: 6px;
  position: absolute;
  z-index: 1;
`;

export default class MultiImageUploader extends Component {
  static propTypes = {
    onUploadedFilesChanged: PropTypes.func.isRequired,
    initialUploadedFiles: PropTypes.arrayOf(PropTypes.object),
    onStartedUpload: PropTypes.func,
  };

  static defaultProps = {
    initialUploadedFiles: [],
  };

  constructor(props) {
    super(props);
    const hero = this.props.initialUploadedFiles.find(element => element.hero);

    this.state = {
      submittedFiles: [],
      hero: hero ? hero.id : null,
    };

    this.uploader = new FineUploaderTraditional({
      options: {
        debug: false,
        autoUpload: true,
        chunking: {
          enabled: false,
        },
        deleteFile: {
          enabled: true,
          endpoint: `${serverBaseURL}/media`,
        },
        request: {
          endpoint: `${serverBaseURL}/media`,
        },
        validation: {
          allowedExtensions,
          sizeLimit: 5242880, // 5MB = 5 * 1024 * 1024
        },
      },
    });

    this.uploader.on('complete', (id, name, response) => {
      this.setState(
        ({ submittedFiles }) => ({
          submittedFiles: submittedFiles.map(file => {
            if (file.id !== id) {
              return file;
            }
            return {
              id,
              url: response.url,
            };
          }),
        }),
        () => this.props.onUploadedFilesChanged(this.state.submittedFiles, id, this.state.hero),
      );
    });

    this.uploader.on('submit', id => {
      this.props.onStartedUpload(id);
    });

    this.uploader.on('error', (id, name, errorReason) => {
      if (errorReason.includes('invalid extension')) {
        alert(
          `${name} file is not an supported image file.\nPlease use following file formats: ${allowedExtensions
            .map(ext => `.${ext}`)
            .join(', ')}`,
        );
      } else {
        alert(errorReason);
      }
    });

    this.uploader.on('statusChange', (id, oldStatus, newStatus) => {
      const isInitial = oldStatus === null && newStatus === 'upload successful';
      if (newStatus === 'submitted' || isInitial) {
        this.setState(prevState => ({
          submittedFiles: [
            ...prevState.submittedFiles,
            {
              id,
              isInitial,
              url: isInitial ? this.props.initialUploadedFiles[id].files.hero.url : null,
            },
          ],
        }));
      }
      if (newStatus === 'canceled' || newStatus === 'deleting') {
        this.setState(
          prevState => ({
            submittedFiles: prevState.submittedFiles.filter(file => file.id !== id),
          }),
          () => this.props.onUploadedFilesChanged(this.state.submittedFiles, id, this.state.hero),
        );
      }
    });
  }

  selectHero = id => {
    this.setState(
      {
        hero: id,
      },
      () => this.props.onUploadedFilesChanged(this.state.submittedFiles, null, this.state.hero),
    );
  };

  componentDidMount() {
    const files = this.props.initialUploadedFiles.map((element, i) => ({
      id: i,
      hero: element.hero,
      name: element.names[i18nLocale],
      thumbnailUrl: element.files.thumbnail.url,
    }));
    const isHero = files.find(elem => elem.hero);

    if (isHero) {
      this.setState({
        hero: isHero.id,
      });
    }

    this.uploader.methods.addInitialFiles(files);
  }

  render() {
    return (
      <Wrapper>
        <FileInput multiple accept="image/*" uploader={this.uploader}>
          <Button theme="fillLightGreen" onClick={() => {}}>
            Choose files
          </Button>
        </FileInput>
        <Images>
          {this.state.submittedFiles.map(file => (
            <Image key={file.id}>
              <SelectHeroButton onClick={() => this.selectHero(file.id)}>
                <HeroBorder>
                  <Star style={{ width: 29, height: 29 }} />
                </HeroBorder>
                <HeroFill hero={this.state.hero === file.id}>
                  <Star style={{ width: 25, height: 25 }} />
                </HeroFill>
              </SelectHeroButton>
              <Thumbnail fromServer={file.isInitial} id={file.id} uploader={this.uploader} />
              <DataWrapper>
                <Filename id={file.id} uploader={this.uploader} />
                <CancelButton style={deleteButtonStyle} id={file.id} uploader={this.uploader}>
                  <TrashCan />
                </CancelButton>
                <DeleteButton style={deleteButtonStyle} id={file.id} uploader={this.uploader}>
                  <TrashCan />
                </DeleteButton>
              </DataWrapper>
              <SizeWrapper>
                <Filesize id={file.id} uploader={this.uploader} />
              </SizeWrapper>
            </Image>
          ))}
        </Images>
      </Wrapper>
    );
    // return <Gallery fileInput-children={fileInputChildren} uploader={this.uploader} />;
  }
}
