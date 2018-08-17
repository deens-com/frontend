import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FineUploaderTraditional from 'fine-uploader-wrappers';
import Gallery from 'react-fine-uploader';
import { serverBaseURL } from 'libs/config';

// ...or load this specific CSS file using a <link> tag in your document
import 'react-fine-uploader/gallery/gallery.css';

export default class MultiImageUploader extends Component {
  static propTypes = {
    onUploadedFilesChanged: PropTypes.func.isRequired,
  };

  state = {
    fileUrls: [],
  };

  constructor(props) {
    super(props);
    this.uploader = new FineUploaderTraditional({
      options: {
        autoUpload: true,
        chunking: {
          enabled: false,
        },
        deleteFile: {
          enabled: true,
          endpoint: `${serverBaseURL()}/media`,
        },
        request: {
          endpoint: `${serverBaseURL()}/media`,
        },
        validation: {
          allowedExtensions: ['jpeg', 'jpg', 'gif', 'png'],
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
      alert(errorReason);
    });
  }

  render() {
    const fileInputChildren = <span>Choose Files</span>;

    return <Gallery fileInput-children={fileInputChildren} uploader={this.uploader} />;
  }
}
