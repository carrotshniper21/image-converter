import http from "../http-common";

const upload = (file: File, onUploadProgress: any): Promise<any> => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const imageData = reader.result?.toString().split(",")[1];

      if (!imageData) {
        reject("Failed to read image data.");
        return;
      }

      const data = {
        "file": { "filetype": file.type, "contents": imageData }
      };


      http
        .post("/upload", data, {
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
          },
          onUploadProgress,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    };

    reader.readAsDataURL(file); // Read the file as a data URL
  });
}

export default upload;
