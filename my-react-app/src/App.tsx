import React, { useState } from 'react';
import { config,S3 } from 'aws-sdk'; // Import AWS SDK S3 class
import { S3StorageBucketName } from './commonVariables';

const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null); // Handle empty selection
  };

  config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  
  const s3 = new S3({});
  
  const handleUpload = async () => {
    if (!selectedFile) {
      console.error('No file selected for upload');
      return;
    }
  
    setUploadStatus('uploading');
  
    try {
      // Upload file to the storage bucket using AWS SDK
      const params = {
        Bucket: S3StorageBucketName,
        Key: selectedFile.name,
        Body: selectedFile,
        ContentType: selectedFile.type,
      };
      await s3.upload(params).promise(); // Upload the file to S3 bucket
  
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
