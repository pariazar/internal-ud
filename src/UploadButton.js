import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import axios from 'axios';
import { SpinningCircularProgress } from './SpinningCircularProgress';

const UploadButton = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await axios.post(
          'http://localhost:3000/upload',
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              setUploadProgress(progress);
            },
          }
        );

        console.log(response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  // Calculate the current uploaded size based on progress
  const currentUploadedSize = Math.round(
    (selectedFile?.size * uploadProgress) / 100
  );

  // Convert the sizes to KB or MB as appropriate
  const formattedCurrentSize =
    currentUploadedSize >= 1024 && currentUploadedSize < 1024 * 1024
      ? `${(currentUploadedSize / 1024).toFixed(2)} KB`
      : currentUploadedSize >= 1024 * 1024
      ? `${(currentUploadedSize / (1024 * 1024)).toFixed(2)} MB`
      : `${currentUploadedSize} bytes`;

  return (
    <Box>
      <Typography variant="h5">File Uploader</Typography>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: '2px dashed #ccc',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        {selectedFile ? (
          <div>
            <Typography variant="subtitle1">
              Selected File: {selectedFile.name}
            </Typography>
            <Typography variant="subtitle2">
              Size: {selectedFile.size / 1024} KB (
              {selectedFile.size / (1024 * 1024)} MB)
            </Typography>
            <SpinningCircularProgress
              variant="determinate"
              value={uploadProgress}
              size={60}
            />
            <Typography variant="caption">
              {uploadProgress}% Uploaded - {formattedCurrentSize}
            </Typography>
          </div>
        ) : (
          <div>
            <CloudUpload fontSize="large" />
            <Typography>Drag & Drop a file here or click to select</Typography>
          </div>
        )}
      </div>
      <button onClick={handleUpload}>Start Upload</button>
    </Box>
  );
};

export default UploadButton;
