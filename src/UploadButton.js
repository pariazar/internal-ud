import React, { useState, useCallback } from 'react';
import { Box, Input, TextField, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import axios from 'axios';
import { SpinningCircularProgress } from './SpinningCircularProgress';
import debounce from 'lodash.debounce';
import ChatApp from './SampleChat';

const UploadButton = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(null); // Declare cancelTokenSource
  const [isDragging, setIsDragging] = useState(false); // State for drag-and-drop

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
    setIsDragging(false); // Reset dragging state
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true); // Set dragging state
  };

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (selectedFile && !uploading) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        setUploading(true);
        setCanceling(false);

        const source = axios.CancelToken.source();
        setCancelTokenSource(source); // Store the cancelTokenSource

        const response = await axios.post(
          'http://localhost:3000/upload',
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              debouncedProgressUpdate(progress);
            },
            cancelToken: source.token,
          }
        );

        console.log(response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Upload canceled');
        } else {
          console.error('Error uploading file:', error);
        }
      } finally {
        setUploading(false);
        setSelectedFile(null);
        setUploadProgress(0);
        setCancelTokenSource(null); // Clear the cancelTokenSource
      }
    }
  };

  const handleCancel = () => {
    if (uploading && cancelTokenSource) {
      // Check if cancelTokenSource exists
      setCanceling(true);
      cancelTokenSource.cancel();
    }
  };

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
        onDragEnter={handleDragEnter} // Handle drag enter
        onDragLeave={handleDragLeave} // Handle drag leave
        style={{
          border: isDragging ? '2px dashed #ccc' : '',
          padding: isDragging ? '220px' : '',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragging ? '#f5f5f5' : 'transparent', // Apply background color during drag
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
            <div>
              <button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Start Upload'}
              </button>
              {uploading && (
                <button onClick={handleCancel} disabled={canceling}>
                  {canceling ? 'Canceling...' : 'Cancel Upload'}
                </button>
              )}
            </div>
          </div>
        ) : isDragging ? (
          <div>
            <CloudUpload fontSize="large" />
            <Typography>Drag & Drop a file here or click to select</Typography>
          </div>
        ) : (
          <ChatApp />
        )}
      </div>
    </Box>
  );
};

export default UploadButton;
