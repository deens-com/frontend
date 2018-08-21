import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FineUploaderTraditional from 'fine-uploader-wrappers';
import Gallery from 'react-fine-uploader';
import { serverBaseURL } from 'libs/config';
import 'react-fine-uploader/gallery/gallery.css';

const allowedExtensions = ['jpeg', 'jpg', 'gif', 'png'];

export default class MultiImageUploader extends Component {
  static propTypes = {
    onUploadedFilesChanged: PropTypes.func.isRequired,
    initialUploadedFiles: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    initialUploadedFiles: [],
  };

  state = {
    fileUrls: this.props.initialUploadedFiles,
  };

  constructor(props) {
    super(props);
    this.uploader = new FineUploaderTraditional({
      options: {
        debug: true,
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
          sizeLimit: 10000000,
        },
      },
    });

    this.uploader.on('complete', (id, name, response) => {
      this.setState(
        ({ fileUrls }) => ({ fileUrls: [...fileUrls, response.url] }),
        () => this.props.onUploadedFilesChanged(this.state.fileUrls),
      );
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
  }

  componentDidMount() {
    const initialFilesWithMeta = this.props.initialUploadedFiles.map((url, index) => ({
      id: index,
      name: url.substring(url.lastIndexOf('/') + 1),
      thumbnailUrl: url,
      // thumbnailUrl: `https://please-staging.imgix.net/${url.substring(url.lastIndexOf('/') + 1)}`,
    }));
    this.uploader.methods.addInitialFiles(initialFilesWithMeta);
  }

  render() {
    const fileInputChildren = <span>Choose Files</span>;

    return <Gallery fileInput-children={fileInputChildren} uploader={this.uploader} />;
  }
}
