const { machineLearning } = require('firebase-admin');

const admin = require('firebase-admin');

const firebaseConfig = require('../Credentials/FirebaseConfig');

class StorageRepository {
  static async listFilesForDownload() {
    const downloadUrlList = [];

    admin.initializeApp(firebaseConfig);
    const bucket = admin.storage().bucket();

    const [files] = await bucket.getFiles();

    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      downloadUrlList.push({
        downloadUrl: file.publicUrl().replace('https', 'http'),
        fileName: file.name.replace('/', '_'),
      });
    }

    return downloadUrlList;
  }
}

module.exports = StorageRepository;
