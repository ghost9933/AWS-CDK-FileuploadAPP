import React, { useState } from 'react';
import axios from 'axios';
import { S3StorageBucketName } from './commonVariables';
import AWS from 'aws-sdk';

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
      // Fetching credentials from environment variables
      const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
      const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;

      // Update AWS config with environment variables
      AWS.config.update({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
      });

      // Create S3 instance
      const s3 = new AWS.S3();

      // Upload file to the storage bucket
      const params = {
        Bucket: S3StorageBucketName,
        Key: selectedFile.name,
        Body: selectedFile,
        ContentType: selectedFile.type,
      };

      await s3.upload(params).promise();
  
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
