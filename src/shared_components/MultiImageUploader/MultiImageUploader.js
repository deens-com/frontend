import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getAuthHeader } from 'libs/axios';
import { getSession } from 'libs/user-session';
import styled from 'styled-components';
import FineUploaderTraditional from 'fine-uploader-wrappers';
import Filename from 'react-fine-uploader/filename';
import TrashCan from 'shared_components/icons/TrashCan';
import Star from 'shared_components/icons/Star';
import CancelButton from 'react-fine-uploader/cancel-button';
import Filesize from 'react-fine-uploader/filesize';
import DeleteButton from 'react-fine-uploader/delete-button';
import ProgressBar from 'react-fine-uploader/progress-bar';
import Thumbnail from 'react-fine-uploader/thumbnail';
import FileInput from 'react-fine-uploader/file-input';
import { serverBaseURL } from 'libs/config';
import { getImageUrlFromFiles } from 'libs/media';
import Button from 'shared_components/Button';
import { mediaExtensions, MEDIA_IMAGE, MEDIA_VIDEO } from 'libs/trips';

// i18n
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

const allowedExtensions = [...mediaExtensions[MEDIA_IMAGE], ...mediaExtensions[MEDIA_VIDEO]];

const uploaderOptions = {
  options: {
    debug: false,
    autoUpload: true,
    chunking: {
      enabled: false,
    },
    deleteFile: {
      enabled: true,
      endpoint: `${serverBaseURL}/media`,
      customHeaders: {
        Authorization: getSession() && getAuthHeader(),
      },
    },
    signature: {
      endpoint: `${serverBaseURL}/media/s3/sign`,
      version: 4,
    },
    request: {
      endpoint: `${serverBaseURL}/media`,
      customHeaders: {
        Authorization: getSession() && getAuthHeader(),
      },
    },
    validation: {
      allowedExtensions,
      sizeLimit: 5242880, // 5MB = 5 * 1024 * 1024
    },
  },
};

const Wrapper = styled.div`
  background-color: #f8f8f8;
  border: 2px dashed #c4c4c4;
  min-height: 200px;
  padding: 15px 19px;
`;

const Images = styled.div`
  display: flex;
  flex-wrap: wrap;
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
  color: ${props => (props.hero ? '#097DA8' : '#C4C4C4')};
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  cursor: pointer;
`;

const ProgressWrapper = styled.div``;

const HeroBorder = styled.div`
  cursor: pointer;
  color: #097da8;
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

    this.uploader = this.addEventHandlers(new FineUploaderTraditional(uploaderOptions));
  }

  addEventHandlers = uploader => {
    uploader.on('complete', (id, name, response) => {
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

    uploader.on('submit', id => {
      this.props.onStartedUpload(id);
    });

    uploader.on('error', (id, name, errorReason) => {
      if (errorReason.includes('invalid extension')) {
        alert(
          `${name} file is not a supported image file.\nPlease use following file formats: ${allowedExtensions
            .map(ext => `.${ext}`)
            .join(', ')}`,
        );
      } else {
        alert(errorReason);
      }
    });

    uploader.on('statusChange', (id, oldStatus, newStatus) => {
      const isInitial = oldStatus === null && newStatus === 'upload successful';
      if (newStatus === 'submitted' || isInitial) {
        this.setState(prevState => ({
          submittedFiles: [
            ...prevState.submittedFiles,
            {
              id,
              isInitial,
              url: isInitial ? this.props.initialUploadedFiles[id].files.original.url : null,
            },
          ],
        }));
      }
      if (newStatus === 'canceled' || newStatus === 'deleting') {
        const url = this.state.submittedFiles.find(file => file.id === id).url;
        this.setState(
          prevState => ({
            submittedFiles: prevState.submittedFiles.filter(file => file.id !== id),
          }),
          () =>
            this.props.onUploadedFilesChanged(this.state.submittedFiles, id, this.state.hero, url),
        );
      }
    });
    return uploader;
  };

  selectHero = id => {
    this.setState(
      {
        hero: id,
      },
      () => this.props.onUploadedFilesChanged(this.state.submittedFiles, null, this.state.hero),
    );
  };

  componentDidMount() {
    this.uploadInitialFiles();
  }

  uploadInitialFiles() {
    const files = this.props.initialUploadedFiles.map((element, i) => ({
      id: i,
      hero: element.hero,
      name: element.names,
      thumbnailUrl: getImageUrlFromFiles(element.files, 'thumbnail'),
    }));
    const isHero = files.find(elem => elem.hero);

    if (isHero) {
      this.setState({
        hero: isHero.id,
      });
    }
    this.uploader.methods.addInitialFiles(files);
  }

  componentDidUpdate(prevProps) {
    const newFiles = this.props.initialUploadedFiles;
    const oldFiles = prevProps.initialUploadedFiles;
    /*if (newFiles.length === 0) {
      this.setState({
        submittedFiles: []
      })
      return
    }*/
    if (newFiles !== oldFiles) {
      this.uploader = this.addEventHandlers(new FineUploaderTraditional(uploaderOptions));
      this.setState(
        {
          submittedFiles: [],
          hero: null,
        },
        () => {
          this.uploadInitialFiles();
        },
      );
    }
  }

  render() {
    return (
      <Wrapper>
        <FileInput multiple accept="image/*" uploader={this.uploader}>
          <Button theme="fillLightGreen" onClick={() => {}}>
            <Trans>Choose files</Trans>
          </Button>
        </FileInput>
        <Images>
          {this.state.submittedFiles.map(file => (
            <Image key={file.id}>
              {this.props.withHeroSelection && (
                <SelectHeroButton onClick={() => this.selectHero(file.id)}>
                  <HeroBorder>
                    <Star style={{ width: 29, height: 29 }} />
                  </HeroBorder>
                  <HeroFill hero={this.state.hero === file.id}>
                    <Star style={{ width: 25, height: 25 }} />
                  </HeroFill>
                </SelectHeroButton>
              )}
              <ProgressWrapper>
                <ProgressBar id={file.id} hideOnComplete uploader={this.uploader} />
              </ProgressWrapper>
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
