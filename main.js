import JSZip from "jszip";
import saveAs from "file-saver";

generateZipFile(photosToDownload) {

  var jszip = new JSZip();

  //Looping through to get the download url for each image
  for (let i = 0; i < photosToDownload.length; i++) {
    let photoName = photosToDownload[i].photo_image_name;
    let photoImageURL = photosToDownload[i].generated_image_url;

    let photoImageExtension = photoName.substr(photoName.length - 4);

    jszip.file(
      photoName + photoImageExtension, //in my case, this produces something like 'my image.jpg'
      this.downloadUrlAsPromise(photoImageURL) //generates the file we need to download
    );

    //If we have reached the last image in the loop, then generate the zip file
    if (i == photosToDownload.length - 1) {
      jszip.generateAsync({ type: "blob" }).then(function(content) {
        saveAs(content, "MyZipFile.zip");
      });
    }
  }
},

downloadUrlAsPromise(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.onreadystatechange = function(evt) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(new Error("Error for " + url + ": " + xhr.status));
        }
      }
    };
    xhr.send();
  });
}, 