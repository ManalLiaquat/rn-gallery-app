import { firebase, DB } from "../../config/firebase";

const uploadPhoto = (uri, folderName = "Gallery") => {
  return async dispatch => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function() {
        reject(new TypeError("Network request failed")); // error occurred, rejecting
      };
      xhr.responseType = "blob"; // use BlobModule's UriHandler
      xhr.open("GET", uri, true); // fetch the blob from uri in async mode
      xhr.send(null); // no initial data
    });

    let x = uri.split("/");
    let fileFormat = x[x.length - 1].split(".")[1];
    let fileName = `${new Date().getTime()}.${fileFormat}`;

    // do something with the blob, eg. upload it to firebase (API v5.6.0 below)
    const ref = firebase
      .storage()
      .ref()
      .child(`${folderName}/${fileName}`);

    const snapshot = await ref.put(blob);
    const remoteUri = await snapshot.ref.getDownloadURL();

    // when we're done sending it, close and release the blob
    blob.close();

    if (remoteUri.length > 0) {
      // return the result, eg. remote URI to the image
      dispatch({ type: "UPLOAD_PHOTO", remoteUri });
      console.log("*****remoteU­ri*****", remoteUri);
    }
  };
};

export { uploadPhoto };
