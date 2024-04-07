import React, { useState } from 'react';
import axios from 'axios';
import { S3StorageBucketName } from '../../commonVariables';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null); // Handle empty selection
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error('No file selected for upload');
      return;
    }

    setUploadStatus('uploading');

    try {
      // Upload file to the storage bucket
      const formData = new FormData();
      formData.append('file', selectedFile);

      await axios.put(`https://${S3StorageBucketName}.s3.amazonaws.com/${selectedFile.name}`, formData, {
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      setUploadStatus('success');
      setSelectedFile(null); // Clear file selection after successful upload
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('error');
    }
  };

  return (
    <div className="App">
      <h1>File Uploader</h1>
      <input type="file" onChange={handleFileChange} />
      <button disabled={!selectedFile || uploadStatus === 'uploading'} onClick={handleUpload}>
        {uploadStatus === 'idle' ? 'Upload' : uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Failed'}
      </button>

      {uploadStatus === 'success' && <p>File uploaded successfully!</p>}
      {uploadStatus === 'error' && <p>Error uploading file. Please try again.</p>}
    </div>
  );
}

export default App;
