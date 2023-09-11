import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import upload from "./services/FileUploadService";
import JSZip from 'jszip';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [binaryData, setBinaryData] = useState<Uint8Array | null>(null);
  const [hexData, setHexData] = useState<string | null>(null);

  const handleUpload = () => {
    if (selectedFile) {
      upload(selectedFile, (progressEvent: ProgressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        console.log(`Upload Progress: ${percentCompleted}%`);
      })
        .then((response) => {
          setBinaryData(response.binary);
          setHexData(response.hex);
        })
        .catch((error) => {
          console.error("File upload error:", error);
        });
    }
  };

  useEffect(() => {
    if (selectedFile) {
      handleUpload();
    }
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setBinaryData(null);
      setHexData(null);
    }
  };

  const downloadZippedData = () => {
    if (binaryData && hexData) {
      const zip = new JSZip();
      zip.file('binary.txt', Array.from(binaryData).join(' '));
      zip.file('hex.txt', hexData);

      zip.generateAsync({ type: 'blob' }).then((content) => {
        // Create a temporary link to trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'binary_and_hex.zip';
        link.click();
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <label className="drop-container" id="dropcontainer">
          <span className="drop-title">Drop files here</span>
          or
          <input id="fileupload" type="file" name="fileupload" onChange={handleFileChange} required />
        </label>
        {binaryData && hexData && (
          <div>
            <button className="filedownload" id="filedownload" onClick={downloadZippedData}>Download Zipped Data</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

