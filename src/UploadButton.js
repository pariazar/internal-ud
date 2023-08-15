import React, { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import axios from 'axios';
import { SpinningCircularProgress } from './SpinningCircularProgress';
import debounce from 'lodash.debounce'; // Import debounce function

const UploadButton = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Debounce the progress update to avoid unnecessary re-renders
  const debouncedProgressUpdate = useCallback(
    debounce((progress) => {
      setUploadProgress(progress);
    }, 100),
    []
  );

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
              debouncedProgressUpdate(progress); // Debounced progress update
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

  const formattedSize = (sizeInBytes) => {
    if (sizeInBytes >= 1024 * 1024) {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    } else if (sizeInBytes >= 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    }
    return `${sizeInBytes} bytes`;
  };

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
          /* Add more styles as needed */
        }}
      >
        {selectedFile ? (
          <div>
            <Typography variant="subtitle1">
              Selected File: {selectedFile.name}
            </Typography>
            <Typography variant="subtitle2">
              Size: {formattedSize(selectedFile.size)}
            </Typography>
            <SpinningCircularProgress
              variant="determinate"
              value={uploadProgress}
              size={60}
            />
            <Typography variant="caption">
              {uploadProgress}% Uploaded - {formattedSize(currentUploadedSize)}
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
