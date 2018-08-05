import React, { Component } from 'react'
import Parse from 'parse';
import FineUploaderTraditional from 'fine-uploader-wrappers'
import Gallery from 'react-fine-uploader'

import { generateFilename } from 'libs/filename';

// ...or load this specific CSS file using a <link> tag in your document
import 'react-fine-uploader/gallery/gallery.css'

const uploader = new FineUploaderTraditional({
    options: {
        autoUpload: true,
        chunking: {
            enabled: false
        },
        deleteFile: {
            enabled: false,
            endpoint: '/uploads'
        },
        validation: {
            allowedExtensions: ['jpeg', 'jpg', 'gif', 'png']
        }
    }
})

// possible solution 1
// idea: intercept the fine uploader request and make it parse server compatible
// problem: I couldn't find a way to match the parse server request for the file upload using the fine uploader methods

// uploader.on('submit', async function (id, name) {
//   const filename = generateFilename(name);
//   console.log(filename);
//
//   uploader.methods.getEndpoint(id);
//   uploader.methods.setEndpoint('https://staging-internal-api.please.com/parse/files/'+filename, id);
// })

// possible solution 2
// idea: completely ignore fine uploader request and use parse
// problem: there are 2 issues but the major one is I couldn't find a way to ignore the fine uploader request it's making, then fetch the file's url and store it in the form

uploader.on('submit', async function (id, name) {
   let file = uploader.methods.getFile(id);
   let parseFile;

   const filename = generateFilename(file.name);
    if (filename.length) {
      parseFile = await new Parse.File(filename, file).save();
    }

    console.log(parseFile); // the file url it gets is wrong, and the file can not be downloaded for some reason
})

export default class MultiImageUploader extends Component {
    render() {
        const fileInputChildren = <span>Choose Files</span>

        return (
            <Gallery fileInput-children={ fileInputChildren } uploader={ uploader } />
        )
    }
}
