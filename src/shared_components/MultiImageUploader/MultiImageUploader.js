import React, { Component } from 'react';
import FineUploaderTraditional from 'fine-uploader-wrappers';
import Gallery from 'react-fine-uploader';
import { serverBaseURL } from 'libs/config';

// ...or load this specific CSS file using a <link> tag in your document
import 'react-fine-uploader/gallery/gallery.css';

const uploader = new FineUploaderTraditional({
  options: {
    autoUpload: true,
    chunking: {
      enabled: false,
    },
    deleteFile: {
      enabled: false,
      endpoint: '/uploads',
    },
    request: {
      endpoint: `${serverBaseURL}/media`,
    },
    validation: {
      allowedExtensions: ['jpeg', 'jpg', 'gif', 'png'],
    },
  },
});

export default class MultiImageUploader extends Component {
  render() {
    const fileInputChildren = <span>Choose Files</span>;

    return <Gallery fileInput-children={fileInputChildren} uploader={uploader} />;
  }
}
