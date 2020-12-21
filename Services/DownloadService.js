/* eslint-disable no-await-in-loop */
const delay = require('delay');
const archiver = require('archiver');

const http = require('http');
const fs = require('fs');

class DownloadService {
  static async generateZipFile(fileList) {
    const output = fs.createWriteStream(`./images_${new Date().getTime()}.zip`);
    const archive = archiver('zip');

    output.on('close', () => {
      console.log(`${archive.pointer()} total bytes`);
      console.log(
        'archiver has been finalized and the output file descriptor has closed.'
      );
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    await fileList.reduce(async (sumPromisse, file, index) => {
      const fileName = file.fileName.includes('.jpg')
        ? file.fileName
        : `${file.fileName}.jpg`;
      let pipeFinished = false;
      const fileStream = fs.createWriteStream(`./tmp/${fileName}`);
      await http.get(file.downloadUrl, async (response) => {
        await response.pipe(fileStream).on('finish', () => {
          console.log('\n\n\n Finalizou o pipe \n\n\n');
          pipeFinished = true;
        });
      });

      archive.file(`./tmp/${fileName}`, { name: fileName });

      // append files from a sub-directory, putting its contents at the root of archive

      console.log(`finalizado - ${index}/${fileList.length}`);
    }, 0);

    archive.finalize();
  }

  static async downloadFiles(fileList) {
    await fileList.reduce(async (sumPromisse, file, index) => {
      // const sum = await index;
      const fileName = file.fileName.includes('.jpg')
        ? file.fileName
        : `${file.fileName}.jpg`;

      const fileStream = fs.createWriteStream(`./tmp/${fileName}`);
      http.get(file.downloadUrl, (response) => {
        response.pipe(fileStream);
      });

      console.log(`finalizado - ${index}/${fileList.length}`);
    }, 0);
  }
}

module.exports = DownloadService;
