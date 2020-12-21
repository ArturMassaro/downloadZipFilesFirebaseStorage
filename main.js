require('dotenv').config();

const DownloadService = require('./Services/DownloadService');
const StorageRepository = require('./Repositories/StorageRepository');

async function main() {
  const downloadUrlList = await StorageRepository.listFilesForDownload();
  await DownloadService.downloadFiles(downloadUrlList);
  // await DownloadService.generateZipFile(downloadUrlList);
  console.log('\n\n Finalizado ! \n\n');
}

main();
