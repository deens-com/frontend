const generateFilename = originalFileName => {
  try {
    const unixTimestamp = new Date().getTime();
    const randomInt = Math.floor(Math.random() * Math.floor(Math.pow(10, 10)));
    let filename = unixTimestamp + '-' + randomInt;
    let fileExtension = originalFileName.slice(((originalFileName.lastIndexOf('.') - 1) >>> 0) + 2);
    fileExtension = checkExtensionWhitelist(fileExtension);
    if (fileExtension.length) {
      return filename + '.' + fileExtension;
    } else {
      return '';
    }
  } catch (error) {
    console.log(error);
  }
};

const checkExtensionWhitelist = fileExtension => {
  if (
    fileExtension === 'jpg' ||
    fileExtension === 'JPG' ||
    fileExtension === 'png' ||
    fileExtension === 'PNG' ||
    fileExtension === 'jpeg' ||
    fileExtension === 'JPEG'
  ) {
    return fileExtension;
  } else {
    return '';
  }
};

module.exports = {
  generateFilename,
};
